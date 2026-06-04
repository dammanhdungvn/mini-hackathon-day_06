# Prototype Overview

**Voyage Intelligence** là một AI Hotel Advisor dành cho đảo Phú Quốc.
Prototype này đóng vai trò như một chuyên gia tư vấn lưu trú, giúp du khách dễ dàng tìm kiếm khách sạn phù hợp với sở thích, ngân sách và mục đích chuyến đi thay vì phải lướt qua hàng trăm lựa chọn.

**Chức năng chính:**
- Chatbot giao tiếp bằng Tiếng Việt tự nhiên.
- Ứng dụng mô hình AI có khả năng **Tool-calling** để truy xuất dữ liệu từ CSDL (21 khách sạn Phú Quốc).
- Tự động lọc khách sạn dựa trên ngữ cảnh (ngân sách, loại hình du lịch, tiện ích yêu cầu).
- Bảng điều khiển (Dashboard) 3 cột hiển thị: Thông số hành trình, Danh sách khách sạn phù hợp, và Giao diện trò chuyện.
- Chế độ Admin/Developer Mode giúp dễ dàng quan sát cách AI trích xuất (parse) các tiêu chí và gọi tool.
- Hỗ trợ 4 kịch bản mẫu (Demo Cases) có sẵn để trình diễn tính năng.

---

## Công nghệ sử dụng

- **Frontend Framework**: React 19 + TypeScript + Vite 6
- **Backend/API**: Vite Middleware (Node.js) — proxy API calls trực tiếp không cần server riêng biệt.
- **Database**: Dữ liệu tĩnh lưu dưới dạng Python List trong `data_hotel.py` (21 khách sạn) và được backend parse.
- **AI Model/Provider**: Alibaba Model Studio (DashScope) — Model `qwen3-max` qua chuẩn OpenAI-compatible.
- **UI Library**: TailwindCSS v4, Lucide React (Icons).
- **Deploy Platform**: Localhost (Chưa deploy public).

---

## Cách chạy prototype

### 1. Yêu cầu môi trường
- **Node.js** ≥ 18
- **npm** ≥ 9
- **API Key** từ Alibaba Model Studio (DashScope)

### 2. Install dependencies
Mở terminal, di chuyển vào thư mục code và cài đặt các thư viện cần thiết:
```bash
cd web
npm install
```

### 3. Setup biến môi trường
Tạo file môi trường tại thư mục backend bằng template có sẵn:
```bash
cp backend/.env.example backend/.env
```
Mở file `backend/.env` và cập nhật API Key thật của bạn:
```env
DASHSCOPE_API_KEY=<your-api-key-here>
DASHSCOPE_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
DASHSCOPE_MODEL=qwen3-max
```

### 4. Start project
Khởi động máy chủ dev (Vite sẽ đóng vai trò cả Frontend Server lẫn Backend API Middleware):
```bash
cd web
npm run dev
```
Mở trình duyệt tại: **http://localhost:3000**

---

## Phân công thành viên

*(Vui lòng điền tên hoặc mã sinh viên thực tế của nhóm vào các mục dưới đây trước khi nộp bài)*

| Hạng mục | Người phụ trách |
|----------|-----------------|
| Viết SPEC (Tài liệu đặc tả) | Tùng Nguyễn |
| Xây dựng Prototype | Tùng Nguyễn |
| Prompt design & testing | Tùng Nguyễn |
| AI workflow (Logic Tool-calling) | Tùng Nguyễn |
| Lập trình Giao diện (UI) | Tùng Nguyễn |
| Lập trình Backend/API | Tùng Nguyễn |
| Quản lý repo & Chuẩn hóa | Tùng Nguyễn |
| Testing (Kiểm thử chức năng) | Tùng Nguyễn |
| Xây dựng Kịch bản demo | Tùng Nguyễn |
