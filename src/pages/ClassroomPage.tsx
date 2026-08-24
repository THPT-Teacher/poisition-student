import React from 'react';
import { ClassroomHeader } from '../components/ClassroomHeader';
import { SeatGrid } from '../components/SeatGrid';
import { StudentListPanel } from '../components/StudentListPanel';
import { StudentRouletteModal } from '../components/StudentRouletteModal';
import { DiceRollerModal } from '../components/DiceRollerModal';
import { SeatAssignedModal } from '../components/SeatAssignedModal';
import { CompletionModal } from '../components/CompletionModal';
import type { Classroom, Student, Seat, GamePhase } from '../types/classroom';

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
}) => {
  const availableStudents = classroom.students.filter(s => !s.assignedSeatId);
  const isGameActive = gamePhase !== 'idle' && gamePhase !== 'completed';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Thanh Header Lớp Học */}
      <ClassroomHeader
        classroom={classroom}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        onChangeMascot={onChangeMascot}
        onReset={onReset}
        onNewSetup={onNewSetup}
      />

      {/* Khu vực nội dung chính: Danh sách học sinh bên trái + Sơ đồ lớp ở giữa */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 flex flex-col lg:flex-row gap-4 items-start">
        {/* Sơ đồ lớp học */}
        <div className="flex-1 w-full order-2 lg:order-1 bg-slate-900/50 rounded-3xl border border-slate-800/80 p-2 sm:p-4 shadow-xl flex flex-col min-h-[500px] justify-between">
          <SeatGrid
            seats={classroom.seats}
            students={classroom.students}
            numGroups={classroom.numGroups}
            desksPerGroup={classroom.desksPerGroup}
            doorPosition={classroom.doorPosition}
            mascot={classroom.mascot}
            currentHopSeatId={currentHopSeatId}
            highlightWinnerSeatId={highlightWinnerSeatId}
          />
        </div>

        {/* Cột Danh sách học sinh */}
        <div className="w-full lg:w-80 order-1 lg:order-2 flex-shrink-0">
          <StudentListPanel
            students={classroom.students}
            seats={classroom.seats}
            onStartRandomStudent={onStartRandomStudent}
            isGameActive={isGameActive}
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
