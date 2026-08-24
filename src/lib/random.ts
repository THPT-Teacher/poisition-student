import type { Student, Seat } from '../types/classroom';

export function isSeatInLottery(seat: Seat): boolean {
  return !seat.disabled && !seat.studentId;
}

export function getLotterySeats(seats: Seat[]): Seat[] {
  return seats.filter(isSeatInLottery);
}

export function countEnabledSeats(seats: Seat[]): number {
  return seats.filter(s => !s.disabled).length;
}

/**
 * Chọn ngẫu nhiên 1 học sinh chưa có chỗ ngồi
 */
export function pickRandomAvailableStudent(students: Student[]): Student | null {
  const available = students.filter(s => !s.assignedSeatId);
  if (available.length === 0) return null;
  const index = Math.floor(Math.random() * available.length);
  return available[index];
}

/**
 * Chọn ngẫu nhiên 1 chỗ đang mở và chưa có người ngồi
 */
export function pickRandomAvailableSeat(seats: Seat[]): Seat | null {
  const available = getLotterySeats(seats);
  if (available.length === 0) return null;
  const index = Math.floor(Math.random() * available.length);
  return available[index];
}

/**
 * Tạo danh sách các bàn sẽ nhảy qua trước khi dừng lại ở targetSeat.
 * Chỉ nhảy qua các bàn ĐANG TRỐNG.
 */
export function generateHopSequence(
  availableSeats: Seat[],
  targetSeat: Seat,
  minHops: number = 8,
  maxHops: number = 14
): Seat[] {
  if (availableSeats.length <= 1) return [targetSeat];

  const totalHops = Math.min(
    Math.floor(Math.random() * (maxHops - minHops + 1)) + minHops,
    availableSeats.length * 3
  );

  const sequence: Seat[] = [];
  const otherSeats = availableSeats.filter(s => s.id !== targetSeat.id);

  for (let i = 0; i < totalHops - 1; i++) {
    const pool = otherSeats.length > 0 ? otherSeats : availableSeats;
    const next = pool[Math.floor(Math.random() * pool.length)];
    sequence.push(next);
  }

  // Kết thúc luôn luôn là targetSeat định trước
  sequence.push(targetSeat);
  return sequence;
}
