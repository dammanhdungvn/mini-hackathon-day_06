import React, { useState } from 'react';
import { Bell, Search, Compass, ChevronDown, Award } from 'lucide-react';

interface HeaderProps {
  userEmail?: string;
}

export default function Header({ userEmail = 'tung2004nguyen52@gmail.com' }: HeaderProps) {
  const [activeTab, setActiveTab] = useState<'kham-pha' | 'lich-trinh' | 'khach-san' | 'uu-dai'>('kham-pha');
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'SOL by Meliá vừa có ưu đãi mới giảm 10%!', unread: true },
    { id: 2, text: 'Phú Quốc đang bước vào mùa du lịch lý tưởng.', unread: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header id="main-header" className="bg-white border-b border-[#e5eeff] h-16 px-8 flex items-center justify-between shrink-0 shadow-sm relative z-50">
      {/* Navigation tabs */}
      <nav id="header-nav" className="flex items-center gap-8 h-full">
        <button
          id="nav-kham-pha"
          onClick={() => setActiveTab('kham-pha')}
          className={`h-full border-b-2 flex items-center px-1 text-sm font-semibold tracking-tight transition-all relative ${
            activeTab === 'kham-pha'
              ? 'border-[#0F4C81] text-[#0F4C81] font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <span>Khám phá</span>
          {activeTab === 'kham-pha' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F4C81] rounded-full" />
          )}
        </button>

        <button
          id="nav-lich-trinh"
          onClick={() => setActiveTab('lich-trinh')}
          className={`h-full border-b-2 flex items-center px-1 text-sm font-semibold tracking-tight transition-all relative ${
            activeTab === 'lich-trinh'
              ? 'border-[#0F4C81] text-[#0F4C81] font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Lịch trình
        </button>

        <button
          id="nav-khach-san"
          onClick={() => setActiveTab('khach-san')}
          className={`h-full border-b-2 flex items-center px-1 text-sm font-semibold tracking-tight transition-all relative ${
            activeTab === 'khach-san'
              ? 'border-[#0F4C81] text-[#0F4C81] font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Khách sạn
        </button>

        <button
          id="nav-uu-dai"
          onClick={() => setActiveTab('uu-dai')}
          className={`h-full border-b-2 flex items-center px-1 text-sm font-semibold tracking-tight transition-all relative ${
            activeTab === 'uu-dai'
              ? 'border-[#0F4C81] text-[#0F4C81] font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Ưu đãi
        </button>
      </nav>

      {/* User Actions Right */}
      <div id="header-right-actions" className="flex items-center gap-6">
        {/* Notification system */}
        <div className="relative">
          <button
            id="notification-bell"
            onClick={() => {
              setShowNotifications(!showNotifications);
              // Clear unread
              if (!showNotifications) {
                setNotifications(notifications.map(n => ({ ...n, unread: false })));
              }
            }}
            className="w-10 h-10 rounded-full border border-[#e5eeff] hover:bg-gray-50 flex items-center justify-center text-gray-600 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>

          {showNotifications && (
            <div id="notifications-dropdown" className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#e5eeff] py-2 z-50">
              <div className="px-4 py-1.5 border-b border-[#e5eeff] flex justify-between items-center bg-[#f8f9ff]">
                <span className="text-xs font-bold text-gray-800">Thông báo</span>
                <span className="text-[10px] text-[#0F4C81] font-bold bg-[#e5eeff] px-1.5 py-0.5 rounded-md">Mới</span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-50 text-xs text-gray-700 transition-colors ${
                      n.unread ? 'bg-[#f0f5ff]/50 font-medium' : ''
                    }`}
                  >
                    {n.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown info */}
        <div id="user-profile-badge" className="flex items-center gap-2.5 border border-[#e5eeff] pl-3 pr-1.5 py-1.5 rounded-full bg-[#f8f9ff]">
          <div className="text-right">
            <div className="text-xs font-bold text-gray-900 font-sans tracking-tight">Tùng Nguyễn</div>
            <div className="text-[10px] text-gray-400 font-mono tracking-tight leading-none">VIP Member</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#0F4C81] text-white flex items-center justify-center font-sans font-bold text-xs ring-2 ring-white overflow-hidden shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" 
              alt="User" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
