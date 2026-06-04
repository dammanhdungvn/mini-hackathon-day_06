# Hướng Dẫn Test AI Prompt

Mục tiêu của demo là kiểm tra Alibaba AI có tuân thủ `system_promts.txt` và có gọi tool lọc khách sạn đúng hay không.

## 1. Chuẩn Bị

Đảm bảo `backend/.env` có key Alibaba:

```env
DASHSCOPE_API_KEY=YOUR_REAL_KEY_HERE
DASHSCOPE_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
DASHSCOPE_MODEL=qwen3-max
```

## 2. Chạy Web

```powershell
cd "D:\AI20K\Day 6 - Hackathon!\mini-hackathon-day_06\web"
npm install
npm run dev
```

Mở `http://localhost:3000`.

## 3. Cách Kiểm Tra

- Sửa prompt trong `system_promts.txt`.
- Gửi câu hỏi của khách trong khung chat.
- Server local đọc prompt mới nhất, gửi tool definition `fetch_matching_hotels` cho Alibaba.
- Tool lấy dữ liệu từ `data_hotel.py`, lọc theo ngân sách, khu vực, mục đích đi và yêu cầu tiện ích.
- AI trả lời khách dựa trên tool result.

Endpoint kiểm tra nhanh:

```text
GET  /api/health
POST /api/chat
```

`/api/chat` trả về `toolCallMode`:

- `model-tool-call`: model tự gọi tool theo prompt.
- `server-fallback`: model chưa gọi tool, server đã chạy tool fallback để vẫn có dữ liệu đúng cho câu trả lời.
