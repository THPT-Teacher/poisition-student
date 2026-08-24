import React, { useState } from 'react';
import { Ban, Check, RotateCcw, Sparkles } from 'lucide-react';
import { ClassroomHeader } from '../components/ClassroomHeader';
import { SeatGrid } from '../components/SeatGrid';
import { StudentListPanel } from '../components/StudentListPanel';
import { StudentRouletteModal } from '../components/StudentRouletteModal';
import { DiceRollerModal } from '../components/DiceRollerModal';
import { SeatAssignedModal } from '../components/SeatAssignedModal';
import { CompletionModal } from '../components/CompletionModal';
import type { Classroom, Student, Seat, GamePhase } from '../types/classroom';
import { countEnabledSeats, getLotterySeats } from '../lib/random';

interface ClassroomPageProps {
  classroom: Classroom;
  gamePhase: GamePhase;
  selectedStudent: Student | null;
  targetSeat: Seat | null;
  currentHopSeatId: string | null;
  highlightWinnerSeatId: string | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onChangeMascot: (emoji: string) => void;
  onStartRandomStudent: () => void;
  onStudentRouletteFinished: () => void;
  onRollDice: () => void;
  onNextStudent: () => void;
  onReset: () => void;
  onNewSetup: () => void;
  onToggleSeatDisabled: (seatId: string) => boolean;
  onToggleDeskDisabled: (groupIndex: number, deskNumber: number) => boolean;
  onDisableExtraSeats: () => number;
  onEnableAllSeats: () => void;
}

