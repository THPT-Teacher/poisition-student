import { useClassroom } from './hooks/useClassroom';
import { SetupPage } from './pages/SetupPage';
import { ClassroomPage } from './pages/ClassroomPage';

export function App() {
  const {
    classroom,
    gamePhase,
    selectedStudent,
    targetSeat,
    currentHopSeatId,
    highlightWinnerSeatId,
    soundEnabled,
    isLoading,
    toggleSound,
    changeMascot,
    createClassroom,
    startStudentSelection,
    onStudentRouletteFinished,
    rollDiceForSeat,
    nextStudent,
    resetAssignments,
    clearAndSetupNew,
  } = useClassroom();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <div className="text-4xl animate-spin mb-4">🎲</div>
        <p className="text-sm font-bold text-slate-400">Đang tải lớp học...</p>
      </div>
    );
  }

  if (!classroom || gamePhase === 'setup') {
    return <SetupPage onStart={createClassroom} />;
  }

  return (
    <ClassroomPage
      classroom={classroom}
      gamePhase={gamePhase}
      selectedStudent={selectedStudent}
      targetSeat={targetSeat}
      currentHopSeatId={currentHopSeatId}
      highlightWinnerSeatId={highlightWinnerSeatId}
      soundEnabled={soundEnabled}
      onToggleSound={toggleSound}
      onChangeMascot={changeMascot}
      onStartRandomStudent={startStudentSelection}
      onStudentRouletteFinished={onStudentRouletteFinished}
      onRollDice={rollDiceForSeat}
      onNextStudent={nextStudent}
      onReset={resetAssignments}
      onNewSetup={clearAndSetupNew}
    />
  );
}

export default App;
