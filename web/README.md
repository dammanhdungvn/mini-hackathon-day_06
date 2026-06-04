# Voyage Intelligence Web

Thư mục này chỉ chứa giao diện React và server proxy nhẹ.

## Chạy Web

```powershell
npm install
npm run dev
```

Web chạy ở:

```text
http://localhost:3000
```

## Cấu Hình

`web/.env`:

```env
BACKEND_URL=http://127.0.0.1:8000
APP_URL=http://localhost:3000
```

API key Alibaba không đặt trong web. Paste `DASHSCOPE_API_KEY` vào `backend/.env`.
