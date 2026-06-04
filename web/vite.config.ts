import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'path';
import { defineConfig } from 'vite';

import {
  askAiAdvisor,
  getAiHealth,
  getMatchedHotelsForTrip,
  loadDemoCases,
} from '../backend/aiAdvisor';

async function readJsonBody(req: IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function sendJson(res: ServerResponse, statusCode: number, payload: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function aiAdvisorApiPlugin() {
  return {
    name: 'ai-advisor-api',
    configureServer(server: any) {
      server.middlewares.use('/api/health', async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
        try {
          return sendJson(res, 200, getAiHealth());
        } catch (error: any) {
          return sendJson(res, 500, { error: error.message });
        }
      });

      server.middlewares.use('/api/demo-cases', async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
        return sendJson(res, 200, loadDemoCases());
      });

      server.middlewares.use('/api/hotels', async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
        try {
          const trip = await readJsonBody(req);
          return sendJson(res, 200, getMatchedHotelsForTrip(trip));
        } catch (error: any) {
          return sendJson(res, 500, { error: error.message });
        }
      });

      server.middlewares.use('/api/chat', async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
        try {
          const body = await readJsonBody(req);
          return sendJson(res, 200, await askAiAdvisor(body));
        } catch (error: any) {
          return sendJson(res, 500, { error: error.message });
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [aiAdvisorApiPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      fs: {
        allow: [path.resolve(__dirname, '..')],
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