export const ClassroomPage: React.FC<ClassroomPageProps> = ({
  classroom,
  gamePhase,
  selectedStudent,
  targetSeat,
  currentHopSeatId,
  highlightWinnerSeatId,
  soundEnabled,
  onToggleSound,
  onChangeMascot,
  onStartRandomStudent,
  onStudentRouletteFinished,
  onRollDice,
  onNextStudent,
  onReset,
  onNewSetup,
  onToggleSeatDisabled,
  onToggleDeskDisabled,
  onDisableExtraSeats,
  onEnableAllSeats,
}) => {
  const [isEditingSeats, setIsEditingSeats] = useState(false);
  const [editHint, setEditHint] = useState<string | null>(null);

  const availableStudents = classroom.students.filter(s => !s.assignedSeatId);
  const isGameActive = gamePhase !== 'idle' && gamePhase !== 'completed';
  const canEditSeats = gamePhase === 'idle';
  const enabledSeats = countEnabledSeats(classroom.seats);
  const extraLotterySeats = Math.max(0, getLotterySeats(classroom.seats).length - availableStudents.length);
  const unusedSeats = Math.max(0, enabledSeats - classroom.students.length);
  const disabledCount = classroom.seats.filter(s => s.disabled).length;

  const handleToggleSeat = (seatId: string) => {
    const ok = onToggleSeatDisabled(seatId);
    if (!ok) {
      setEditHint('Cần giữ đủ chỗ cho học sinh còn lại — không tắt thêm được.');
    } else {
      setEditHint(null);
    }
    return ok;
  };

  const handleToggleDesk = (groupIndex: number, deskNumber: number) => {
    const ok = onToggleDeskDisabled(groupIndex, deskNumber);
    if (!ok) {
      setEditHint('Cần giữ đủ chỗ cho học sinh còn lại — không tắt thêm được.');
    } else {
      setEditHint(null);
    }
    return ok;
  };

  const handleDisableExtras = () => {
    const n = onDisableExtraSeats();
    setEditHint(
      n > 0
        ? `Đã tắt ${n} chỗ thừa từ cuối lớp. Bấm ghế nếu muốn bật lại chỗ nào.`
        : 'Không còn chỗ thừa để tắt.'
    );
  };

  const editing = isEditingSeats && canEditSeats;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Thanh Header Lớp Học */}
      <ClassroomHeader
        classroom={classroom}
        soundEnabled={soundEnabled}
        isEditingSeats={editing}
        canEditSeats={canEditSeats}
        onToggleSound={onToggleSound}
        onChangeMascot={onChangeMascot}
        onReset={onReset}
        onNewSetup={onNewSetup}
        onToggleEditSeats={() => {
          setIsEditingSeats(prev => !prev);
          setEditHint(null);
        }}
      />

      {/* Khu vực nội dung chính: Danh sách học sinh bên trái + Sơ đồ lớp ở giữa */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 flex flex-col lg:flex-row gap-4 items-start">
        {/* Sơ đồ lớp học */}
        <div className={`flex-1 w-full order-2 lg:order-1 bg-slate-900/50 rounded-3xl border p-2 sm:p-4 shadow-xl flex flex-col min-h-[500px] justify-between ${
          editing ? 'border-amber-400/50 ring-2 ring-amber-400/20' : 'border-slate-800/80'
        }`}>
          {editing && (
            <div className="mx-2 mt-2 mb-1 rounded-2xl border border-amber-400/40 bg-amber-500/10 px-3 py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
              <p className="flex-1 text-xs sm:text-sm text-amber-100 font-medium">
                Bấm <strong>ghế</strong> để tắt/bật từng chỗ, hoặc bấm nhãn <strong>Bàn</strong> để tắt cả bàn.
                {extraLotterySeats > 0
                  ? ` Còn ${extraLotterySeats} chỗ thừa so với sĩ số.`
                  : ' Số chỗ đang khớp sĩ số.'}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleDisableExtras}
                  disabled={extraLotterySeats === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/50 text-rose-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Ban className="w-3.5 h-3.5" />
                  Tắt chỗ thừa từ cuối
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onEnableAllSeats();
                    setEditHint(null);
                  }}
                  disabled={disabledCount === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Bật lại tất cả
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingSeats(false);
                    setEditHint(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-200"
                >
                  <Check className="w-3.5 h-3.5" />
                  Xong
                </button>
              </div>
            </div>
          )}

          {!editing && canEditSeats && unusedSeats > 0 && (
            <div className="mx-2 mt-2 mb-1 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 flex items-center justify-between gap-2">
              <p className="text-xs sm:text-sm text-rose-100 font-medium">
                Lớp còn <strong>{unusedSeats} chỗ thừa</strong> (thường gặp khi sĩ số lẻ). Tắt chỗ không dùng trước khi chia để không bốc vào ghế trống.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsEditingSeats(true);
                  const n = onDisableExtraSeats();
                  setEditHint(
                    n > 0
                      ? `Đã tắt ${n} chỗ thừa từ cuối lớp. Bấm ghế nếu muốn bật lại chỗ nào.`
                      : null
                  );
                }}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/50 text-rose-100"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Tắt chỗ thừa
              </button>
            </div>
          )}

          {editHint && (
            <p className="mx-2 text-[11px] font-bold text-amber-300">{editHint}</p>
          )}

          <SeatGrid
            seats={classroom.seats}
            students={classroom.students}
            numGroups={classroom.numGroups}
            desksPerGroup={classroom.desksPerGroup}
            doorPosition={classroom.doorPosition}
            mascot={classroom.mascot}
            currentHopSeatId={currentHopSeatId}
            highlightWinnerSeatId={highlightWinnerSeatId}
            isEditingSeats={editing}
            onToggleSeat={handleToggleSeat}
            onToggleDesk={handleToggleDesk}
          />
        </div>

        {/* Cột Danh sách học sinh */}
        <div className="w-full lg:w-80 order-1 lg:order-2 flex-shrink-0">
          <StudentListPanel
            students={classroom.students}
            seats={classroom.seats}
            onStartRandomStudent={onStartRandomStudent}
            isGameActive={isGameActive}
            isEditingSeats={editing}
          />
        </div>
      </main>

      {/* MODAL 1: Vòng quay Roulette chọn tên học sinh */}
      {selectedStudent && (
        <StudentRouletteModal
          availableStudents={availableStudents}
          targetStudent={selectedStudent}
          isOpen={gamePhase === 'student-roulette'}
          onFinish={onStudentRouletteFinished}
        />
      )}

      {/* MODAL 2: Học sinh lên lắc xúc xắc 3D */}
      {selectedStudent && (
        <DiceRollerModal
          student={selectedStudent}
          isOpen={gamePhase === 'student-selected' || gamePhase === 'dice-rolling'}
          isRolling={gamePhase === 'dice-rolling'}
          mascot={classroom.mascot}
          onRoll={onRollDice}
        />
      )}

      {/* MODAL 3: Thông báo kết quả bàn của học sinh */}
      {selectedStudent && targetSeat && (
        <SeatAssignedModal
          student={selectedStudent}
          seat={targetSeat}
          isOpen={gamePhase === 'seat-celebration'}
          onNext={onNextStudent}
        />
      )}

      {/* MODAL 4: Hoàn thành chia chỗ cho toàn bộ lớp học */}
      <CompletionModal
        classroom={classroom}
        isOpen={gamePhase === 'completed'}
        onReset={onReset}
        onNewSetup={onNewSetup}
      />
    </div>
  );
};
