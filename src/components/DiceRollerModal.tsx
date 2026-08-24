import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Dices, ArrowRight } from 'lucide-react';
import type { Student } from '../types/classroom';

interface DiceRollerModalProps {
  student: Student;
  isOpen: boolean;
  isRolling: boolean;
  mascot: string;
  onRoll: () => void;
}

export const DiceRollerModal: React.FC<DiceRollerModalProps> = ({
  student,
  isOpen,
  isRolling,
  mascot,
  onRoll,
}) => {
  const [hasClicked, setHasClicked] = useState(false);

  if (!isOpen) return null;

  const handleRollClick = () => {
    if (isRolling || hasClicked) return;
    setHasClicked(true);
    onRoll();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-slate-800 border-2 border-pink-500/60 rounded-3xl p-6 sm:p-10 max-w-md w-full text-center shadow-[0_0_50px_rgba(236,72,153,0.35)] relative overflow-hidden"
      >
        {/* Đèn nền */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl" />

        {/* Tên học sinh vinh danh */}
        <div className="mb-4">
          <span className="inline-block bg-purple-500/20 text-purple-300 font-extrabold text-xs px-3 py-1 rounded-full border border-purple-500/40 uppercase tracking-widest mb-2">
            ĐẾN LƯỢT BẠN
          </span>
          <div className="text-4xl mb-1">{student.avatarIcon || '⭐'}</div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-wide">
            {student.name}
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Hãy bấm vào chiếc xúc xắc để chú <span className="text-lg font-bold">{mascot}</span> nhảy tìm chỗ ngồi cho bạn nhé!
          </p>
        </div>

        {/* Xúc Xắc 3D Vui Nhộn */}
        <div className="my-8 flex justify-center items-center">
          <motion.button
            onClick={handleRollClick}
            disabled={isRolling || hasClicked}
            whileHover={{ scale: isRolling ? 1 : 1.12 }}
            whileTap={{ scale: 0.9 }}
            animate={
              isRolling
                ? {
                    rotate: [0, 90, 180, 270, 360, 450, 720],
                    scale: [1, 1.25, 0.9, 1.2, 1.05],
                    y: [0, -25, 10, -15, 0],
                  }
                : {
                    y: [0, -8, 0],
                  }
            }
            transition={
              isRolling
                ? { duration: 1.4, ease: 'easeInOut' }
                : { repeat: Infinity, duration: 1.8, ease: 'easeInOut' }
            }
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 border-4 border-pink-300 shadow-[0_15px_35px_rgba(236,72,153,0.5)] flex flex-col items-center justify-center cursor-pointer select-none transition-shadow hover:shadow-[0_20px_45px_rgba(236,72,153,0.7)] group"
          >
            <span className="text-5xl sm:text-6xl drop-shadow-lg group-hover:scale-110 transition">
              🎲
            </span>
            <span className="text-[11px] font-black text-pink-100 tracking-wider uppercase mt-1">
              {isRolling ? 'ĐANG LẮC...' : 'LẮC NGAY!'}
            </span>
          </motion.button>
        </div>

        {/* Nút bấm hành động phụ */}
        <button
          onClick={handleRollClick}
          disabled={isRolling || hasClicked}
          className={`w-full py-3.5 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-lg transition ${
            isRolling || hasClicked
              ? 'bg-slate-700 text-slate-400 cursor-wait'
              : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-pink-500/25 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          <Dices className="w-5 h-5" />
          <span>{isRolling ? 'ĐANG TÌM CHỖ NGỒI...' : 'ĐỔ XÚC XẮC NHẬN CHỖ'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Mỗi bạn đều nhận được 1 chỗ ngồi ngẫu nhiên và công bằng!
        </p>
      </motion.div>
    </div>
  );
};
