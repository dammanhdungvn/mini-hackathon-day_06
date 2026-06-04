import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to sys.path to import data_hotel
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from data_hotel import PHU_QUOC_HOTELS_DB

app = FastAPI(title="Voyage Intelligence API Backend")

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request validation
class TripInfo(BaseModel):
    destination: str
    budget: str
    budgetVal: int
    guests: int
    travelStyle: str
    preference: str

class Message(BaseModel):
    id: str
    sender: str
    text: str
    timestamp: str

class ChatRequest(BaseModel):
    message: str
    trip: TripInfo
    demoCase: str
    history: List[Message]
    forceMock: Optional[bool] = False

# Image mapping for hotels based on ID to maintain rich aesthetics
def get_hotel_image(hotel_id: str) -> str:
    images = {
        "luxury_01": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
        "luxury_02": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
        "luxury_03": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        "luxury_04": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
        "luxury_05": "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
        "luxury_06": "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=80",
        "luxury_07": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        "mid_01": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
        "mid_02": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
        "mid_03": "https://images.unsplash.com/photo-1529290130-4ca3753253ae?auto=format&fit=crop&w=800&q=80",
        "mid_04": "https://images.unsplash.com/photo-1563911302283-d2bc1d982df5?auto=format&fit=crop&w=800&q=80",
        "mid_05": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
        "mid_06": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
        "mid_07": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
        "mid_08": "https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=800&q=80",
    }
    return images.get(hotel_id, "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80")

# Simulated automated fallback answers in Vietnamese to ensure the app works flawlessly no matter what
def get_simulated_response(text: str, trip: TripInfo, demo_case: str) -> str:
    norm = text.lower()
    dest = trip.destination or 'Phú Quốc'
    
    if demo_case == 'error':
        return (
            "Chào bạn! Mình thấy **Thông tin hành trình** bên trái đang khuyết trường Điểm đến hoặc Ngân sách.\n\n"
            "Để mình có thể kết nối dữ liệu và tìm ra khách sạn có hồ bơi hoặc bãi biển ưng ý nhất tại Việt Nam tầm giá tốt, "
            "bạn có thể hoàn tất chọn điểm đến (ví dụ: Phú Quốc, Nha Trang...) và kéo thanh ngân sách ước tính nhé!"
        )
    
    if demo_case == 'low_confidence':
        return (
            f"Chào bạn! Mình nhận thấy yêu cầu tìm kiếm **resort 5 sao siêu sang trọng có bãi biển riêng biệt lập** mâu thuẫn lớn với ngân sách đề xuất **0.8M VNĐ/đêm**.\n\n"
            f"Thông thường, resort 5 sao quốc tế tại {dest} như SOL by Meliá (1.8M/đêm) hay InterContinental (4.2M/đêm) có giá cao hơn khá nhiều. Bạn có muốn cân nhắc các phương án kế tiếp:\n\n"
            f"1. **Nâng ngân sách** lên khoảng 1.8M - 2.0M để giữ nguyên tiêu chuẩn cao cấp sát biển.\n"
            f"2. **Giữ nguyên mức chi phí 800k** và đổi sang khách sạn 3 sao lân cận bãi tắm công cộng."
        )

    # Keywords checks
    if any(k in norm for k in ['sol', 'meliá', 'melia']):
        return (
            "**SOL by Meliá Phu Quoc** (match 95%) là điểm đến cực kỳ xuất sắc tại Bãi Trường. "
            "Resort mang đặc trưng phong cách Tây Ban Nha tự do, hồ bơi sát biển, bãi biển riêng lộng gió và vô vàn hoạt động rèn luyện như Yoga, chèo sup.\n\n"
            "Mức giá phòng 1.8M VND/đêm hoàn toàn khớp với chi phí tối đa của bạn (2.0M). Bạn có muốn mình hỗ trợ giữ phòng trực tiếp tại SOL không?"
        )

    if any(k in norm for k in ['lahana', 'ecolodge', 'eco']):
        return (
            "**Lahana Resort Phu Quoc & Spa** (match 90%) là lựa chọn xanh bảo vệ môi trường nằm nổi bật trên sườn đồi Dương Đông. "
            "Điểm nhấn tuyệt vời nhất ở đây là hồ bơi vô cực sườn đồi cao đón hoàng hôn cực kỳ lãng mạn cho các cặp đôi. "
            "Với giá chỉ 1.6M VND/đêm, bạn cũng sẽ tiết kiệm ngân sách đáng kể!"
        )

    if any(k in norm for k in ['đổi', 'phương án khác', 'nha trang', 'đà nẵng']):
        return (
            "Dạ vâng! Mình có thể đề xuất thêm một số điểm đến tuyệt mỹ khác là **Nha Trang** hoặc **Đà Nẵng** "
            "với các tổ hợp khách sạn boutique sát biển chuẩn 4-5 sao phù hợp đúng ngân sách của bạn.\n\n"
            "Bạn hãy cập nhật trường Điểm đến ở thẻ Thông tin hành trình bên trái để dữ liệu cập nhật ngay tức thì nhé!"
        )

    return (
        f"Chào bạn! Mình đã nắm thông tin bạn muốn đi **{dest}** nghỉ dưỡng dành cho **{trip.guests} người**.\n\n"
        f"Dựa trên các tiêu chí bạn thiết lập, mình khuyến nghị **SOL by Meliá Phú Quốc** (1.8M/đêm) hoặc **Lahana Resort** (1.6M/đêm) "
        f"vì sự yên tĩnh và vị trí bãi tắm tuyệt đỉnh sát mép sóng. Cả hai đều thuộc phân khúc tầm trung xuất sắc hàng đầu.\n\n"
        f"Bạn cần mình cung cấp chi tiết thêm về dịch vụ ăn uống, spa, hay đặt lịch trình tham quan không ạ?"
    )

