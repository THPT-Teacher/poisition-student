export interface Student {
  id: string;
  name: string;
  assignedSeatId: string | null;
  avatarIcon?: string;
  assignedAt?: string;
}

export interface Seat {
  id: string;
  number: number;
  groupIndex: number; // Tổ 1, Tổ 2, Tổ 3, Tổ 4
  groupName: string;  // "Tổ 1", "Tổ 2"...
  row: number;        // Hàng (dãy dọc từ trên bảng xuống dưới)
  seatInDesk: 1 | 2;  // 1: Ghế trái (hoặc trong), 2: Ghế phải (hoặc ngoài)
  deskNumber: number; // Bàn số mấy trong tổ
  studentId: string | null;
}

export type DoorPosition = 'front-left' | 'front-right' | 'back-left' | 'back-right';

export interface Classroom {
  id: string;
  name: string;
  numGroups: number;       // Số tổ (dãy bàn dọc): 2, 3, 4 tổ
  desksPerGroup: number;   // Số bàn mỗi tổ (xếp dọc xuống): 4, 5, 6 bàn... (mỗi bàn 2 chỗ)
  doorPosition: DoorPosition; // Vị trí cửa ra vào lớp học để định hướng
  students: Student[];
  seats: Seat[];
  mascot: string; // '🐸' | '🐱' | '🐶' | '🚀' | '🦄' | '🐼'
  soundEnabled: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type GamePhase =
  | 'setup'              // Màn hình cài đặt tạo lớp & cấu hình bàn
  | 'idle'               // Đang ở lớp học, chờ bấm chọn học sinh
  | 'student-roulette'   // Đang chạy vòng quay tên học sinh
  | 'student-selected'   // Đã chọn được học sinh, hiện nút để học sinh bấm đổ xúc xắc
  | 'dice-rolling'       // Xúc xắc 3D đang xoay
  | 'mascot-hopping'     // Linh vật nhảy qua các bàn trống
  | 'seat-celebration'   // Bàn được chọn phát sáng chúc mừng
  | 'completed';         // Tất cả học sinh đã có chỗ ngồi!

export const MASCOTS = [
  { id: 'frog', emoji: '🐸', name: 'Chú Ếch Con' },
  { id: 'cat', emoji: '🐱', name: 'Mèo Tinh Nghịch' },
  { id: 'dog', emoji: '🐶', name: 'Cún Năng Động' },
  { id: 'rocket', emoji: '🚀', name: 'Tên Lửa Siêu Tốc' },
  { id: 'unicorn', emoji: '🦄', name: 'Kỳ Lân May Mắn' },
  { id: 'panda', emoji: '🐼', name: 'Gấu Trúc Dễ Thương' },
];
