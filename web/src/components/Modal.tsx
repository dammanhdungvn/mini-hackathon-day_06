import React from 'react';
import { X, CheckCircle, HelpCircle, Shield, Award, MapPin, Star, Building2, Flame, Heart, Coffee } from 'lucide-react';
import { Hotel } from '../types';

interface ModalProps {
  type: 'book' | 'details' | 'settings' | 'help' | null;
  onClose: () => void;
  activeHotel?: Hotel | null;
}

export default function Modal({ type, onClose, activeHotel }: ModalProps) {
  if (!type) return null;

  return (
    <div id="modal-wrapper" className="fixed inset-0 bg-[#0b1c30]/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fade-in">
      <div 
        id="modal-content-card" 
        className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#e5eeff] w-full max-w-lg flex flex-col max-h-[90vh] animate-scale-up"
      >
        {/* Header bar of modal */}
        <div id="modal-bar-header" className="p-5 border-b border-[#e5eeff] flex justify-between items-center bg-[#f8f9ff]">
          <h3 className="font-sans font-bold text-base text-[#0b1c30]">
            {type === 'book' && 'Xác nhận Đặt phòng'}
            {type === 'details' && 'Thông tin Dự án Nghỉ dưỡng'}
            {type === 'settings' && 'Bảng điều khiển hệ thống'}
            {type === 'help' && 'Cẩm nang sử dụng Chatbot AI'}
          </h3>
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#e5eeff] flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Scrollable central content area */}
        <div id="modal-scroller" className="p-6 overflow-y-auto space-y-5 text-gray-700 text-xs md:text-sm">
          
          {/* BOOK CONFIRMATION MODAL */}
          {type === 'book' && activeHotel && (
            <div id="modal-book-case" className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-150">
                <CheckCircle className="w-10 h-10 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="font-sans font-bold text-[#0c6b3e] text-sm">Yêu cầu báo giá giữ chỗ ban đầu thành công!</h4>
                  <p className="text-[11px] text-emerald-800/80 mt-0.5">Chúng tôi đã chuyển tiếp yêu cầu của bạn tới phòng điều hành.</p>
                </div>
              </div>

              <div className="border border-[#e5eeff] rounded-2xl p-4 space-y-3.5 bg-[#f8f9ff]">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Dự án nghỉ dưỡng</span>
                  <span className="text-sm font-bold text-gray-900">{activeHotel.name}</span>
                </div>

                <div className="flex justify-between text-xs py-2 border-y border-dashed border-slate-200">
                  <span className="text-gray-500 font-medium">Báo giá gốc lẻ / Đêm</span>
                  <span className="font-bold text-slate-800">{activeHotel.priceText}</span>
                </div>

                <div className="flex justify-between text-xs font-semibold pt-1">
                  <span className="text-gray-500">Thuế GTGT & phí dịch vụ (10%)</span>
                  <span>Đã bao gồm trong giá phòng</span>
                </div>

                <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-200">
                  <span className="text-[#0F4C81]">Quà tặng đi kèm từ Voyage Intelligence:</span>
                  <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider">Miễn phí đồ uống chào mừng</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed text-center">
                Mọi chi tiết giữ phòng sẽ được cập nhật và gửi mail xác nhận tới <strong>tung2004nguyen52@gmail.com</strong> trong vòng 10 phút. Cảm ơn bạn đã lựa chọn Voyage Intelligence!
              </p>

              <div className="pt-2 flex gap-2">
                <button
                  id="btn-confirm-checkout"
                  onClick={onClose}
                  className="flex-1 py-3 bg-[#0F4C81] hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all text-center shadow-sm active:scale-95 cursor-pointer"
                >
                  Xác nhận lưu lại hành trình
                </button>
              </div>
            </div>
          )}

          {/* HOTEL DETAILS MODAL */}
          {type === 'details' && activeHotel && (
            <div id="modal-details-case" className="space-y-4">
              <div className="h-44 rounded-2xl overflow-hidden relative">
                <img
                  src={activeHotel.imgUrl}
                  alt={activeHotel.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <div className="space-y-1">
                    <h4 className="text-white font-sans font-bold text-md leading-tight">{activeHotel.name}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-white/95">
                      <MapPin className="w-3 h-3 text-white" />
                      <span className="truncate max-w-sm">{activeHotel.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 px-3 bg-teal-50 border border-teal-150 rounded-xl">
                <div className="flex items-center gap-1.5 text-[#14B8A6] font-bold text-xs">
                  <Flame className="w-4 h-4 fill-teal-100" />
                  <span>Xếp hạng tương thích AI</span>
                </div>
                <span className="text-xs font-bold font-mono text-[#14B8A6]">{activeHotel.matchPercent}% Phù hợp</span>
              </div>

              <div className="space-y-2">
                <h5 className="font-sans font-bold text-slate-800 text-xs uppercase tracking-wider">Mô tả tổng quát</h5>
                <p className="text-xs text-gray-600 leading-relaxed font-sans mt-1">
                  {activeHotel.details || 'Khu nghỉ dưỡng sang trọng bậc nhất, cung cấp nhiều tiện ích, bể bơi ngoài trời tràn viền, bữa sáng tự chọn miễn phí quốc tế tại nhà hàng cao cấp.'}
                </p>
              </div>

              {/* Specific specifications table of resort */}
              <div className="border border-[#e5eeff] rounded-2xl overflow-hidden">
                <div className="grid grid-cols-2 bg-[#f8f9ff] px-4 py-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider border-b border-[#e5eeff]">
                  <span>Thông số</span>
                  <span>Chi tiết cung cấp</span>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="grid grid-cols-2 px-4 py-2.5 text-xs">
                    <span className="text-gray-500 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Room standards</span>
                    <span className="font-bold text-slate-800">{activeHotel.stars} Sao Quốc tế</span>
                  </div>
                  <div className="grid grid-cols-2 px-4 py-2.5 text-xs">
                    <span className="text-gray-500 flex items-center gap-1.5"><Coffee className="w-3.5 h-3.5" /> Bữa sáng</span>
                    <span className="font-bold text-slate-800">Cung cấp hoàn toàn miễn phí</span>
                  </div>
                  <div className="grid grid-cols-2 px-4 py-2.5 text-xs">
                    <span className="text-gray-500 flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" /> Best highlights</span>
                    <span className="font-bold text-slate-800">Hồ bơi vô cực ngắm hoàng hôn</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS MODAL */}
          {type === 'settings' && (
            <div id="modal-settings-case" className="space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                Voyage Intelligence đang chạy theo luồng demo local: giao diện gửi yêu cầu vào server trong thư mục web, server xử lý dữ liệu khách sạn và bắt buộc gọi Alibaba Model Studio để trả lời khách hàng.
              </p>

              <div className="space-y-3.5">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500">Mô hình AI chỉ định:</span>
                    <span className="bg-[#e5eeff] text-[#0F4C81] px-2 py-0.5 rounded-full font-mono font-bold text-[10px]">qwen3-max</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500">Khóa DashScope:</span>
                    <span className="text-emerald-600 font-sans font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
                      <Shield className="w-3 h-3 text-emerald-500" />
                      <span>Chỉ đọc ở server local</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500">Nguồn dữ liệu:</span>
                    <span className="text-[#0f4c81] font-sans font-bold uppercase tracking-wider text-[10px]">Voyage Registry Direct DB</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Hệ thống Prompt nội tại</span>
                  <div className="p-3 bg-gray-900 text-amber-200 rounded-xl font-mono text-[10px] leading-relaxed max-h-36 overflow-y-auto">
                    {`System-Instruction: You are "Voyage Intelligence" a friendly, high-trust digital hotel concierge powered by Alibaba Qwen3-Max. Your goal is to guide standard tourist bookings by analyzing budget, styles, and destinations in Vietnam. Respond clearly, cleanly, and compactly in beautiful Vietnamese.`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HELP MODAL */}
          {type === 'help' && (
            <div id="modal-help-case" className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-[#eff4ff] rounded-2xl border border-[#0F4C81]/15">
                <HelpCircle className="w-10 h-10 text-[#0F4C81] shrink-0" />
                <div>
                  <h4 className="font-sans font-bold text-[#0F4C81] text-sm">Cẩm nang Chợ giúp Khách hàng</h4>
                  <p className="text-[11px] text-[#0F4C81]/80 mt-0.5">Chúng tôi đã tích hợp trợ lý AI sẵn sàng phân tích và lên lộ trình cho bạn.</p>
                </div>
              </div>

              <div className="space-y-4 pt-1">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] flex items-center justify-center font-bold font-sans text-xs shrink-0">1</div>
                  <div>
                    <h5 className="font-sans font-bold text-slate-800 text-xs">Điền phiếu hành trình</h5>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">Sử dụng nút "Chỉnh sửa" ở bảng "Thông tin hành trình" bên trái màn hình để điền Điểm đến, Ngân sách và Sở thích của bạn.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] flex items-center justify-center font-bold font-sans text-xs shrink-0">2</div>
                  <div>
                    <h5 className="font-sans font-bold text-slate-800 text-xs">Quan sát bảng xếp hạng AI</h5>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">Thuật toán phân tích nội tại của chúng tôi sẽ tính toán và hiển thị các khách sạn tốt nhất theo thứ tự phần trăm match giảm dần.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] flex items-center justify-center font-bold font-sans text-xs shrink-0">3</div>
                  <div>
                    <h5 className="font-sans font-bold text-slate-800 text-xs">Thử nghiệm các ca kiểm thử nhanh</h5>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">Bạn có thể click "Happy Case", "Error Case", "Low Confidence" ở sidebar bên trái để xem nhanh cách hệ thống Voyage cảnh báo mâu thuẫn dữ liệu.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer actions of modal */}
        <div id="modal-footer" className="p-4 border-t border-[#e5eeff] bg-[#f8f9ff] flex justify-end">
          <button
            id="close-modal-footer-btn"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-xs transition-colors shadow-sm select-none"
          >
            Đóng bảng
          </button>
        </div>
      </div>
    </div>
  );
}