# Static DEMO CASES
DEMO_CASES = {
    "happy": {
        "trip": {
            "destination": "Phú Quốc",
            "budget": "2.0M VND / đêm",
            "budgetVal": 2000,
            "guests": 2,
            "travelStyle": "Yên tĩnh, cặp đôi",
            "preference": "Sát bãi biển, nghỉ dưỡng"
        },
        "analysis": "Tìm thấy các khách sạn phù hợp tại Phú Quốc. Top lựa chọn dưới đây được chọn lọc dựa trên phong cách yên tĩnh sát biển và ngân sách của bạn.",
        "messages": [
            {
                "id": "h1",
                "sender": "user",
                "text": "Tôi đi Phú Quốc 2 người, ngân sách 2 triệu mỗi đêm, muốn gần biển và yên tĩnh.",
                "timestamp": "10:42"
            },
            {
                "id": "h2",
                "sender": "assistant",
                "text": "Chào bạn! Mình đã tìm thấy các khách sạn ở Phú Quốc đáp ứng các yêu cầu của bạn: sát biển, không gian yên tĩnh và trong tầm giá 2 triệu VNĐ.\n\nNổi bật nhất là **SOL by Meliá** với bãi biển riêng tuyệt đẹp (giá 1.8M/đêm, match 95%). Ngoài ra, **Lahana Resort** (1.6M/đêm, match 90%) cũng rất phù hợp nếu bạn yêu thích không gian xanh sườn đồi và hồ bơi vô cực ngắm hoàng hôn ngút ngàn.\n\nBạn muốn tìm hiểu kỹ hơn hay đặt phòng của resort nào trong số này ạ?",
                "timestamp": "10:43"
            }
        ]
    },
    "error": {
        "trip": {
            "destination": "",
            "budget": "Chưa xác định",
            "budgetVal": 0,
            "guests": 1,
            "travelStyle": "Nhộn nhịp",
            "preference": "Gần trung tâm mua sắm"
        },
        "analysis": "⚠️ Thông tin hành trình chưa đầy đủ (Thiếu Điểm đến & Hạn mức ngân sách). Hãy cung cấp thêm thông tin để Trợ lý AI có thể đề xuất khách sạn phù hợp nhất cho chuyến đi của bạn.",
        "messages": [
            {
                "id": "e1",
                "sender": "user",
                "text": "Tôi muốn tìm một khách sạn có bể bơi đẹp để đi du lịch.",
                "timestamp": "11:05"
            },
            {
                "id": "e2",
                "sender": "assistant",
                "text": "Xin chào! Mình rất sẵn lòng hỗ trợ bạn tìm kiếm khách sạn hoàn hảo có hồ bơi tuyệt đẹp.\n\nTuy nhiên, để mình có thể đề xuất chính xác các lựa chọn tốt nhất, bạn có thể chia sẻ thêm: \n1. **Địa điểm du lịch** bạn dự kiến ghé thăm là đâu? (ví dụ: Phú Quốc, Nha Trang, Đà Nẵng...)\n2. **Ngân sách dự kiến** cho mỗi đêm là khoảng bao nhiêu?\n3. Chuyến đi của bạn có tổng cộng bao nhiêu thành viên?\n\nBạn có thể điền thông tin vào phiếu bên trái hoặc trực tiếp chat tại đây nhé!",
                "timestamp": "11:06"
            }
        ]
    },
    "low_confidence": {
        "trip": {
            "destination": "Phú Quốc",
            "budget": "0.8M VND / đêm",
            "budgetVal": 800,
            "guests": 2,
            "travelStyle": "Sang trọng bậc nhất",
            "preference": "Resort 5 sao siêu sang, bãi biển riêng biệt lập"
        },
        "analysis": "⚠️ Mức độ tin cậy thấp (Mâu thuẫn dữ liệu). Có sự không khớp giữa ngân sách tiết kiệm (0.8M VNĐ/đêm) và yêu cầu phong cách thiết kế sang trọng 5 sao quốc tế bậc nhất.",
        "messages": [
            {
                "id": "l1",
                "sender": "user",
                "text": "Tôi muốn tìm resort 5 sao sang trọng nhất Phú Quốc sát biển có bãi tắm riêng, ngân sách tầm 800k một đêm thôi nha.",
                "timestamp": "11:12"
            },
            {
                "id": "l2",
                "sender": "assistant",
                "text": "Cảm ơn yêu cầu chi tiết từ bạn. Ở đây mình phát hiện một điểm chưa đồng nhất: các **resort 5 sao đẳng cấp sang trọng bậc nhất** sát biển tại Phú Quốc thường có giá dao động từ **3.5M đến hơn 10.0M VND/đêm**, vượt khá xa ngân sách dự chi **800k VND/đêm** của bạn.\n\nĐể hỗ trợ bạn tốt nhất, mình xin xuất ra 2 phương án cân nhắc:\n1. **Giữ nguyên tiêu chuẩn resort 5 sao**: Nâng ngân sách lên khoảng 3M-4M để chọn **SOL by Meliá** hoặc **InterContinental Phú Quốc** (rất sang trọng).\n2. **Giữ nguyên ngân sách 800k**: Điều chỉnh xuống khách sạn 3 sao, homestay xinh xắn cách biển tầm 500m.\n\nBạn ưu tiên theo hướng giải quyết nào hơn để mình tiếp tục hỗ trợ phân tích sâu hơn?",
                "timestamp": "11:13"
            }
        ]
    }
}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/demo-cases")
def get_demo_cases():
    return DEMO_CASES

