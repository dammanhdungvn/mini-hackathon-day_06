# Developer Guide — Voyage Intelligence

Tài liệu này hướng dẫn cách cài đặt, chạy và phát triển ứng dụng Voyage Intelligence ở môi trường Local.

## 1. Prototype Overview
Ứng dụng web chat AI sử dụng tool-calling để gợi ý khách sạn. Backend đóng vai trò như một proxy server đọc system prompt, xử lý dữ liệu database tĩnh và gọi API AI. Frontend hiển thị giao diện chat và danh sách khách sạn.

---

## 2. Tech Stack thực tế
- **Framework:** React 19, Vite 6
- **Language:** TypeScript (Frontend UI & Backend Logic)
- **Database:** Dữ liệu tĩnh lưu dạng file (`data_hotel.py` chứa danh sách 21 khách sạn).
- **AI Provider/Model:** Alibaba Model Studio (DashScope) — Model `qwen3-max`.
- **UI Library:** TailwindCSS v4, Lucide React (Icons).
- **Tools:** Node.js, npm.

---

## 3. Local Development

### Yêu cầu (Requirements)
- **Node.js** ≥ 18
- **npm** ≥ 9
- **API Key** từ Alibaba Model Studio.

### Cài đặt (Install dependencies)
Mở terminal và di chuyển vào thư mục code frontend (Vite):
```bash
cd web
npm install
```

### Cấu hình (Setup environment)
Tạo file biến môi trường ở thư mục backend:
```bash
cp backend/.env.example backend/.env
```
Mở `backend/.env` và cập nhật bằng API Key thật của bạn.

### Khởi chạy (Run project)
Khởi động development server:
```bash
cd web
npm run dev
```
Trình duyệt sẽ mở sẵn ở: **http://localhost:3000**

### Biên dịch (Build project)
Biên dịch code cho môi trường production:
```bash
cd web
npm run build
```

---

## 4. Environment Variables

Dự án yêu cầu cấu hình các biến môi trường sau trong file `backend/.env` (tham khảo cấu trúc tại `backend/.env.example`):

- `DASHSCOPE_API_KEY`: API Key để kết nối với mô hình AI.
- `DASHSCOPE_BASE_URL`: URL Base API của Alibaba Model Studio.
- `DASHSCOPE_MODEL`: Tên mô hình được cấu hình để gọi.

*(Tuyệt đối không chia sẻ hoặc push file chứa secret thật lên Github).*

---

## 5. Project Structure

Giải thích cấu trúc mã nguồn bên trong thư mục `codebase/`:

```
codebase/
├── data_hotel.py         # Cơ sở dữ liệu 21 khách sạn Phú Quốc.
├── system_prompts.txt    # System prompt định nghĩa hành vi của AI.
├── backend/              # Mã nguồn xử lý Backend API.
│   ├── .env.example      # File biến môi trường mẫu.
│   ├── advisorCore.ts    # Logic filter khách sạn và parse dữ liệu.
│   ├── aiAdvisor.ts      # Chịu trách nhiệm gọi Alibaba API & tool-calling.
│   ├── localAdvisor.ts   # Helper script client-side.
│   └── tools.py          # Script python mockup/tham khảo (không chạy chính).
└── web/                  # Giao diện Frontend React + Vite.
    ├── index.html        # Entry point của ứng dụng web.
    ├── vite.config.ts    # Cấu hình Vite & gắn Middleware API server (/api/*).
    └── src/
        ├── App.tsx       # Component trang gốc, chia layout 3 cột.
        ├── index.css     # CSS gốc và cấu hình Tailwind.
        └── components/   # Thư mục chứa các React Component (Chat, HotelList..).
```

---

## 6. Developer Notes
- **Middleware Architecture:** Để tiện cho việc chấm thi (chỉ cần chạy `npm run dev`), ứng dụng không dựng server Express độc lập. Thay vào đó, API Backend được chạy ngầm dưới dạng một plugin middleware gắn trong Vite (xem cấu hình ở `vite.config.ts` mục `configureServer`). Nếu muốn deploy ứng dụng này lên production ở Render hoặc Vercel, dev cần tách logic API sang một Express app riêng.
