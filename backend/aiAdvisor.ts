import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildToolArgsFromMessage,
  fetchMatchingHotelsFromDb,
  mapHotelForUi,
  parseHotelDatabase,
  type FetchMatchingHotelsArgs,
  type Hotel,
  type Message,
  type RawHotel,
  type TripInfo,
} from './advisorCore';

type ChatRole = 'system' | 'user' | 'assistant' | 'tool';

interface ChatMessage {
  role: ChatRole;
  content?: string | null;
  tool_call_id?: string;
  name?: string;
  tool_calls?: ToolCall[];
}

interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

interface ChatRequest {
  message: string;
  trip: TripInfo;
  demoCase?: string;
  history?: Message[];
}

interface ChatResponse {
  text: string;
  provider: 'alibaba-model-studio';
  model: string;
  toolResults: RawHotel[];
  toolArgs: FetchMatchingHotelsArgs;
  toolCallMode: 'model-tool-call' | 'server-fallback';
}

const __filename = fileURLToPath(import.meta.url);
const BACKEND_DIR = path.dirname(__filename);
const PROJECT_ROOT = path.dirname(BACKEND_DIR);

const DATA_FILE = path.join(PROJECT_ROOT, 'data_hotel.py');
const SYSTEM_PROMPT_FILE = path.join(PROJECT_ROOT, 'system_promts.txt');
const DEMO_CASES_FILE = path.join(BACKEND_DIR, 'demo_cases.json');
const HOTEL_IMAGES_FILE = path.join(BACKEND_DIR, 'hotel_images.json');

const DEFAULT_ALIBABA_BASE_URL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1';
const DEFAULT_ALIBABA_MODEL = 'qwen3-max';

function readText(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function readJson<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(readText(filePath)) as T;
}

function parseEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {};

  const env: Record<string, string> = {};
  for (const line of readText(filePath).split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separator = trimmed.indexOf('=');
    if (separator < 0) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }

  return env;
}

function loadEnv(): Record<string, string> {
  return {
    ...parseEnvFile(path.join(PROJECT_ROOT, '.env')),
    ...parseEnvFile(path.join(BACKEND_DIR, '.env')),
    ...process.env,
  };
}

function getAlibabaConfig() {
  const env = loadEnv();
  const apiKey = env.DASHSCOPE_API_KEY || env.ALIBABA_API_KEY;

  if (!apiKey || apiKey === 'YOUR_DASHSCOPE_API_KEY') {
    throw new Error('Missing DASHSCOPE_API_KEY or ALIBABA_API_KEY in backend/.env');
  }

  return {
    apiKey,
    baseUrl: (env.DASHSCOPE_BASE_URL || env.ALIBABA_BASE_URL || DEFAULT_ALIBABA_BASE_URL).replace(
      /\/$/,
      '',
    ),
    model: env.DASHSCOPE_MODEL || env.ALIBABA_MODEL || DEFAULT_ALIBABA_MODEL,
  };
}

function loadHotelsDb(): RawHotel[] {
  return parseHotelDatabase(readText(DATA_FILE));
}

export function loadDemoCases() {
  return readJson<Record<string, unknown>>(DEMO_CASES_FILE, {});
}

function loadHotelImages(): Record<string, string> {
  return readJson<Record<string, string>>(HOTEL_IMAGES_FILE, {});
}

export function getMatchedHotelsForTrip(trip: TripInfo): Hotel[] {
  if (!trip.destination) return [];

  const hotelsDb = loadHotelsDb();
  const toolArgs = buildToolArgsFromMessage('', trip);
  const matches = fetchMatchingHotelsFromDb(hotelsDb, toolArgs);
  const fallbackMatches = matches.length > 0 ? matches : hotelsDb.slice(0, 3);
  const images = loadHotelImages();
  return fallbackMatches.map((hotel) => mapHotelForUi(hotel, trip, images));
}

function parseToolArgs(rawArgs: string, req: ChatRequest): FetchMatchingHotelsArgs {
  try {
    const parsed = JSON.parse(rawArgs || '{}') as Partial<FetchMatchingHotelsArgs>;
    return {
      travel_purpose: parsed.travel_purpose || req.trip.travelStyle || 'Chưa rõ',
      budget_tier: parsed.budget_tier || buildToolArgsFromMessage(req.message, req.trip).budget_tier,
      area: parsed.area || 'Chưa rõ',
      key_requirements: Array.isArray(parsed.key_requirements)
        ? parsed.key_requirements
        : req.trip.preference
          ? [req.trip.preference]
          : [],
    };
  } catch {
    return buildToolArgsFromMessage(req.message, req.trip);
  }
}

function executeMatchingTool(hotelsDb: RawHotel[], args: FetchMatchingHotelsArgs): RawHotel[] {
  const results = fetchMatchingHotelsFromDb(hotelsDb, args);
  return results.length > 0 ? results : hotelsDb.slice(0, 3);
}