@app.post("/api/hotels")
def get_matched_hotels(trip: TripInfo):
    destination = trip.destination.lower().strip()
    if not destination:
        return []
    
    # Scale: budgetVal is in thousands (e.g. 2000 = 2,000,000 VND)
    budget_vnd = trip.budgetVal * 1000
    travel_style = trip.travelStyle.lower()
    preference = trip.preference.lower()
    
    # We filter/match against PHU_QUOC_HOTELS_DB
    is_dest_match = "phú quốc" in destination or "phu quoc" in destination
    
    matched_list = []
    for hotel in PHU_QUOC_HOTELS_DB:
        match_percent = 80
        
        # 1. Destination Match Check
        if not is_dest_match:
            match_percent -= 50
            
        # 2. Budget Match Check
        price_vnd = hotel.get("est_price_vnd", 0)
        price_diff = price_vnd - budget_vnd
        
        if budget_vnd > 0:
            if price_diff <= 0:
                match_percent += 10
            else:
                over_factor = price_diff / budget_vnd
                match_percent -= min(30, int(over_factor * 15))
        
        # 3. Travel Style and Preference matches
        tags = hotel.get("amenities", []) + [hotel.get("price_tier", "")] + [hotel.get("usp", "")]
        tags_lower = [t.lower() for t in tags]
        
        if "yên tĩnh" in travel_style or "peaceful" in travel_style:
            if any(k in t for k in ["yên", "biệt lập", "eco", "spa", "yoga"] for t in tags_lower):
                match_percent += 5
        if any(k in preference for k in ["sát bãi biển", "beach", "biển"]):
            if any("biển" in t or "bãi tắm" in t or "bãi trường" in t or "bãi khem" in t or "bãi dài" in t for t in tags_lower):
                match_percent += 5
                
        match_percent = max(10, min(99, match_percent))
        
        # Derive stars from tier
        price_tier = hotel.get("price_tier", "Tầm trung")
        if price_tier == "Cao cấp":
            stars = 5
        elif price_tier == "Tầm trung":
            stars = 4
        else:
            stars = 3
            
        price_text = f"{price_vnd / 1_000_000:.1f}M VND/đêm".replace(".0", "")
        
        # Explain why it fits
        why_fits = f"Resort phân khúc {price_tier.lower()} tại {hotel.get('area')}. "
        if price_diff <= 0:
            why_fits += f"Giá {price_text} nằm gọn trong ngân sách tối đa {trip.budget} của bạn."
        else:
            why_fits += f"Mức giá {price_text} hơi vượt quá hạn mức {trip.budget} một chút nhưng đem lại chất lượng vượt trội."
            
        img_url = get_hotel_image(hotel.get("id"))
        
        matched_list.append({
            "id": hotel.get("id"),
            "name": hotel.get("name"),
            "matchPercent": match_percent,
            "stars": stars,
            "location": f"{hotel.get('area')}, Phú Quốc, Việt Nam",
            "tags": hotel.get("amenities")[:2] + [price_tier],
            "priceText": price_text,
            "priceVal": price_vnd / 1000, # scaled to match budgetVal
            "whyFits": why_fits,
            "imgUrl": img_url,
            "details": f"{hotel.get('usp')} Các loại phòng tiêu chuẩn: {', '.join(hotel.get('room_types', []))}."
        })
        
    # If the search destination matched Phú Quốc, filter only destination matches
    dest_matches = [h for h in matched_list if is_dest_match]
    final_matches = dest_matches if dest_matches else matched_list
    
    # Sort by match percentage in descending order
    return sorted(final_matches, key=lambda x: x["matchPercent"], reverse=True)

