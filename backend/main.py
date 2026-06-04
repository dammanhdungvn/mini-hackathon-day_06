import json
import os
import urllib.error
import urllib.request
from typing import Any, List

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from tools import PHU_QUOC_HOTELS_DB, fetch_matching_hotels
except ImportError:
    from backend.tools import PHU_QUOC_HOTELS_DB, fetch_matching_hotels


BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)

load_dotenv(os.path.join(BACKEND_DIR, ".env"))
load_dotenv(os.path.join(PROJECT_ROOT, ".env"))

ALIBABA_BASE_URL = (
    os.environ.get("DASHSCOPE_BASE_URL")
    or os.environ.get("ALIBABA_BASE_URL")
    or "https://ws-7z0pgh6qqcnccram.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1"
).rstrip("/")
ALIBABA_MODEL = os.environ.get("DASHSCOPE_MODEL") or os.environ.get("ALIBABA_MODEL") or "qwen3-max"

app = FastAPI(title="AI Hotel Advisor Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TripInfo(BaseModel):
    destination: str = ""
    budget: str = ""
    budgetVal: int = 0
    guests: int = 1
    travelStyle: str = ""
    preference: str = ""


class Message(BaseModel):
    id: str = ""
    sender: str
    text: str
    timestamp: str = ""


class ChatRequest(BaseModel):
    message: str
    trip: TripInfo
    demoCase: str = "custom"
    history: List[Message] = []


def load_backend_json(filename: str, fallback: Any) -> Any:
    file_path = os.path.join(BACKEND_DIR, filename)
    if not os.path.exists(file_path):
        return fallback
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


DEMO_CASES = load_backend_json("demo_cases.json", {})
HOTEL_IMAGES = load_backend_json("hotel_images.json", {})


def get_alibaba_api_key() -> str:
    api_key = os.environ.get("DASHSCOPE_API_KEY") or os.environ.get("ALIBABA_API_KEY")
    if not api_key or api_key == "YOUR_DASHSCOPE_API_KEY":
        raise RuntimeError("Missing DASHSCOPE_API_KEY in backend/.env")
    return api_key


def call_alibaba_chat(messages: list[dict[str, str]]) -> str:
    payload = json.dumps(
        {
            "model": ALIBABA_MODEL,
            "messages": messages,
            "temperature": 0.7,
        },
        ensure_ascii=False,
    ).encode("utf-8")

    request = urllib.request.Request(
        f"{ALIBABA_BASE_URL}/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {get_alibaba_api_key()}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Alibaba Model Studio error {exc.code}: {detail}") from exc

    content = data.get("choices", [{}])[0].get("message", {}).get("content")
    if not content:
        raise RuntimeError("Alibaba Model Studio returned an empty response")
    return content


def infer_budget_tier(trip: TripInfo) -> str:
    budget_vnd = trip.budgetVal * 1000
    if budget_vnd <= 0:
        return "Chưa rõ"
    if budget_vnd >= 3_500_000:
        return "Cao cấp"
    if budget_vnd >= 1_500_000:
        return "Tầm trung"
    return "Tiết kiệm"


def format_price(price_vnd: int) -> str:
    return f"{price_vnd / 1_000_000:.1f}M VND/đêm".replace(".0", "")


def map_hotel_for_ui(hotel: dict[str, Any], trip: TripInfo) -> dict[str, Any]:
    price_vnd = int(hotel.get("est_price_vnd", 0))
    price_tier = hotel.get("price_tier", "Tầm trung")
    stars = 5 if price_tier == "Cao cấp" else 3 if price_tier == "Tiết kiệm" else 4
    price_text = format_price(price_vnd)
    match_percent = int(hotel.get("match_score", 80))
    budget_vnd = trip.budgetVal * 1000
    price_diff = price_vnd - budget_vnd

    why_fits = f"Phân khúc {price_tier.lower()} tại {hotel.get('area')}."
    if budget_vnd > 0 and price_diff <= 0:
        why_fits += f" Giá {price_text} nằm trong ngân sách {trip.budget}."
    elif budget_vnd > 0:
        why_fits += f" Giá {price_text} cao hơn ngân sách {trip.budget}, nhưng có thể cân nhắc nếu ưu tiên trải nghiệm."

    return {
        "id": hotel.get("id"),
        "name": hotel.get("name"),
        "matchPercent": max(10, min(99, match_percent)),
        "stars": stars,
        "location": f"{hotel.get('area')}, Phú Quốc, Việt Nam",
        "tags": hotel.get("amenities", [])[:2] + [price_tier],
        "priceText": price_text,
        "priceVal": price_vnd / 1000,
        "whyFits": why_fits,
        "imgUrl": HOTEL_IMAGES.get(hotel.get("id"), "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"),
        "details": f"{hotel.get('usp')} Các loại phòng: {', '.join(hotel.get('room_types', []))}.",
    }


def fetch_hotels_for_trip(trip: TripInfo) -> list[dict[str, Any]]:
    requirements = [trip.preference] if trip.preference else []
    return fetch_matching_hotels(
        travel_purpose=trip.travelStyle or "Chưa rõ",
        budget_tier=infer_budget_tier(trip),
        area="Chưa rõ",
        key_requirements=requirements,
    )


def build_system_prompt(req: ChatRequest, hotels: list[dict[str, Any]]) -> str:
    hotel_context = "\n".join(
        f"{idx + 1}. {hotel.get('name')} | {format_price(int(hotel.get('est_price_vnd', 0)))} | "
        f"{hotel.get('area')} | {hotel.get('usp')} | Tiện ích: {', '.join(hotel.get('amenities', []))}"
        for idx, hotel in enumerate(hotels)
    )

    return f"""
Bạn là AI Hotel Advisor, trợ lý tư vấn khách sạn Phú Quốc.

Thông tin chuyến đi:
- Điểm đến: {req.trip.destination or 'Chưa xác định'}
- Ngân sách: {req.trip.budget or 'Chưa nhập'} ({req.trip.budgetVal})
- Số khách: {req.trip.guests}
- Phong cách: {req.trip.travelStyle or 'Chưa nhập'}
- Ưu tiên: {req.trip.preference or 'Chưa nhập'}
- Demo case: {req.demoCase}

Dữ liệu khách sạn do backend tool fetch_matching_hotels trả về:
{hotel_context or 'Chưa có khách sạn phù hợp do thiếu dữ liệu đầu vào.'}

Chỉ tư vấn dựa trên dữ liệu tool ở trên. Trả lời bằng tiếng Việt tự nhiên, rõ ràng, tối đa 2-3 đoạn. Nếu thiếu thông tin, hỏi lại ngắn gọn. Nếu ngân sách mâu thuẫn với yêu cầu, nêu rõ và đề xuất hướng điều chỉnh.
""".strip()


@app.get("/api/health")
def health_check():
    return {"status": "ok", "provider": "alibaba-model-studio", "model": ALIBABA_MODEL}


@app.get("/api/demo-cases")
def get_demo_cases():
    return DEMO_CASES


@app.post("/api/hotels")
def get_matched_hotels(trip: TripInfo):
    if not trip.destination:
        return []
    hotels = fetch_hotels_for_trip(trip)
    if not hotels:
        hotels = PHU_QUOC_HOTELS_DB[:3]
    return [map_hotel_for_ui(hotel, trip) for hotel in hotels]


@app.post("/api/chat")
async def chat_handler(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message payload is required")

    hotels = fetch_hotels_for_trip(req.trip)
    system_prompt = build_system_prompt(req, hotels)
    messages = [{"role": "system", "content": system_prompt}]

    for msg in req.history[-6:]:
        messages.append(
            {
                "role": "user" if msg.sender == "user" else "assistant",
                "content": msg.text,
            }
        )

    messages.append({"role": "user", "content": req.message})

    try:
        reply_text = call_alibaba_chat(messages)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {
        "text": reply_text,
        "provider": "alibaba-model-studio",
        "model": ALIBABA_MODEL,
        "toolResults": hotels,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
