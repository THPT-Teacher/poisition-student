import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Dices } from 'lucide-react';
import type { Student } from '../types/classroom';
import { sounds } from '../lib/audio';

interface StudentRouletteModalProps {
  availableStudents: Student[];
  targetStudent: Student;
  isOpen: boolean;
  onFinish: () => void;
}

export const StudentRouletteModal: React.FC<StudentRouletteModalProps> = ({
  availableStudents,
  targetStudent,
  isOpen,
  onFinish,
}) => {
  const [currentDisplayName, setCurrentDisplayName] = useState<string>('');
  const [currentAvatar, setCurrentAvatar] = useState<string>('🎲');
  const [isSpinning, setIsSpinning] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;

    setIsSpinning(true);
    let step = 0;
    const totalSteps = 22;
    const pool = availableStudents.length > 0 ? availableStudents : [targetStudent];

    const cycle = () => {
      if (step < totalSteps) {
        const randomItem = pool[Math.floor(Math.random() * pool.length)];
        setCurrentDisplayName(randomItem.name);
        setCurrentAvatar(randomItem.avatarIcon || '⭐');
        sounds.playTick();

        const progress = step / totalSteps;
        const delay = 60 + Math.pow(progress, 3) * 350;

        step++;
        setTimeout(cycle, delay);
      } else {
        setCurrentDisplayName(targetStudent.name);
        setCurrentAvatar(targetStudent.avatarIcon || '🎉');
        setIsSpinning(false);
        onFinish();
      }
    };

    const timeoutId = setTimeout(cycle, 150);
    return () => clearTimeout(timeoutId);
  }, [isOpen, targetStudent, availableStudents, onFinish]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="bg-slate-800 border-2 border-purple-500/60 rounded-3xl p-6 sm:p-10 max-w-lg w-full text-center shadow-[0_0_50px_rgba(168,85,247,0.3)] relative overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl" />

        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-2xl animate-spin">🎰</span>
          <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 bg-clip-text text-transparent uppercase tracking-wider">
            {isSpinning ? 'ĐANG CHỌN HỌC SINH...' : 'HỌC SINH ĐƯỢC CHỌN!'}
          </h2>
          <span className="text-2xl animate-spin">🎰</span>
        </div>

        <div className="bg-slate-950/90 border-2 border-purple-500/40 rounded-3xl p-6 mb-6 shadow-inner relative overflow-hidden flex flex-col items-center justify-center min-h-[160px]">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentDisplayName + stepKey(isSpinning)}
              initial={{ y: 25, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: isSpinning ? 1 : 1.15 }}
              exit={{ y: -25, opacity: 0 }}
              transition={{ duration: isSpinning ? 0.08 : 0.4, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              <div className="text-5xl sm:text-6xl mb-2 drop-shadow-md">
                {currentAvatar}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-wide drop-shadow-lg px-2 text-center">
                {currentDisplayName || '...'}
              </div>
            </motion.div>
          </AnimatePresence>

          {!isSpinning && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-3 text-amber-400 font-extrabold text-xs flex items-center gap-1 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/40"
            >
              <Sparkles className="w-3.5 h-3.5" />
              CHÍNH BẠN!
            </motion.div>
          )}
        </div>

        <p className="text-slate-400 text-sm font-medium flex items-center justify-center gap-1.5">
          <Dices className="w-4 h-4 text-purple-400" />
          {isSpinning
            ? 'Vòng quay đang chọn ngẫu nhiên một bạn trong lớp...'
            : 'Mời bạn lên bảng chuẩn bị lắc xúc xắc chọn chỗ ngồi!'}
        </p>
      </motion.div>
    </div>
  );
};

function stepKey(isSpinning: boolean) {
  return isSpinning ? Math.random().toString() : 'final';
}