@app.post("/api/chat")
async def chat_handler(req: ChatRequest):
    message = req.message
    trip = req.trip
    demo_case = req.demoCase
    history = req.history
    force_mock = req.forceMock
    
    if force_mock:
        reply_text = get_simulated_response(message, trip, demo_case)
        return {"text": reply_text, "simulated": True}
        
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or api_key == "MY_GEMINI_API_KEY":
        # Fallback to simulated offline response if key is missing/placeholder
        reply_text = get_simulated_response(message, trip, demo_case)
        return {"text": reply_text, "simulated": True, "warning": "GEMINI_API_KEY is not configured, running in mock mode"}
        
    try:
        # Initialize Google GenAI client (using the new client SDK)
        client = genai.Client(api_key=api_key)
        
        # Build System Prompt
        budget_str = f"{(trip.budgetVal / 1000).toFixed(1)}M VND/đêm" if trip.budgetVal > 0 else "Chưa nhập hạn mức chi phí"
        system_instruction = f"""You are "Voyage Intelligence", a high-end digital travel concierge and AI Hotel Advisor for luxury, eco and boutique resorts in Vietnam (Phú Quốc, Nha Trang, Đà Nẵng, etc.).
Your goal is to guide travelers in planning their trips, looking up hotels, and recommending suitable options.

Presently, the user's trip itinerary consists of:
- Điểm đến (Destination): {trip.destination or 'Chưa xác định'}
- Ngân sách (Budget): {budget_str}
- Số người (Guests): {trip.guests} người
- Phong cách du lịch (Travel Style): {trip.travelStyle or 'Chưa nhập'}
- Sở thích quan tâm (Preference): {trip.preference or 'Chưa nhập'}

Active Demo Case Context: {demo_case or 'normal'}

Our Registry Databank has 4 properties:
1. SOL by Meliá Phu Quoc (1.8M VND/đêm, match 95%, tag: Tầm trung, Hồ bơi sát biển, Yoga bãi biển)
2. Lahana Resort Phu Quoc & Spa (1.6M VND/đêm, match 90%, tag: Eco-Friendly, Hồ bơi vô cực, Nhà hàng độc bản)
3. InterContinental Phu Quoc Long Beach Resort (4.2M VND/đêm, match 85%, tag: Sang trọng, Bãi biển riêng, Spa & Wellness)
4. Novotel Phu Quoc Resort (2.1M VND/đêm, match 82%, tag: Gia đình, Hồ bơi ngoài trời, Sát biển bãi Trường)

Guidelines:
1. Respond fully in natural, elite, helpful Vietnamese (Tiếng Việt thanh lịch, chuẩn mực, hiếu khách).
2. Read the user's input, the current trip summary details above, and relate your answer directly to our databank.
3. If "demoCase" is "low_confidence", highlight the explicit contradiction between budget limit and luxurious requests (e.g., trying to book a 5-star resort with 800k VND) and suggest compromises.
4. If "demoCase" is "error", politely instruct them to fill in the destination and budget on the left card so you can parse exact rates.
5. Limit responses to 2-3 clean, compact paragraphs with bold highlights (using **). Do not write extremely long reports. Keep explanations friendly."""

        # Format history
        contents = []
        for msg in history[-6:]: # send last 6 messages
            role = "user" if msg.sender == "user" else "model"
            contents.append(types.Content(role=role, parts=[types.Part.from_text(msg.text)]))
            
        # Add current message
        contents.append(types.Content(role="user", parts=[types.Part.from_text(message)]))
        
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.75,
            )
        )
        
        return {"text": response.text or "", "simulated": False}
        
    except Exception as e:
        # Fallback to simulated offline response in case of API failure
        fallback_text = get_simulated_response(message, trip, demo_case)
        return {
            "text": f"{fallback_text}\n\n*(Lưu ý: Đã kích hoạt bộ chuyển đổi thông minh dự phòng do API đang tải: {str(e)})*",
            "simulated": True,
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
