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

# Tech Stack

- **Frontend framework:** React 19 + TypeScript + Vite 6
- **Backend framework:** Vite Middleware (Node.js) — Đóng vai trò proxy API, không dùng server riêng.
- **Database:** Dữ liệu tĩnh Python list (`data_hotel.py`) được parse bằng Regex.
- **AI model/provider:** Alibaba Model Studio (Qwen3-max) thông qua chuẩn OpenAI-compatible API.
- **UI library:** TailwindCSS v4, Lucide React (Icons).
- **Deployment platform:** Chưa deploy (Chạy local/Localhost).

---

# Installation

### 1. Clone project
```bash
# Clone repo
git clone <repository_url>
cd <thư_mục_chứa_repo>
```

### 2. Install dependencies
```bash
# Di chuyển vào thư mục web (nơi chứa package.json)
cd codebase/web

# Cài đặt các thư viện Node.js cần thiết
npm install
```

### 3. Setup environment
Tạo file môi trường tại thư mục backend bằng template có sẵn:
```bash
cp ../backend/.env.example ../backend/.env
```
Mở file `codebase/backend/.env` và cập nhật API Key thật của bạn (lấy từ Alibaba DashScope).

### 4. Run development server
```bash
# Đảm bảo bạn đang ở thư mục codebase/web
npm run dev
```
Trình duyệt sẽ khởi động sẵn hoặc bạn có thể truy cập bằng tay tại: `http://localhost:3000`

---

# Environment Variables

Dự án yêu cầu các biến môi trường sau trong file `codebase/backend/.env` để hoạt động:

- `DASHSCOPE_API_KEY`: API Key để xác thực với Alibaba DashScope (Bắt buộc).
- `DASHSCOPE_BASE_URL`: URL Base API của Alibaba Model Studio (VD: `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`).
- `DASHSCOPE_MODEL`: Tên model muốn dùng (VD: `qwen3-max`).

*(Vui lòng tham khảo file `codebase/backend/.env.example` để biết định dạng chi tiết, tuyệt đối KHÔNG commit file `.env` chứa secret key lên repo).*

---

# Team Contribution

*(Vui lòng thay thế bằng tên/Mã SV thực tế của nhóm)*

- **Prompt design/testing:** Tùng Nguyễn
- **UI development:** Tùng Nguyễn
- **Backend/API (Vite Middleware):** Tùng Nguyễn
- **AI integration (Tool-calling logic):** Tùng Nguyễn
- **Repository management & Codebase structuring:** Tùng Nguyễn
- **Demo script & User Flow Design:** Tùng Nguyễn
- **Documentation (Spec docs, README):** Tùng Nguyễn
