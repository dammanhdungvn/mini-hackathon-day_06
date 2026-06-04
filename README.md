# 🏨 Voyage Intelligence — AI Hotel Advisor

> Chatbot AI tư vấn khách sạn Phú Quốc sử dụng Alibaba Qwen3-max với tool-calling, giúp du khách chọn lưu trú phù hợp theo ngân sách, phong cách và sở thích cá nhân.

![Status](https://img.shields.io/badge/Status-MVP_Demo-green)

---

## 📋 Mô tả sản phẩm

**Vấn đề:** Khách du lịch gặp khó khăn khi lướt qua hàng trăm lựa chọn khách sạn trên OTA (Booking, Agoda), tốn thời gian tự lọc theo ngân sách, vị trí và tiện ích.

**Giải pháp:** Ứng dụng AI đóng vai trò như một tư vấn viên du lịch địa phương. Lắng nghe nhu cầu qua chat tự nhiên, tự động trích xuất các tiêu chí, truy vấn cơ sở dữ liệu khách sạn tại Phú Quốc và đề xuất khách sạn chính xác kèm theo lý do.

**Chức năng chính:**
- Chatbot AI giao tiếp bằng Tiếng Việt.
- Cơ chế **Tool-calling** tự động filter database 21 khách sạn.
- Giao diện 3 cột: Cấu hình thông số chuyến đi, Danh sách gợi ý, và Trò chuyện.
- Chế độ Admin theo dõi luồng AI parse dữ liệu.
- Tích hợp sẵn 4 kịch bản test (Happy Case, Error Case, Low Confidence, Freestyle).

---

## 👥 Thành viên nhóm

| Mã HV | Họ tên | Vai trò |
|--------|--------|---------|
| 2A202600741 | Đàm Mạnh Dũng | AI / Backend Developer |
| 2A202600846 | Nguyễn Hoàng Thanh Tùng | Tech Lead / Full-stack |
| 2A202600755 | Lê Bá Chiến | UI/UX & QA |

---

## 📌 Phân công công việc

| Hạng mục | Mã HV | Người phụ trách |
|----------|--------|-----------------|
| Thiết kế SPEC | 2A202600741 | Đàm Mạnh Dũng |
| Xây dựng Prototype | 2A202600846 | Nguyễn Hoàng Thanh Tùng |
| Lập trình UI/UX | 2A202600755 | Lê Bá Chiến |
| Lập trình Backend/API | 2A202600741 | Đàm Mạnh Dũng |
| AI workflow / Prompt | 2A202600846 | Nguyễn Hoàng Thanh Tùng |
| Quản lý repo (Documentation)| 2A202600741 | Đàm Mạnh Dũng |
| Testing | 2A202600755 | Lê Bá Chiến |
| Kịch bản Demo script | 2A202600755 | Lê Bá Chiến |

---

## 📂 Cấu trúc repo

- `README.md`: Tài liệu tổng quan dự án (bạn đang đọc).
- `spec/`: Chứa các tài liệu thiết kế (Đặc tả sản phẩm, Luồng người dùng, Kịch bản AI workflow, và Kịch bản Demo chấm thi).
- `codebase/`: Chứa toàn bộ mã nguồn của ứng dụng.

---

## 🔗 Link nhanh

- **Hướng dẫn chạy code (Dành cho Giảng viên/Dev):** [Xem hướng dẫn cài đặt trong codebase/README.md](codebase/README.md)
- **Link Demo Prototype:** *(Ứng dụng chưa deploy public, vui lòng chạy theo hướng dẫn ở link trên)*
