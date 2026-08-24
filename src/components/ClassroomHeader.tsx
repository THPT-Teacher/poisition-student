import React, { useState } from 'react';
import { Volume2, VolumeX, RefreshCw, Settings, Sparkles, AlertCircle } from 'lucide-react';
import type { Classroom } from '../types/classroom';
import { MASCOTS } from '../types/classroom';

interface ClassroomHeaderProps {
  classroom: Classroom;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onChangeMascot: (emoji: string) => void;
  onReset: () => void;
  onNewSetup: () => void;
}

export const ClassroomHeader: React.FC<ClassroomHeaderProps> = ({
  classroom,
  soundEnabled,
  onToggleSound,
  onChangeMascot,
  onReset,
  onNewSetup,
}) => {
  const [showMascotPicker, setShowMascotPicker] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmNew, setShowConfirmNew] = useState(false);

  const assignedCount = classroom.students.filter(s => s.assignedSeatId).length;
  const totalCount = classroom.students.length;
  const progressPercent = totalCount > 0 ? Math.round((assignedCount / totalCount) * 100) : 0;

  return (
    <header className="w-full bg-slate-800/80 backdrop-blur-md border-b border-slate-700/60 sticky top-0 z-30 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Tên Lớp & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-xl shadow-md ring-2 ring-purple-400/30 animate-subtle-bounce">
            🎲
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300 bg-clip-text text-transparent tracking-tight">
                {classroom.name}
              </h1>
              <span className="bg-purple-950/80 text-purple-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-purple-700/50">
                {classroom.numGroups} Tổ × {classroom.desksPerGroup} Bàn Đôi ({classroom.seats.length} Chỗ)
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Bốc thăm chỗ ngồi lớp học ngẫu nhiên</p>
          </div>
        </div>

        {/* Thanh Tiến Độ Đã Chia Chỗ */}
        <div className="flex-1 max-w-xs md:max-w-sm min-w-[200px] bg-slate-900/90 rounded-2xl p-2 border border-slate-700/60 shadow-inner">
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Đã nhận chỗ:
            </span>
            <span className="text-purple-300 font-extrabold">
              {assignedCount} / {totalCount} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-400 transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Nút Điều Khiển & Công Cụ */}
        <div className="flex items-center gap-2">
          {/* Nút đổi linh vật */}
          <div className="relative">
            <button
              onClick={() => setShowMascotPicker(!showMascotPicker)}
              title="Đổi linh vật dẫn đường"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700/80 hover:bg-slate-600 border border-slate-600/60 text-slate-200 text-sm font-bold transition shadow-sm hover:scale-105 active:scale-95"
            >
              <span className="text-lg">{classroom.mascot}</span>
              <span className="hidden sm:inline text-xs">Linh vật</span>
            </button>

            {showMascotPicker && (
              <div className="absolute right-0 mt-2 p-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-50 flex gap-2 w-max animate-in fade-in zoom-in duration-150">
                {MASCOTS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onChangeMascot(m.emoji);
                      setShowMascotPicker(false);
                    }}
                    title={m.name}
                    className={`text-2xl p-2 rounded-xl transition hover:scale-125 hover:bg-slate-700 ${
                      classroom.mascot === m.emoji ? 'bg-purple-600/30 ring-2 ring-purple-400' : ''
                    }`}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nút Bật/Tắt âm thanh */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className={`p-2 rounded-xl border text-sm font-bold transition shadow-sm hover:scale-105 active:scale-95 ${
              soundEnabled
                ? 'bg-purple-600/20 border-purple-500/40 text-purple-300 hover:bg-purple-600/30'
                : 'bg-slate-700/60 border-slate-600/60 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-purple-300" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          {/* Nút Chia Lại (Giữ danh sách) */}
          <button
            onClick={() => setShowConfirmReset(true)}
            title="Xóa kết quả chia để bốc thăm lại từ đầu"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden md:inline">Chia Lại</span>
          </button>

          {/* Nút Cài đặt Lớp Mới */}
          <button
            onClick={() => setShowConfirmNew(true)}
            title="Tạo lớp mới hoặc sửa danh sách"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-300 text-xs font-bold transition hover:scale-105 active:scale-95"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden md:inline">Cài Đặt</span>
          </button>
        </div>
      </div>

      {/* Modal xác nhận Chia Lại */}
      {showConfirmReset && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">Bốc thăm lại từ đầu?</h3>
            <p className="text-sm text-slate-300">
              Toàn bộ vị trí chỗ ngồi đã chia sẽ được làm trống. Danh sách học sinh và cấu hình tổ vẫn được giữ nguyên.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-sm transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  setShowConfirmReset(false);
                  onReset();
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/20"
              >
                Đồng Ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận Tạo Lớp Mới */}
      {showConfirmNew && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto text-2xl">
              <Settings className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">Về màn hình Cài Đặt?</h3>
            <p className="text-sm text-slate-300">
              Bạn có muốn quay về màn hình cài đặt để sửa danh sách học sinh hoặc chỉnh lại số tổ / số bàn không?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirmNew(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-sm transition"
              >
                Tiếp tục chơi
              </button>
              <button
                onClick={() => {
                  setShowConfirmNew(false);
                  onNewSetup();
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-sm transition shadow-lg shadow-purple-500/25"
              >
                Về Cài Đặt
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
