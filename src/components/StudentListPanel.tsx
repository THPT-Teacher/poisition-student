import React from 'react';
import { Users, CheckCircle2, CircleDashed, Sparkles } from 'lucide-react';
import type { Student, Seat } from '../types/classroom';

interface StudentListPanelProps {
  students: Student[];
  seats: Seat[];
  onStartRandomStudent: () => void;
  isGameActive: boolean;
}

export const StudentListPanel: React.FC<StudentListPanelProps> = ({
  students,
  seats,
  onStartRandomStudent,
  isGameActive,
}) => {
  const seatMap = React.useMemo(() => {
    const map = new Map<string, Seat>();
    seats.forEach(st => map.set(st.id, st));
    return map;
  }, [seats]);

  const assignedStudents = students.filter(s => s.assignedSeatId);
  const unassignedStudents = students.filter(s => !s.assignedSeatId);

  return (
    <aside className="w-full lg:w-80 bg-slate-800/80 backdrop-blur-md rounded-3xl border border-slate-700/60 p-4 flex flex-col shadow-xl h-full max-h-[85vh]">
      {/* Nút bấm Chọn Học Sinh Ngẫu Nhiên */}
      <div className="mb-4">
        <button
          onClick={onStartRandomStudent}
          disabled={unassignedStudents.length === 0 || isGameActive}
          className={`w-full py-4 px-4 rounded-2xl font-black text-base md:text-lg flex items-center justify-center gap-2.5 shadow-xl transition-all ${
            unassignedStudents.length === 0
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600'
              : isGameActive
              ? 'bg-purple-900/60 text-purple-300 border border-purple-700 cursor-wait'
              : 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 hover:from-purple-600 hover:via-pink-600 hover:to-amber-600 text-white shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] ring-2 ring-purple-400/30'
          }`}
        >
          <span className="text-2xl animate-pulse">🎰</span>
          <span className="tracking-wide uppercase drop-shadow-sm">
            {unassignedStudents.length === 0
              ? 'ĐÃ CHIA HẾT CHỖ 🎉'
              : isGameActive
              ? 'ĐANG CHIA CHỖ...'
              : 'CHỌN HỌC SINH'}
          </span>
        </button>
      </div>

      {/* Tiêu đề & Bộ lọc trạng thái */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider">
            DANH SÁCH LỚP ({students.length})
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {assignedStudents.length}
          </span>
          <span className="text-slate-400">/</span>
          <span className="text-amber-400 flex items-center gap-1">
            <CircleDashed className="w-3.5 h-3.5" />
            {unassignedStudents.length}
          </span>
        </div>
      </div>

      {/* Danh sách học sinh có thể cuộn */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {/* Chưa có chỗ */}
        {unassignedStudents.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[11px] font-black text-amber-400/90 uppercase tracking-wider px-1">
              ⏳ Đang đợi ({unassignedStudents.length})
            </div>
            {unassignedStudents.map((st, i) => (
              <div
                key={st.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-700/50 hover:border-purple-500/50 transition group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xs font-mono font-bold text-slate-500 w-5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-base group-hover:scale-110 transition">{st.avatarIcon}</span>
                  <span className="text-sm font-bold text-slate-200 truncate">{st.name}</span>
                </div>
                <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                  Chưa nhận
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Đã nhận chỗ */}
        {assignedStudents.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <div className="text-[11px] font-black text-emerald-400/90 uppercase tracking-wider px-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Đã có chỗ ngồi ({assignedStudents.length})
            </div>
            {assignedStudents.map(st => {
              const seat = st.assignedSeatId ? seatMap.get(st.assignedSeatId) : null;
              return (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-purple-950/30 border border-purple-700/40 text-purple-200 shadow-sm"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-base">{st.avatarIcon}</span>
                    <span className="text-sm font-bold text-slate-100 truncate line-through decoration-slate-500/60">
                      {st.name}
                    </span>
                  </div>
                  {seat && (
                    <span className="text-xs font-black bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                      Bàn #{String(seat.number).padStart(2, '0')}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
