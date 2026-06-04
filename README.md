# 🏨 Voyage Intelligence — AI Hotel Advisor

> Chatbot AI tư vấn khách sạn Phú Quốc sử dụng Alibaba Qwen3-max với tool-calling, giúp du khách chọn lưu trú phù hợp theo ngân sách, phong cách và sở thích cá nhân.

![Tech Stack](https://img.shields.io/badge/React_19-TypeScript-blue)
![AI](https://img.shields.io/badge/AI-Alibaba_Qwen3--max-orange)
![Status](https://img.shields.io/badge/Status-MVP_Demo-green)

---

## 📋 Mô tả sản phẩm

Voyage Intelligence là một AI Hotel Advisor dành cho đảo Phú Quốc. Hệ thống sử dụng mô hình ngôn ngữ Qwen3-max của Alibaba với cơ chế **tool-calling** để:

- **Hiểu nhu cầu** du khách qua hội thoại tự nhiên bằng tiếng Việt
- **Lọc thông minh** database 21 khách sạn theo ngân sách, khu vực, mục đích du lịch
- **Tư vấn cá nhân hóa** với lý do cụ thể tại sao từng khách sạn phù hợp

---

## 👥 Thành viên nhóm

| Mã HV | Họ tên | Vai trò |
|--------|--------|---------|
| — | Tùng Nguyễn | Tech Lead / Full-stack |
| — | (Thành viên 2) | (Vai trò) |
| — | (Thành viên 3) | (Vai trò) |

> ⚠️ *Điền thông tin thành viên thực tế trước khi nộp bài.*

---

## 📌 Phân công

| Hạng mục | Người thực hiện |
|----------|-----------------|
| SPEC & Product Design | — |
| Prototype & UI/UX | — |
| Backend / API (Vite Middleware) | — |
| AI Workflow (Prompt + Tool-calling) | — |
| Data (Hotel Database) | — |
| Testing & Demo Script | — |
| Slide & Thuyết trình | — |

> ⚠️ *Điền phân công thực tế trước khi nộp bài.*

---

## 🛠 Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Frontend | React 19 + TypeScript + TailwindCSS v4 + Vite 6 |
| Backend | Vite Middleware (Node.js, TypeScript) — không server riêng |
| AI Model | Alibaba Model Studio — Qwen3-max |
| API Style | OpenAI-compatible REST API với tool-calling |
| Database | File Python `data_hotel.py` (21 khách sạn Phú Quốc) |
| Icons | Lucide React |

---

## 🚀 Cài đặt & Chạy

### Yêu cầu

- **Node.js** ≥ 18
- **npm** ≥ 9
- **API Key** từ Alibaba Model Studio (DashScope)

### Bước 1: Clone & cài dependencies

```bash
cd codebase/web
npm install
```

### Bước 2: Cấu hình API Key

Tạo file `codebase/backend/.env` từ template:

```bash
cp codebase/backend/.env.example codebase/backend/.env
```

Sửa file `.env`:

```env
DASHSCOPE_API_KEY=<your-api-key-here>
DASHSCOPE_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
DASHSCOPE_MODEL=qwen3-max
```

### Bước 3: Chạy app

```bash
cd codebase/web
npm run dev
```

Mở trình duyệt tại: **http://localhost:3000**

---

## 📂 Cấu trúc repo

```
├── README.md                 ← Bạn đang đây
├── spec/                     ← Tài liệu thiết kế
│   ├── product-spec.md       ← Đặc tả sản phẩm
│   ├── user-flow.md          ← Luồng người dùng
│   ├── ai-workflow.md        ← Luồng AI & tool-calling
│   └── demo-script.md        ← Kịch bản demo
├── codebase/                 ← Source code
│   ├── data_hotel.py         ← Database 21 khách sạn Phú Quốc
│   ├── system_prompts.txt    ← System prompt cho AI
│   ├── backend/              ← Logic AI advisor (TypeScript)
│   └── web/                  ← React frontend (Vite)
└── slide/                    ← Slide thuyết trình
```

---

## 🔄 Luồng hoạt động chính

```
User nhập câu hỏi
    → POST /api/chat (Vite middleware)
    → Đọc system_prompts.txt
    → Gọi Alibaba lần 1 (với tool definition)
    → AI tool-call fetch_matching_hotels
        → Lọc hotel DB theo tiêu chí
        → Gửi tool result về Alibaba
    → Gọi Alibaba lần 2 (với context đầy đủ)
    → Trả response cho frontend
```