function buildUserContent(req: ChatRequest): string {
  return [
    'Thông tin hành trình đang có trong UI:',
    `- Điểm đến: ${req.trip.destination || 'Chưa rõ'}`,
    `- Ngân sách: ${req.trip.budget || 'Chưa rõ'} (${req.trip.budgetVal || 0} nghìn VND/đêm)`,
    `- Số khách: ${req.trip.guests || 1}`,
    `- Phong cách: ${req.trip.travelStyle || 'Chưa rõ'}`,
    `- Ưu tiên: ${req.trip.preference || 'Chưa rõ'}`,
    `- Demo case: ${req.demoCase || 'custom'}`,
    '',
    `Tin nhắn khách hàng: ${req.message}`,
  ].join('\n');
}

function normalizeHistory(history: Message[] = []): ChatMessage[] {
  return history.slice(-6).map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text,
  }));
}

function toolDefinition() {
  return [
    {
      type: 'function',
      function: {
        name: 'fetch_matching_hotels',
        description:
          'Filter the local Phu Quoc hotel database by travel purpose, price tier, area, and key requirements.',
        parameters: {
          type: 'object',
          properties: {
            travel_purpose: {
              type: 'string',
              description: 'Trip purpose or companion type, e.g. Cặp đôi, Gia đình, Bạn bè, Công tác, Solo.',
            },
            budget_tier: {
              type: 'string',
              enum: ['Cao cấp', 'Tầm trung', 'Tiết kiệm', 'Chưa rõ'],
              description: 'Desired hotel price segment.',
            },
            area: {
              type: 'string',
              description: 'Preferred Phu Quoc area, e.g. Bãi Trường, Dương Đông, Bãi Khem, An Thới, Gành Dầu.',
            },
            key_requirements: {
              type: 'array',
              items: { type: 'string' },
              description: 'Important hotel needs such as Spa, Kids Club, Hồ bơi, Bãi biển riêng, Co-working.',
            },
          },
          required: ['travel_purpose', 'budget_tier', 'area', 'key_requirements'],
        },
      },
    },
  ];
}

async function callAlibaba(messages: ChatMessage[], options: { tools?: unknown[] } = {}) {
  const { apiKey, baseUrl, model } = getAlibabaConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        ...(options.tools ? { tools: options.tools, tool_choice: 'auto' } : {}),
      }),
      signal: controller.signal,
    });

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      throw new Error(`Alibaba Model Studio error ${response.status}: ${text}`);
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}

export async function askAiAdvisor(req: ChatRequest): Promise<ChatResponse> {
  if (!req.message.trim()) {
    throw new Error('Message payload is required');
  }

  const hotelsDb = loadHotelsDb();
  const systemPrompt = readText(SYSTEM_PROMPT_FILE).trim();
  const { model } = getAlibabaConfig();

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...normalizeHistory(req.history),
    { role: 'user', content: buildUserContent(req) },
  ];

  const first = await callAlibaba(messages, { tools: toolDefinition() });
  const firstMessage = first?.choices?.[0]?.message || {};
  const toolCalls: ToolCall[] = firstMessage.tool_calls || [];

  let toolArgs = buildToolArgsFromMessage(req.message, req.trip);
  let toolResults = executeMatchingTool(hotelsDb, toolArgs);
  let toolCallMode: ChatResponse['toolCallMode'] = 'server-fallback';

  if (toolCalls.length > 0) {
    toolCallMode = 'model-tool-call';
    messages.push({
      role: 'assistant',
      content: firstMessage.content || null,
      tool_calls: toolCalls,
    });

    for (const toolCall of toolCalls) {
      if (toolCall.function?.name !== 'fetch_matching_hotels') continue;

      toolArgs = parseToolArgs(toolCall.function.arguments, req);
      toolResults = executeMatchingTool(hotelsDb, toolArgs);
      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        name: 'fetch_matching_hotels',
        content: JSON.stringify(toolResults, null, 2),
      });
    }
  } else {
    messages.push({
      role: 'system',
      content: [
        'Backend fallback: model did not emit a tool call, so the local server executed fetch_matching_hotels using extracted criteria.',
        `Tool arguments: ${JSON.stringify(toolArgs, null, 2)}`,
        `Tool result: ${JSON.stringify(toolResults, null, 2)}`,
        'Use this tool result only; do not invent hotels outside it.',
      ].join('\n\n'),
    });
  }

  const second = await callAlibaba(messages);
  const replyText = second?.choices?.[0]?.message?.content;

  if (!replyText) {
    throw new Error('Alibaba Model Studio returned an empty response');
  }

  return {
    text: replyText,
    provider: 'alibaba-model-studio',
    model,
    toolResults,
    toolArgs,
    toolCallMode,
  };
}

export function getAiHealth() {
  const { model, baseUrl } = getAlibabaConfig();
  const promptLoaded = fs.existsSync(SYSTEM_PROMPT_FILE);
  return {
    status: 'ok',
    provider: 'alibaba-model-studio',
    model,
    baseUrl,
    promptLoaded,
    systemPromptFile: SYSTEM_PROMPT_FILE,
  };
}
