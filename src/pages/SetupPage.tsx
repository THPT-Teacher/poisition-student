import React, { useState, useMemo } from 'react';
import { Sparkles, Users, Grid, AlertTriangle, ArrowRight, BookOpen, Check, DoorOpen } from 'lucide-react';
import type { DoorPosition } from '../types/classroom';

interface SetupPageProps {
  onStart: (
    name: string,
    studentNames: string[],
    numGroups: number,
    desksPerGroup: number,
    doorPosition: DoorPosition
  ) => void;
}

const SAMPLE_STUDENTS = [
  'Nguyễn Văn An',
  'Trần Thị Bình',
  'Lê Văn Cường',
  'Phạm Thị Dung',
  'Hoàng Văn Em',
  'Nguyễn Thị Hà',
  'Đặng Quốc Hưng',
  'Vũ Thị Mai',
  'Bùi Đức Nam',
  'Đỗ Thu Trang',
  'Trịnh Gia Bảo',
  'Ngô Phương Linh',
  'Lý Hải Yến',
  'Phan Thanh Tùng',
  'Dương Ngọc Ánh',
  'Lưu Tuấn Kiệt',
];

export const SetupPage: React.FC<SetupPageProps> = ({ onStart }) => {
  const [className, setClassName] = useState<string>('10A1');
  const [studentListText, setStudentListText] = useState<string>(SAMPLE_STUDENTS.join('\n'));
  const [numGroups, setNumGroups] = useState<number>(4); // 4 Tổ (dãy dọc)
  const [desksPerGroup, setDesksPerGroup] = useState<number>(5); // 5 bàn đôi mỗi tổ
  const [doorPosition, setDoorPosition] = useState<DoorPosition>('front-right');

  // Phân tích danh sách học sinh
  const parsedStudents = useMemo(() => {
    return studentListText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }, [studentListText]);

  // Kiểm tra tên trùng lặp
  const duplicates = useMemo(() => {
    const seen = new Set<string>();
    const dupes = new Set<string>();
    parsedStudents.forEach(name => {
      const lower = name.toLowerCase();
      if (seen.has(lower)) {
        dupes.add(name);
      }
      seen.add(lower);
    });
    return Array.from(dupes);
  }, [parsedStudents]);

  // Mỗi bàn có 2 chỗ ngồi
  const totalDesks = numGroups * desksPerGroup;
  const totalSeats = totalDesks * 2;
  const isNotEnoughSeats = parsedStudents.length > totalSeats;
  const isEmptyStudents = parsedStudents.length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmptyStudents || isNotEnoughSeats) return;
    onStart(className, parsedStudents, numGroups, desksPerGroup, doorPosition);
  };

  const handleUseSample = () => {
    setStudentListText(SAMPLE_STUDENTS.join('\n'));
    setClassName('10A1');
    setNumGroups(4);
    setDesksPerGroup(5);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Tia sáng nền */}
      <div className="fixed top-10 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto relative z-10">
        {/* Banner tiêu đề */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Trò Chơi Chia Chỗ Ngồi Lớp Học Theo Tổ & Bàn Đôi
          </div>
          <h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300 bg-clip-text text-transparent tracking-tight">
            🎲 BỐC THĂM CHỖ NGỒI
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl mx-auto">
            Cấu hình số Tổ, số Bàn đôi (2 chỗ/bàn) xếp dọc từ bảng xuống, vị trí cửa ra vào và danh sách học sinh!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CỘT TRÁI: Nhập Tên Lớp & Danh Sách Học Sinh (6 Cột) */}
          <div className="lg:col-span-6 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-5">
            {/* Tên Lớp */}
            <div>
              <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-400" />
                Tên Lớp Học
              </label>
              <input
                type="text"
                value={className}
                onChange={e => setClassName(e.target.value)}
                placeholder="Ví dụ: 10A1, 12 Tin, 6/2..."
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-slate-100 font-bold focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              />
            </div>

            {/* Danh Sách Học Sinh */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-pink-400" />
                  Danh Sách Học Sinh ({parsedStudents.length} bạn)
                </label>
                <button
                  type="button"
                  onClick={handleUseSample}
                  className="text-xs text-purple-400 hover:text-purple-300 font-bold hover:underline"
                >
                  Dùng danh sách mẫu
                </button>
              </div>

              <textarea
                rows={11}
                value={studentListText}
                onChange={e => setStudentListText(e.target.value)}
                placeholder="Dán danh sách học sinh vào đây, mỗi bạn 1 dòng:&#10;Nguyễn Văn An&#10;Trần Thị Bình&#10;Lê Văn Cường..."
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-slate-100 font-medium text-sm focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition resize-none custom-scrollbar leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                💡 Giáo viên có thể copy từ Excel hoặc file danh sách lớp và dán trực tiếp vào đây.
              </p>
            </div>

            {/* Cảnh báo tên trùng lặp */}
            {duplicates.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-start gap-2.5 text-amber-300 text-xs">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Lưu ý tên trùng lặp:</span> {duplicates.join(', ')}. Hãy thêm chữ cái để phân biệt nếu là 2 bạn khác nhau.
                </div>
              </div>
            )}
          </div>

          {/* CỘT PHẢI: Cấu Hình Số Tổ, Bàn Đôi & Vị Trí Cửa Lớp (6 Cột) */}
          <div className="lg:col-span-6 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 p-6 shadow-2xl flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Grid className="w-4 h-4 text-emerald-400" />
                Cấu Trúc Lớp Học Theo Tổ (Dãy Dọc)
              </label>

              {/* Bộ chọn Số Tổ & Số Bàn Mỗi Tổ */}
              <div className="grid grid-cols-2 gap-3">
                {/* Số Tổ */}
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Số Tổ (Dãy Dọc)</span>
                  <div className="flex items-center justify-center gap-2.5 mt-2">
                    <button
                      type="button"
                      onClick={() => setNumGroups(Math.max(1, numGroups - 1))}
                      className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-lg transition flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-xl font-black text-purple-400 w-12">{numGroups} Tổ</span>
                    <button
                      type="button"
                      onClick={() => setNumGroups(Math.min(6, numGroups + 1))}
                      className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-lg transition flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Số Bàn Mỗi Tổ */}
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Số Bàn Mỗi Tổ</span>
                  <div className="flex items-center justify-center gap-2.5 mt-2">
                    <button
                      type="button"
                      onClick={() => setDesksPerGroup(Math.max(1, desksPerGroup - 1))}
                      className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-lg transition flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-xl font-black text-pink-400 w-12">{desksPerGroup} Bàn</span>
                    <button
                      type="button"
                      onClick={() => setDesksPerGroup(Math.min(8, desksPerGroup + 1))}
                      className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-lg transition flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">(Mỗi bàn 2 chỗ xếp cặp)</span>
                </div>
              </div>

              {/* Chọn Vị Trí Cửa Ra Vào Lớp Học */}
              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <DoorOpen className="w-4 h-4 text-amber-400" />
                  Vị Trí Cửa Ra Vào Lớp Học (Định Hướng)
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  {[
                    { id: 'front-left', label: '🚪 Cửa Trước - Bên Trái' },
                    { id: 'front-right', label: '🚪 Cửa Trước - Bên Phải' },
                    { id: 'back-left', label: '🚪 Cửa Sau - Bên Trái' },
                    { id: 'back-right', label: '🚪 Cửa Sau - Bên Phải' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDoorPosition(item.id as DoorPosition)}
                      className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                        doorPosition === item.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{item.label}</span>
                      {doorPosition === item.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thống kê Tổng số chỗ & So sánh */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">
                  Học sinh: <strong className="text-pink-400 text-sm">{parsedStudents.length}</strong>
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">
                  Tổng chỗ ngồi: <strong className="text-emerald-400 text-sm">{totalSeats} chỗ</strong> ({totalDesks} bàn đôi)
                </span>
                <span className="text-slate-500">|</span>
                <span className={totalSeats >= parsedStudents.length ? 'text-emerald-400' : 'text-rose-400'}>
                  {totalSeats >= parsedStudents.length ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Đủ chỗ (+{totalSeats - parsedStudents.length})
                    </span>
                  ) : (
                    `Thiếu ${parsedStudents.length - totalSeats} chỗ`
                  )}
                </span>
              </div>

              {/* Xem trước sơ đồ tổ thu nhỏ */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 text-center">
                  Xem Trước: {numGroups} Tổ × {desksPerGroup} Bàn Đôi ({totalSeats} Ghế)
                </span>
                <div className="flex items-center justify-center gap-2 p-2 bg-slate-950 rounded-2xl border border-slate-800 max-h-32 overflow-y-auto">
                  {Array.from({ length: numGroups }).map((_, gIdx) => (
                    <div key={gIdx} className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-black text-purple-300">Tổ {gIdx + 1}</span>
                      <div className="space-y-1">
                        {Array.from({ length: Math.min(desksPerGroup, 4) }).map((_, dIdx) => (
                          <div key={dIdx} className="flex gap-0.5 bg-slate-900 p-0.5 rounded border border-slate-800">
                            <div className="w-3.5 h-3.5 rounded bg-slate-800 text-[8px] flex items-center justify-center text-slate-500 font-bold">1</div>
                            <div className="w-3.5 h-3.5 rounded bg-slate-800 text-[8px] flex items-center justify-center text-slate-500 font-bold">2</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cảnh báo thiếu bàn ghế */}
              {isNotEnoughSeats && (
                <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Số học sinh ({parsedStudents.length}) nhiều hơn số chỗ ({totalSeats}). Hãy tăng số tổ hoặc số bàn!</span>
                </div>
              )}

              {!isNotEnoughSeats && totalSeats > parsedStudents.length && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-medium">
                  Lớp còn <strong>{totalSeats - parsedStudents.length} chỗ thừa</strong>
                  {parsedStudents.length % 2 === 1 ? ' (sĩ số lẻ)' : ''}. Sau khi vào lớp, bấm <strong>Tắt chỗ thừa</strong> để loại ghế không dùng trước khi chia.
                </div>
              )}
            </div>

            {/* Nút Bắt Đầu Lớp Học */}
            <button
              type="submit"
              disabled={isEmptyStudents || isNotEnoughSeats}
              className={`w-full py-4 px-6 rounded-2xl font-black text-base md:text-lg flex items-center justify-center gap-2 shadow-2xl transition ${
                isEmptyStudents || isNotEnoughSeats
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 hover:from-purple-600 hover:via-pink-600 hover:to-amber-600 text-white shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] ring-2 ring-purple-400/30'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>BẮT ĐẦU CHIA CHỖ NGỒI</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
