import { useState, useEffect, useCallback } from 'react';
import type { Classroom, Student, Seat, GamePhase, DoorPosition } from '../types/classroom';
import { pickRandomAvailableStudent, pickRandomAvailableSeat, generateHopSequence } from '../lib/random';
import { saveClassroomData, loadSavedClassroom, clearSavedClassroom } from '../lib/supabase';
import { sounds } from '../lib/audio';
import { triggerWinnerConfetti, triggerGrandCelebration } from '../lib/confetti';

const STUDENT_AVATARS = ['🐱', '🐶', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦄', '⭐', '🚀'];

export function useClassroom() {
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [targetSeat, setTargetSeat] = useState<Seat | null>(null);
  const [currentHopSeatId, setCurrentHopSeatId] = useState<string | null>(null);
  const [highlightWinnerSeatId, setHighlightWinnerSeatId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Tải dữ liệu đã lưu khi mở trang
  useEffect(() => {
    async function init() {
      const saved = await loadSavedClassroom();
      if (saved) {
        // Đảm bảo tương thích nếu là cấu hình cũ
        const numGroups = saved.numGroups || 4;
        const desksPerGroup = saved.desksPerGroup || 5;
        const doorPosition = saved.doorPosition || 'front-right';

        const normalizedClass: Classroom = {
          ...saved,
          numGroups,
          desksPerGroup,
          doorPosition,
        };

        setClassroom(normalizedClass);
        setSoundEnabled(normalizedClass.soundEnabled ?? true);
        sounds.enabled = normalizedClass.soundEnabled ?? true;

        const remainingStudents = normalizedClass.students.filter(s => !s.assignedSeatId);
        if (remainingStudents.length === 0 && normalizedClass.students.length > 0) {
          setGamePhase('completed');
        } else {
          setGamePhase('idle');
        }
      }
      setIsLoading(false);
    }
    init();
  }, []);

  // Bật/Tắt âm thanh
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      sounds.enabled = next;
      if (classroom) {
        const updated = { ...classroom, soundEnabled: next };
        setClassroom(updated);
        saveClassroomData(updated);
      }
      return next;
    });
  }, [classroom]);

  // Đổi linh vật
  const changeMascot = useCallback((mascotEmoji: string) => {
    if (!classroom) return;
    const updated = { ...classroom, mascot: mascotEmoji };
    setClassroom(updated);
    saveClassroomData(updated);
  }, [classroom]);

  // Khởi tạo lớp học mới với cấu trúc Tổ (dãy dọc) + Bàn đôi (2 chỗ/bàn) + Cửa lớp
  const createClassroom = useCallback((
    name: string,
    studentNames: string[],
    numGroups: number,
    desksPerGroup: number,
    doorPosition: DoorPosition
  ) => {
    const students: Student[] = studentNames.map((n, idx) => ({
      id: `std_${Date.now()}_${idx}`,
      name: n,
      assignedSeatId: null,
      avatarIcon: STUDENT_AVATARS[idx % STUDENT_AVATARS.length],
    }));

    const seats: Seat[] = [];
    let seatCounter = 1;

    // Duyệt theo từng Tổ (dãy dọc từ trái sang phải: Tổ 1 -> Tổ N)
    for (let g = 1; g <= numGroups; g++) {
      // Trong mỗi tổ, duyệt từ bàn 1 (gần bảng nhất) xuống bàn cuối
      for (let d = 1; d <= desksPerGroup; d++) {
        // Mỗi bàn có 2 chỗ ngồi: Ghế 1 (trái) và Ghế 2 (phải)
        for (let s = 1; s <= 2; s++) {
          seats.push({
            id: `seat_g${g}_d${d}_s${s}`,
            number: seatCounter++,
            groupIndex: g,
            groupName: `Tổ ${g}`,
            row: d,
            seatInDesk: s as 1 | 2,
            deskNumber: d,
            studentId: null,
          });
        }
      }
    }

    const newClass: Classroom = {
      id: `class_${Date.now()}`,
      name: name.trim() || 'Lớp Học Mới',
      numGroups,
      desksPerGroup,
      doorPosition,
      students,
      seats,
      mascot: '🐸',
      soundEnabled: true,
      createdAt: new Date().toISOString(),
    };

    setClassroom(newClass);
    setGamePhase('idle');
    setSelectedStudent(null);
    setTargetSeat(null);
    setCurrentHopSeatId(null);
    setHighlightWinnerSeatId(null);
    saveClassroomData(newClass);
  }, []);

  // Bước 1: Bắt đầu chọn học sinh ngẫu nhiên
  const startStudentSelection = useCallback(() => {
    if (!classroom) return;
    const availableStudents = classroom.students.filter(s => !s.assignedSeatId);
    if (availableStudents.length === 0) {
      setGamePhase('completed');
      return;
    }

    const winner = pickRandomAvailableStudent(classroom.students);
    if (!winner) return;

    setSelectedStudent(winner);
    setGamePhase('student-roulette');
  }, [classroom]);

  // Kết thúc animation quay học sinh
  const onStudentRouletteFinished = useCallback(() => {
    sounds.playSuccess();
    setGamePhase('student-selected');
  }, []);

  // Bước 2: Bắt đầu đổ xúc xắc nhận chỗ ngồi
  const rollDiceForSeat = useCallback(() => {
    if (!classroom || !selectedStudent) return;

    const availableSeats = classroom.seats.filter(s => !s.studentId);
    if (availableSeats.length === 0) return;

    const winnerSeat = pickRandomAvailableSeat(classroom.seats);
    if (!winnerSeat) return;

    setTargetSeat(winnerSeat);
    setGamePhase('dice-rolling');
    sounds.playDiceRoll();

    setTimeout(() => {
      setGamePhase('mascot-hopping');

      const hopSequence = generateHopSequence(availableSeats, winnerSeat);
      let hopIndex = 0;

      const runHop = () => {
        if (hopIndex < hopSequence.length) {
          const current = hopSequence[hopIndex];
          setCurrentHopSeatId(current.id);
          sounds.playBoing(0.8 + (hopIndex / hopSequence.length) * 0.5);

          const progress = hopIndex / hopSequence.length;
          const delay = 120 + Math.pow(progress, 2.5) * 350;

          hopIndex++;
          setTimeout(runHop, delay);
        } else {
          setCurrentHopSeatId(null);
          setHighlightWinnerSeatId(winnerSeat.id);
          setGamePhase('seat-celebration');
          sounds.playSuccess();
          triggerWinnerConfetti();

          const updatedStudents = classroom.students.map(s =>
            s.id === selectedStudent.id ? { ...s, assignedSeatId: winnerSeat.id, assignedAt: new Date().toISOString() } : s
          );
          const updatedSeats = classroom.seats.map(st =>
            st.id === winnerSeat.id ? { ...st, studentId: selectedStudent.id } : st
          );

          const updatedClass: Classroom = {
            ...classroom,
            students: updatedStudents,
            seats: updatedSeats,
          };

          setClassroom(updatedClass);
          saveClassroomData(updatedClass);
        }
      };

      runHop();
    }, 1400);
  }, [classroom, selectedStudent]);

  // Chuyển sang học sinh tiếp theo sau khi ăn mừng xong
  const nextStudent = useCallback(() => {
    if (!classroom) return;
    setHighlightWinnerSeatId(null);
    setSelectedStudent(null);
    setTargetSeat(null);
    setCurrentHopSeatId(null);

    const remaining = classroom.students.filter(s => !s.assignedSeatId);
    if (remaining.length === 0) {
      setGamePhase('completed');
      sounds.playFanfare();
      triggerGrandCelebration();
    } else {
      setGamePhase('idle');
    }
  }, [classroom]);

  // Bắt đầu lại (Giữ nguyên danh sách lớp và cấu hình tổ)
  const resetAssignments = useCallback(() => {
    if (!classroom) return;
    const resetStudents = classroom.students.map(s => ({ ...s, assignedSeatId: null }));
    const resetSeats = classroom.seats.map(st => ({ ...st, studentId: null }));

    const updated: Classroom = {
      ...classroom,
      students: resetStudents,
      seats: resetSeats,
    };

    setClassroom(updated);
    setSelectedStudent(null);
    setTargetSeat(null);
    setCurrentHopSeatId(null);
    setHighlightWinnerSeatId(null);
    setGamePhase('idle');
    saveClassroomData(updated);
  }, [classroom]);

  // Về màn hình Setup tạo mới
  const clearAndSetupNew = useCallback(() => {
    clearSavedClassroom();
    setClassroom(null);
    setSelectedStudent(null);
    setTargetSeat(null);
    setCurrentHopSeatId(null);
    setHighlightWinnerSeatId(null);
    setGamePhase('setup');
  }, []);

  return {
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
  };
}
