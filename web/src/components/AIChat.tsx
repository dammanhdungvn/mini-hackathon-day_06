import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { Message } from '../types';

interface AIChatProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isAiConnected: boolean;
  isGenerating: boolean;
}

export default function AIChat({ 
  messages, 
  onSendMessage, 
  isAiConnected,
  isGenerating 
}: AIChatProps) {
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    'Xem thêm phòng giá tốt',
    'Khách sạn SOL có gì chơi?',
    'Đổi điểm đi Đà Nẵng',
    'Mục đặc sắc tại Lahana'
  ];

  // Auto-scroll to the bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleChipClick = (chip: string) => {
    if (isGenerating) return;
    onSendMessage(chip);
  };

  return (
    <div id="ai-chat-root" className="bg-white rounded-2xl border border-[#e5eeff] h-full flex flex-col shadow-sm overflow-hidden">
      {/* Chat header panel */}
      <div id="chat-header" className="p-4 border-b border-[#e5eeff] flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="font-sans font-bold text-sm text-[#0b1c30]">
            Trò chuyện AI (Travel Chat)
          </h2>
        </div>
        
        <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1 bg-[#f8f9ff] px-2 py-0.5 rounded-md">
          <Sparkles className="w-3 h-3 text-[#14B8A6]" />
          <span>{isAiConnected ? 'Gemini 3.5 Live' : 'Offline Engine'}</span>
        </div>
      </div>

      {/* Messages Scroll Containment */}
      <div id="chat-messages-scroll" className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 text-xs md:text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-[#0F4C81] text-white rounded-2xl rounded-tr-none font-sans font-medium'
                    : 'bg-white text-gray-700 border border-slate-100 rounded-2xl rounded-tl-none font-sans'
                }`}
              >
                {/* Parse basic markdown like bold text safely */}
                {msg.text.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} className={pIdx > 0 ? 'mt-1.5' : ''}>
                    {paragraph.split('**').map((part, partIdx) => 
                      partIdx % 2 === 1 ? <strong key={partIdx} className={isUser ? 'text-amber-200' : 'text-slate-900 font-semibold'}>{part}</strong> : part
                    )}
                  </p>
                ))}
              </div>
              <span className="text-[10px] text-gray-400 font-mono px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {/* Typing loading indicators */}
        {isGenerating && (
          <div className="flex flex-col items-start space-y-1">
            <div className="bg-white text-gray-400 border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-2 shadow-sm font-sans italic">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#14B8A6]" />
              <span>Trợ lý Voyage đang phân tích & soạn câu trả lời...</span>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Suggestion Chips and Input bottom panel */}
      <div id="chat-composer" className="p-3 border-t border-[#e5eeff] bg-white space-y-2.5 shrink-0">
        {/* Suggestion Chips list */}
        <div id="chat-suggestions" className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {suggestionChips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              disabled={isGenerating}
              className="shrink-0 bg-[#f8f9ff] text-slate-600 hover:text-[#0F4C81] hover:bg-[#e8f2fe] border border-[#e5eeff] text-[10px] font-bold px-2.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap active:scale-95 disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            id="chat-input-text"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isGenerating}
            placeholder="Hỏi trợ lý AI tư vấn thêm về kỳ nghỉ..."
            className="flex-1 bg-[#f8f9ff] border border-[#e5eeff] focus:border-[#0F4C81] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 transition focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0F4C81] disabled:opacity-50"
          />
          <button
            id="chat-submit-btn"
            type="submit"
            disabled={!inputText.trim() || isGenerating}
            className="w-10 h-10 rounded-xl bg-[#0F4C81] hover:bg-slate-800 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95 shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
