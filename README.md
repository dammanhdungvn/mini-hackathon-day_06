# Voyage Intelligence - AI Prompt Test Demo

Demo web này dùng React/Vite để test AI Hotel Advisor với Alibaba Model Studio. Dự án không dùng FastAPI, nhưng vẫn có Vite middleware local để giữ API key trong `backend/.env` và gọi Alibaba an toàn từ máy local.

## Kiến Trúc

- `web/src`: giao diện React.
- `web/vite.config.ts`: đăng ký local API `/api/chat`, `/api/hotels`, `/api/health`.
- `backend/aiAdvisor.ts`: đọc `backend/.env`, đọc `system_promts.txt`, gọi Alibaba và xử lý tool-calling.
- `backend/advisorCore.ts`: logic tool `fetch_matching_hotels` và mapping dữ liệu.
- `backend/localAdvisor.ts`: helper cho UI hiển thị danh sách khách sạn.
- `data_hotel.py`: dữ liệu khách sạn Phú Quốc.
- `system_promts.txt`: system prompt đang được test.

## Cấu Hình Alibaba

Tạo hoặc cập nhật `backend/.env`:

```env
DASHSCOPE_API_KEY=YOUR_REAL_KEY_HERE
DASHSCOPE_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
DASHSCOPE_MODEL=qwen3-max
```

## Chạy Demo

```powershell
cd "D:\AI20K\Day 6 - Hackathon!\mini-hackathon-day_06\web"
npm install
npm run dev
```

Mở:

```text
http://localhost:3000
```

## Luồng Chat AI

1. Khách nhập câu hỏi trong React UI.
2. UI gọi `/api/chat` trên Vite middleware local.
3. `backend/aiAdvisor.ts` đọc prompt mới nhất từ `system_promts.txt`.
4. Model được gọi với tool definition `fetch_matching_hotels`.
5. Nếu model tool-call đúng, server chạy tool và gửi tool result lại cho model.
6. Nếu model chưa tool-call, server fallback chạy tool từ câu nhắn và vẫn gửi tool result cho model để tránh trả lời bịa dữ liệu.

Response `/api/chat` có thêm `toolCallMode` để biết model tự gọi tool hay server fallback.
