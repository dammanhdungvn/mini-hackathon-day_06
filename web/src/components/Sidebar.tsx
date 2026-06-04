import React from 'react';
import { 
  Compass, 
  MapPin, 
  Radio, 
  Trash2, 
  Sparkles, 
  HelpCircle, 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  BookOpen,
  User,
  Shield,
  Clock,
  Wifi
} from 'lucide-react';
import { ViewMode, DemoCase } from '../types';

interface SidebarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeDemo: DemoCase;
  triggerDemo: (demo: DemoCase) => void;
  clearChat: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export default function Sidebar({
  viewMode,
  setViewMode,
  activeDemo,
  triggerDemo,
  clearChat,
  onOpenSettings,
  onOpenHelp
}: SidebarProps) {
  return (
    <aside id="sidebar-container" className="w-80 bg-white border-r border-[#e5eeff] flex flex-col h-full shrink-0 shadow-sm">
      {/* Brand Header */}
      <div id="brand-header" className="p-6 border-b border-[#e5eeff]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F4C81] flex items-center justify-center text-white shadow-md shadow-[#0f4c81]/10">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-xl text-[#0b1c30] tracking-tight leading-none">
              Voyage Int.
            </h1>
            <p className="text-xs text-gray-500 font-medium font-sans mt-1">AI Hotel Advisor</p>
          </div>
        </div>
      </div>

      {/* Main Sidebar Scroll Area */}
      <div id="sidebar-scroll" className="flex-1 overflow-y-auto p-5 space-y-7">
        
        {/* VIEW MODE */}
        <div id="view-mode-section" className="space-y-2.5">
          <h3 className="text-xs uppercase font-sans font-semibold tracking-wider text-gray-400">
            View Mode (Chế độ hiển thị)
          </h3>
          <div className="grid grid-cols-2 gap-2 bg-[#f8f9ff] p-1 rounded-lg border border-[#e5eeff]">
            <button
              id="view-mode-user"
              onClick={() => setViewMode('user')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'user'
                  ? 'bg-white text-[#0F4C81] shadow-sm font-bold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>User Mode</span>
            </button>
            <button
              id="view-mode-admin"
              onClick={() => setViewMode('admin')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'admin'
                  ? 'bg-white text-[#0b1c30] shadow-sm font-bold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Mode</span>
            </button>
          </div>
        </div>

        {/* DEMO CONTROLS */}
        <div id="demo-controls-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-sans font-semibold tracking-wider text-gray-400">
              Demo Controls (Thử nghiệm)
            </h3>
            <span className="text-[10px] bg-[#e5eeff] text-[#0F4C81] px-1.5 py-0.5 rounded-full font-bold">Hackathon</span>
          </div>
          <div className="space-y-2">
            <button
              id="demo-happy"
              onClick={() => triggerDemo('happy')}
              className={`w-full text-left flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                activeDemo === 'happy'
                  ? 'bg-[#eff4ff] border-[#0F4C81] text-[#0F4C81] font-medium shadow-sm'
                  : 'bg-white border-gray-100 text-gray-700 hover:bg-[#f8f9ff] hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${activeDemo === 'happy' ? 'bg-[#0F4C81] animate-ping' : 'bg-green-500'}`} />
                <div>
                  <div className="font-semibold text-gray-900">Happy Case (Đủ thông tin)</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Phú Quốc • 2M/đêm • Sát biển</div>
                </div>
              </div>
              <CheckCircle2 className="w-3.5 h-3.5 opacity-60 text-green-600" />
            </button>

            <button
              id="demo-error"
              onClick={() => triggerDemo('error')}
              className={`w-full text-left flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                activeDemo === 'error'
                  ? 'bg-[#eff4ff] border-[#0F4C81] text-[#0F4C81] font-medium shadow-sm'
                  : 'bg-white border-gray-100 text-gray-700 hover:bg-[#f8f9ff] hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${activeDemo === 'error' ? 'bg-[#0F4C81] animate-ping' : 'bg-amber-400'}`} />
                <div>
                  <div className="font-semibold text-gray-900">Error Case (Thiếu thông tin)</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Khuyết địa điểm • Đợi nhập liệu</div>
                </div>
              </div>
              <AlertCircle className="w-3.5 h-3.5 opacity-60 text-amber-500" />
            </button>

            <button
              id="demo-low-confidence"
              onClick={() => triggerDemo('low_confidence')}
              className={`w-full text-left flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                activeDemo === 'low_confidence'
                  ? 'bg-[#eff4ff] border-[#0F4C81] text-[#0F4C81] font-medium shadow-sm'
                  : 'bg-white border-gray-100 text-gray-700 hover:bg-[#f8f9ff] hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${activeDemo === 'low_confidence' ? 'bg-[#0F4C81] animate-ping' : 'bg-red-500'}`} />
                <div>
                  <div className="font-semibold text-gray-900">Low Confidence (Mâu thuẫn)</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">5 Sao VIP • Ngân sách 800k vnđ</div>
                </div>
              </div>
              <TrendingUp className="w-3.5 h-3.5 opacity-60 text-red-500 rotate-180" />
            </button>
          </div>

          <button
            id="clear-chat-btn"
            onClick={clearChat}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 border border-red-100 hover:border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa lịch sử chat</span>
          </button>
        </div>

        {/* CONNECTION STATUS */}
        <div id="connection-status-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-sans font-semibold tracking-wider text-gray-400">
              Trạng thái kết nối
            </h3>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
              'bg-emerald-100 text-emerald-800'
            }`}>
              ALIBABA
            </span>
          </div>

          <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 font-medium">Alibaba Model Studio</span>
              <span className="text-[10px] bg-[#14B8A6]/10 text-[#0f766e] font-bold px-2 py-1 rounded-full">
                Live
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <Wifi className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Đọc system_promts.txt, gọi tool fetch_matching_hotels rồi gửi context cho AI.</span>
            </div>
          </div>
        </div>

        {/* HACKATHON CHECKPOINTS */}
        <div id="checkpoints-section" className="p-4 bg-orange-50/50 rounded-xl border border-orange-100 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-orange-800 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>Checkpoints Hackathon</span>
          </div>
          <div className="text-[11px] text-orange-700/80 space-y-1 font-mono">
            <div>• 09:00 Khởi tạo ý tưởng</div>
            <div className="font-semibold text-[#0F4C81]">• 11:00 Demo Prototype Chạy ok</div>
            <div>• 14:00 Thuyết trình dự án</div>
          </div>
        </div>

      </div>

      {/* Sidebar Footer Controls */}
      <div id="sidebar-footer" className="p-4 border-t border-[#e5eeff] bg-[#f8f9ff] flex items-center justify-between gap-2">
        <button
          id="btn-sidebar-settings"
          onClick={onOpenSettings}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-[#e5eeff] hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold transition-colors shadow-sm"
        >
          <Settings className="w-4 h-4 text-gray-500" />
          <span>Cài đặt</span>
        </button>

        <button
          id="btn-sidebar-help"
          onClick={onOpenHelp}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-[#e5eeff] hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold transition-colors shadow-sm"
        >
          <HelpCircle className="w-4 h-4 text-gray-500" />
          <span>Trợ giúp</span>
        </button>
      </div>
    </aside>
  );
}
