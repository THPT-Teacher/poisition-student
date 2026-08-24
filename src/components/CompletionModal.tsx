import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Printer, PlusCircle } from 'lucide-react';
import type { Classroom } from '../types/classroom';
import { triggerGrandCelebration } from '../lib/confetti';

interface CompletionModalProps {
  classroom: Classroom;
  isOpen: boolean;
  onReset: () => void;
  onNewSetup: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  classroom,
  isOpen,
  onReset,
  onNewSetup,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-slate-800 border-2 border-emerald-400 rounded-3xl p-6 sm:p-10 max-w-lg w-full text-center shadow-[0_0_80px_rgba(16,185,129,0.4)] relative overflow-hidden"
      >
        {/* Hào quang chúc mừng */}
        <div className="absolute -top-24 -left-24 w-52 h-52 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="text-6xl mb-3 animate-bounce">🎉 👑 🎓</div>

        <span className="inline-block bg-emerald-500/20 text-emerald-300 font-black text-xs px-3.5 py-1.5 rounded-full border border-emerald-500/40 uppercase tracking-widest mb-3">
          HOÀN THÀNH CHIA CHỖ!
        </span>

        <h2 className="text-2xl sm:text-4xl font-black text-slate-100 uppercase tracking-tight">
          CẢ LỚP ĐỀU CÓ CHỖ NGỒI
        </h2>

        <p className="text-slate-300 text-sm mt-2">
          Lớp <strong className="text-emerald-400 font-bold">{classroom.name}</strong> đã phân bổ xong{' '}
          <strong className="text-white">{classroom.students.length}</strong> học sinh vào{' '}
          <strong className="text-white">{classroom.seats.length}</strong> vị trí bàn một cách ngẫu nhiên và công bằng!
        </p>

        {/* Nút Bắn thêm pháo hoa */}
        <div className="my-6">
          <button
            onClick={() => triggerGrandCelebration()}
            className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-black transition flex items-center justify-center gap-1.5 mx-auto hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            Bắn Thêm Pháo Hoa 🎆
          </button>
        </div>

        {/* Nhóm nút hành động */}
        <div className="space-y-3 pt-2">
          {/* Nút In/Lưu Sơ Đồ */}
          <button
            onClick={() => window.print()}
            className="w-full py-3.5 px-5 rounded-2xl bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-100 font-bold text-sm flex items-center justify-center gap-2 transition hover:scale-[1.01]"
          >
            <Printer className="w-4 h-4" />
            <span>In / Lưu Sơ Đồ Lớp Học (PDF)</span>
          </button>

          <div className="flex gap-3">
            {/* Chia lại giữ nguyên danh sách */}
            <button
              onClick={onReset}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition hover:scale-[1.02]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Bốc Thăm Lại</span>
            </button>

            {/* Tạo lớp học mới */}
            <button
              onClick={onNewSetup}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/25 transition hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tạo Lớp Mới</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
