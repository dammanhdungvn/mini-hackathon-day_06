import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { createServer as createViteServer } from 'vite';


dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const BACKEND_URL = (process.env.BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');


async function proxyJson(req: express.Request, res: express.Response, backendPath: string) {
  try {
    const response = await fetch(`${BACKEND_URL}${backendPath}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method === 'GET' ? undefined : JSON.stringify(req.body || {}),
    });

    const text = await response.text();
    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    return res.send(text);
  } catch (error: any) {
    return res.status(502).json({
      error: 'Backend is not available',
      details: error.message,
      backendUrl: BACKEND_URL,
    });
  }
}


async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => proxyJson(req, res, '/api/health'));
  app.get('/demo-cases', (req, res) => proxyJson(req, res, '/api/demo-cases'));
  app.post('/hotels', (req, res) => proxyJson(req, res, '/api/hotels'));
  app.post('/chat', (req, res) => proxyJson(req, res, '/api/chat'));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Web UI listening on http://localhost:${PORT}`);
    console.log(`Forwarding app requests to backend: ${BACKEND_URL}`);
  });
}


startServer();
