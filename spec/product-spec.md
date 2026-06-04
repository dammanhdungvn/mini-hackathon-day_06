# 📝 Đặc Tả Sản Phẩm: Voyage Intelligence - AI Hotel Advisor

## 1. Giới thiệu chung
**Voyage Intelligence** là một ứng dụng web mô phỏng (prototype) trợ lý ảo AI chuyên biệt cho ngành du lịch. Sản phẩm giúp khách hàng cá nhân hóa trải nghiệm tìm kiếm và lựa chọn phòng khách sạn tại Phú Quốc thông qua giao diện trò chuyện tự nhiên.

## 2. Vấn đề giải quyết
Khách du lịch thường bị "ngợp" trước hàng trăm lựa chọn khách sạn trên các trang OTA (Online Travel Agency) như Agoda, Booking.com. Việc tự lọc theo ngân sách, vị trí và tiện ích tốn nhiều thời gian và đôi khi dẫn đến quyết định sai lầm.

## 3. Giải pháp công nghệ
Sử dụng AI tạo sinh (Alibaba Qwen3-max) kết hợp với kỹ thuật **Function Calling (Tool-calling)** để kết nối ngôn ngữ tự nhiên của con người với cơ sở dữ liệu khách sạn có cấu trúc. 
AI đóng vai trò như một tư vấn viên du lịch địa phương, lắng nghe nhu cầu và đưa ra các đề xuất chính xác, có lý do.

## 4. Tính năng cốt lõi (Core Features)

### 4.1. Khung Trò chuyện AI Thông minh (AI Chat Interface)
- Hỗ trợ giao tiếp bằng Tiếng Việt tự nhiên.
- Dợi ý câu hỏi (Suggestion chips) để điều hướng người dùng.
- Hiển thị Markdown formatting (in đậm, danh sách).

### 4.2. Tool-Calling Tự động
- Tự động trích xuất các tiêu chí: `travel_purpose`, `budget_tier`, `area`, `key_requirements` từ tin nhắn.
- Truy vấn cơ sở dữ liệu khách sạn địa phương và tính điểm phù hợp (Match Score).
- Đưa kết quả vào context để AI có thể giải thích "Tại sao khách sạn này phù hợp".

### 4.3. Bảng Điều khiển (Dashboard) 3 Cột
1. **Thông tin Hành trình (Trip Summary)**: Hiển thị và cho phép chỉnh sửa nhanh các tham số tìm kiếm (Ngân sách, Số khách, Phong cách).
2. **Danh sách Phù hợp (Hotel Matches)**: Hiển thị các khách sạn được gợi ý với thông tin hình ảnh, giá, tags, lý do phù hợp.
3. **Cửa sổ Chat (AI Chat)**: Giao diện trò chuyện chính với AI.

### 4.4. Chế độ Quản trị (Admin/Developer Mode)
- Trực quan hóa quá trình suy nghĩ của AI (Tool Execution Card).
- Hiển thị raw JSON output và các tham số AI đã parse được.
- Theo dõi log tool-call mode (Live AI vs Server Fallback).

### 4.5. Bộ Kịch bản Mẫu (Demo Cases)
- Tích hợp sẵn 4 kịch bản để trình diễn tính năng:
  - **Happy Case**: Tư vấn suôn sẻ.
  - **Error Case**: Thiếu thông tin.
  - **Low Confidence**: Yêu cầu mâu thuẫn (budget thấp nhưng đòi 5 sao).
  - **Freestyle**: Chat tự do.

## 5. Dữ liệu (Database)
Bộ dữ liệu gồm 21 khách sạn tiêu biểu tại Phú Quốc, chia thành 3 phân khúc:
- **Cao cấp (>3.5M VND)**: 7 khách sạn (VD: Regent, JW Marriott).
- **Tầm trung (1.5 - 3.5M VND)**: 8 khách sạn.
- **Tiết kiệm (<1.5M VND)**: 7 khách sạn (VD: Phu House Hostel).

## 6. Kiến trúc Kỹ thuật
- **Frontend**: React 19, TypeScript, TailwindCSS v4, Vite.
- **Backend**: Vite Middleware (Node.js) đóng vai trò proxy server. Không cần deploy server riêng.
- **AI Integration**: Giao tiếp với Alibaba DashScope API (OpenAI-compatible format).
