import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Trophy } from 'lucide-react';
import type { Student, Seat } from '../types/classroom';

interface SeatAssignedModalProps {
  student: Student;
  seat: Seat;
  isOpen: boolean;
  onNext: () => void;
}

export const SeatAssignedModal: React.FC<SeatAssignedModalProps> = ({
  student,
  seat,
  isOpen,
  onNext,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-slate-800 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-[0_0_60px_rgba(245,158,11,0.4)] relative overflow-hidden"
      >
        {/* Vòng sáng */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-400/30 text-3xl animate-bounce">
          <Trophy className="w-8 h-8 text-amber-950" />
        </div>

        <span className="inline-block bg-amber-500/20 text-amber-300 font-black text-xs px-3 py-1 rounded-full border border-amber-500/40 uppercase tracking-widest mb-2">
          🎉 CHÚC MỪNG BẠN
        </span>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase">
          {student.name}
        </h2>

        {/* Khung Hiển Thị Số Bàn & Tổ Đã Nhận */}
        <div className="my-6 p-6 rounded-3xl bg-gradient-to-br from-purple-900/80 to-slate-900 border-2 border-amber-400/80 shadow-2xl flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            VỊ TRÍ CHỖ NGỒI CỦA BẠN
          </span>
          <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-pink-300 drop-shadow-md">
            {seat.groupName} - BÀN {seat.deskNumber}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs font-black bg-purple-600/80 text-white px-3 py-1 rounded-full border border-purple-400/50">
              Ghế {seat.seatInDesk === 1 ? 'Bên Trái (1)' : 'Bên Phải (2)'}
            </span>
            <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/40">
              Ghế #{seat.number}
            </span>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 hover:from-amber-500 hover:via-orange-500 hover:to-pink-600 text-slate-950 font-black text-base md:text-lg flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition"
        >
          <span>CHỌN HỌC SINH TIẾP THEO</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Vị trí {seat.groupName} - Bàn {seat.deskNumber} đã được ghi nhận!
        </p>
      </motion.div>
    </div>
  );
};
