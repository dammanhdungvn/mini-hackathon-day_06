import os
import sys
import unicodedata
from typing import Any


sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from data_hotel import PHU_QUOC_HOTELS_DB


UNCLEAR_VALUES = {
    "",
    "chua ro",
    "chua nhap",
    "none",
    "null",
    "khong ro",
    "phu quoc",
    "phuquoc",
}


def _normalize(value: Any) -> str:
    text = str(value or "").strip().lower()
    text = unicodedata.normalize("NFD", text)
    text = "".join(char for char in text if unicodedata.category(char) != "Mn")
    return text.replace("đ", "d")


def _contains_any(haystack: str, needles: list[str]) -> bool:
    return any(needle and needle in haystack for needle in needles)


def fetch_matching_hotels(
    travel_purpose: str,
    budget_tier: str,
    area: str,
    key_requirements: list[str],
) -> list[dict]:
    """
    Query the Phu Quoc hotel database using semantic constraints extracted from a
    traveler conversation.

    Args:
        travel_purpose: Trip purpose or companion type, for example "Cap doi",
            "Gia dinh", "Ban be", "Cong tac", or "Solo".
        budget_tier: Desired price tier. Supported values are "Cao cap",
            "Tam trung", "Tiet kiem", or unclear values such as "Chua ro".
        area: Preferred Phu Quoc area, for example "Bai Truong", "Duong Dong",
            "Bai Khem", "An Thoi", or an unclear value.
        key_requirements: Important amenities or needs, for example
            ["Ho boi sat bien", "Spa", "Kids Club"].

    Returns:
        A list of up to three matching hotel dictionaries. Each result includes
        the original hotel fields plus "match_score" and "matched_reasons" so the
        model can explain the recommendation from retrieved data.
    """
    normalized_budget = _normalize(budget_tier)
    normalized_area = _normalize(area)
    normalized_purpose = _normalize(travel_purpose)
    normalized_requirements = [_normalize(item) for item in key_requirements or []]

    matched_results: list[dict] = []

    for hotel in PHU_QUOC_HOTELS_DB:
        hotel_tier = _normalize(hotel.get("price_tier"))
        hotel_area = _normalize(hotel.get("area"))

        if normalized_budget not in UNCLEAR_VALUES and hotel_tier != normalized_budget:
            continue

        if normalized_area not in UNCLEAR_VALUES and normalized_area not in hotel_area:
            continue

        searchable_parts = [
            hotel.get("name", ""),
            hotel.get("area", ""),
            hotel.get("price_tier", ""),
            hotel.get("usp", ""),
            " ".join(hotel.get("room_types", [])),
            " ".join(hotel.get("amenities", [])),
        ]
        searchable_text = _normalize(" ".join(searchable_parts))

        score = 60
        reasons: list[str] = []

        if normalized_budget not in UNCLEAR_VALUES:
            score += 15
            reasons.append(f"Khớp phân khúc {hotel.get('price_tier')}")

        if normalized_area not in UNCLEAR_VALUES:
            score += 12
            reasons.append(f"Khớp khu vực {hotel.get('area')}")

        for requirement in normalized_requirements:
            if requirement and requirement in searchable_text:
                score += 8
                reasons.append(f"Khớp yêu cầu: {requirement}")

        purpose_signals = {
            "cap doi": ["lang man", "hoang hon", "spa", "yen", "rieng", "villa"],
            "honeymoon": ["lang man", "hoang hon", "spa", "yen", "rieng", "villa"],
            "gia dinh": ["family", "kids", "tre em", "villa", "ho boi", "grand world"],
            "ban be": ["bar", "beach club", "nightlife", "show", "casino", "grand world"],
            "cong tac": ["co-working", "hoi nghi", "workspace", "lam viec", "meeting"],
            "solo": ["eco", "healing", "hostel", "bungalow", "khong gian xanh"],
        }

        for purpose, signals in purpose_signals.items():
            if purpose in normalized_purpose and _contains_any(searchable_text, signals):
                score += 10
                reasons.append(f"Phù hợp mục đích chuyến đi: {travel_purpose}")
                break

        hotel_entry = dict(hotel)
        hotel_entry["match_score"] = min(score, 99)
        hotel_entry["matched_reasons"] = reasons
        matched_results.append(hotel_entry)

    matched_results.sort(
        key=lambda item: (item.get("match_score", 0), -item.get("est_price_vnd", 0)),
        reverse=True,
    )
    return matched_results[:3]
