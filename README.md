# 🏨 Voyage Intelligence — AI Hotel Advisor

> Chatbot AI tư vấn khách sạn Phú Quốc sử dụng Alibaba Qwen3-max với tool-calling, giúp du khách chọn lưu trú phù hợp theo ngân sách, phong cách và sở thích cá nhân.

![Tech Stack](https://img.shields.io/badge/React_19-TypeScript-blue)
![AI](https://img.shields.io/badge/AI-Alibaba_Qwen3--max-orange)
![Status](https://img.shields.io/badge/Status-MVP_Demo-green)

---

## Cách chạy prototype

### 1. Yêu cầu môi trường
- **Node.js** ≥ 18
- **npm** ≥ 9
- **API Key** từ Alibaba Model Studio (DashScope)

### 2. Install dependencies
Mở terminal, di chuyển vào thư mục code và cài đặt các thư viện cần thiết:
```bash
cd codebase/web
npm install
```

### 3. Setup biến môi trường
Tạo file môi trường tại thư mục backend bằng template có sẵn:
```bash
cp codebase/backend/.env.example codebase/backend/.env
```
Mở file `codebase/backend/.env` và cập nhật API Key thật của bạn:
```env
DASHSCOPE_API_KEY=<your-api-key-here>
DASHSCOPE_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
DASHSCOPE_MODEL=qwen3-max
```

### 4. Start project
Khởi động máy chủ dev (Vite sẽ đóng vai trò cả Frontend Server lẫn Backend API Middleware):
```bash
cd codebase/web
npm run dev
```
Mở trình duyệt tại: **http://localhost:3000**

*(Lưu ý: Ứng dụng hiện tại chỉ chạy ở môi trường Local/Localhost, chưa được deploy public. Hãy chạy theo hướng dẫn trên để xem demo).*

---

## Công nghệ sử dụng

- **Frontend Framework**: React 19 + TypeScript + Vite 6
- **Backend/API**: Vite Middleware (Node.js) — proxy API calls trực tiếp không cần server riêng biệt.
- **Database**: Dữ liệu tĩnh lưu dưới dạng Python List trong `codebase/data_hotel.py` (21 khách sạn) và được backend parse.
- **AI Model/Provider**: Alibaba Model Studio (DashScope) — Model `qwen3-max` qua chuẩn OpenAI-compatible.
- **UI Library**: TailwindCSS v4, Lucide React (Icons).
- **Deploy Platform**: Localhost (Chưa deploy public).

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

---

## 📂 Cấu trúc repo

```
├── README.md                 ← Bạn đang đây
├── spec/                     ← Tài liệu thiết kế
│   ├── product-spec.md       
│   ├── user-flow.md          
│   ├── ai-workflow.md        
│   └── demo-script.md        
├── codebase/                 ← Source code (Hoàn chỉnh)
│   ├── data_hotel.py         ← DB 21 khách sạn
│   ├── system_prompts.txt    ← Prompt chính
│   ├── backend/              ← Code backend xử lý AI
│   └── web/                  ← Code frontend React UI
└── slide/                    ← Slide thuyết trình gốc
```
