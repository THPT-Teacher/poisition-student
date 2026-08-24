import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ban, DoorOpen } from 'lucide-react';
import type { Seat, Student, DoorPosition } from '../types/classroom';

interface SeatGridProps {
  seats: Seat[];
  students: Student[];
  numGroups: number;
  desksPerGroup: number;
  doorPosition: DoorPosition;
  mascot: string;
  currentHopSeatId: string | null;
  highlightWinnerSeatId: string | null;
  isEditingSeats?: boolean;
  onToggleSeat?: (seatId: string) => boolean;
  onToggleDesk?: (groupIndex: number, deskNumber: number) => boolean;
}

export const SeatGrid: React.FC<SeatGridProps> = ({
  seats,
  students,
  numGroups,
  desksPerGroup,
  doorPosition,
  mascot,
  currentHopSeatId,
  highlightWinnerSeatId,
  isEditingSeats = false,
  onToggleSeat,
  onToggleDesk,
}) => {
  const studentMap = useMemo(() => {
    const map = new Map<string, Student>();
    students.forEach(s => map.set(s.id, s));
    return map;
  }, [students]);

  // Gom các ghế theo từng Tổ -> từng Bàn
  const groupsData = useMemo(() => {
    const groups: { groupIndex: number; groupName: string; desks: { deskNumber: number; seats: Seat[] }[] }[] = [];

    for (let g = 1; g <= numGroups; g++) {
      const desks: { deskNumber: number; seats: Seat[] }[] = [];
      for (let d = 1; d <= desksPerGroup; d++) {
        const deskSeats = seats.filter(s => s.groupIndex === g && s.deskNumber === d);
        deskSeats.sort((a, b) => a.seatInDesk - b.seatInDesk);
        desks.push({ deskNumber: d, seats: deskSeats });
      }
      groups.push({ groupIndex: g, groupName: `TỔ ${g}`, desks });
    }

    return groups;
  }, [seats, numGroups, desksPerGroup]);

  // Vị trí cửa lớp học
  const isFrontLeftDoor = doorPosition === 'front-left';
  const isFrontRightDoor = doorPosition === 'front-right';
  const isBackLeftDoor = doorPosition === 'back-left';
  const isBackRightDoor = doorPosition === 'back-right';

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 w-full relative">
      {/* KHU VỰC TRÊN CÙNG: BẢNG LỚP HỌC & CỬA TRƯỚC */}
      <div className="w-full max-w-5xl mx-auto mb-4 flex items-center justify-between gap-3 relative">
        {/* Cửa trước bên trái */}
        {isFrontLeftDoor ? (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 text-xs font-black shadow-lg animate-pulse">
            <DoorOpen className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <div>CỬA RA VÀO</div>
              <span className="text-[10px] text-amber-200/80 font-normal">Cửa trước (Trái)</span>
            </div>
          </div>
        ) : (
          <div className="w-24 hidden sm:block opacity-0" />
        )}

        {/* BẢNG LỚP HỌC (Blackboard) */}
        <div className="flex-1 max-w-xl mx-auto">
          <div className="bg-gradient-to-b from-emerald-900 to-emerald-950 border-4 border-amber-800 rounded-2xl py-2.5 px-6 shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-1 left-2 w-2 h-2 rounded-full bg-amber-400/40" />
            <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-400/40" />
            <div className="flex items-center justify-center gap-2">
              <span className="text-amber-300/90 text-sm">✏️</span>
              <span className="font-extrabold text-xs md:text-sm tracking-widest text-emerald-100 uppercase drop-shadow">
                BẢNG LỚP HỌC & BÀN GIÁO VIÊN
              </span>
              <span className="text-amber-300/90 text-sm">✏️</span>
            </div>
          </div>
        </div>

        {/* Cửa trước bên phải */}
        {isFrontRightDoor ? (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 text-xs font-black shadow-lg animate-pulse">
            <DoorOpen className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <div>CỬA RA VÀO</div>
              <span className="text-[10px] text-amber-200/80 font-normal">Cửa trước (Phải)</span>
            </div>
          </div>
        ) : (
          <div className="w-24 hidden sm:block opacity-0" />
        )}
      </div>

      {/* SƠ ĐỒ CÁC TỔ & BÀN ĐÔI 2 CHỖ XẾP DỌC */}
      <div className="w-full max-w-6xl overflow-x-auto p-2 flex justify-center">
        <div className="flex items-start gap-4 sm:gap-6 md:gap-8 p-4 bg-slate-900/70 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-md">
          {groupsData.map((group, groupIdx) => (
            <React.Fragment key={group.groupIndex}>
              {/* CỘT CỦA 1 TỔ (DÃY DỌC TỪ TRÊN XUỐNG DƯỚI) */}
              <div className="flex flex-col items-center min-w-[150px] sm:min-w-[175px]">
                {/* Header Tiêu Đề Tổ */}
                <div className="w-full mb-3 py-1.5 px-3 rounded-xl bg-gradient-to-r from-purple-900/90 to-indigo-900/90 border border-purple-500/40 text-center shadow-md">
                  <span className="font-black text-xs sm:text-sm text-purple-200 tracking-wider">
                    🏛️ {group.groupName}
                  </span>
                  <div className="text-[10px] text-slate-400">
                    {group.desks.length} bàn · {group.desks.flatMap(d => d.seats).filter(s => !s.disabled).length} chỗ dùng
                  </div>
                </div>

                {/* Các Bàn Đôi Trong Tổ (Xếp dọc xuống) */}
                <div className="w-full space-y-3">
                  {group.desks.map(desk => (
                    <div
                      key={desk.deskNumber}
                      className={`p-1.5 rounded-2xl border shadow-inner relative group transition ${
                        desk.seats.every(s => s.disabled)
                          ? 'bg-slate-950/40 border-dashed border-slate-700/50 opacity-70'
                          : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {/* Nhãn Bàn số mấy — bấm để tắt/bật cả bàn khi đang chỉnh */}
                      <button
                        type="button"
                        disabled={!isEditingSeats}
                        onClick={() => onToggleDesk?.(group.groupIndex, desk.deskNumber)}
                        title={isEditingSeats ? 'Bấm để tắt/bật cả bàn này' : undefined}
                        className={`text-[9px] font-bold absolute -top-2 left-2.5 px-1.5 py-0.2 rounded border ${
                          isEditingSeats
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30 cursor-pointer'
                            : 'bg-slate-900 text-slate-400 border-slate-700 cursor-default'
                        }`}
                      >
                        Bàn {desk.deskNumber}
                      </button>

                      {/* 2 Chỗ Ngồi Ghép Đôi Cạnh Nhau */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        {desk.seats.map(seat => {
                          const occupiedStudent = seat.studentId ? studentMap.get(seat.studentId) : null;
                          const isHoppingHere = currentHopSeatId === seat.id;
                          const isWinner = highlightWinnerSeatId === seat.id;
                          const isDisabled = Boolean(seat.disabled);
                          const canToggle = isEditingSeats && !occupiedStudent;

                          return (
                            <motion.div
                              key={seat.id}
                              role={canToggle ? 'button' : undefined}
                              tabIndex={canToggle ? 0 : undefined}
                              onClick={() => {
                                if (canToggle) onToggleSeat?.(seat.id);
                              }}
                              onKeyDown={e => {
                                if (canToggle && (e.key === 'Enter' || e.key === ' ')) {
                                  e.preventDefault();
                                  onToggleSeat?.(seat.id);
                                }
                              }}
                              animate={{
                                scale: isWinner ? [1, 1.15, 1.05] : isHoppingHere ? [1, 1.12, 1] : 1,
                              }}
                              transition={{ duration: 0.3 }}
                              className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-center relative select-none border-2 transition-all ${
                                isWinner
                                  ? 'bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.9)] z-20 ring-2 ring-amber-300 text-white animate-winner-burst'
                                  : isHoppingHere
                                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-purple-300 shadow-[0_0_25px_rgba(236,72,153,0.8)] z-10 scale-105'
                                  : occupiedStudent
                                  ? 'bg-slate-800/95 border-purple-500/60 shadow-sm text-slate-100'
                                  : isDisabled
                                  ? `bg-slate-950/70 border-dashed border-rose-500/40 text-slate-500 ${canToggle ? 'cursor-pointer hover:border-emerald-400/60 hover:bg-slate-900' : ''}`
                                  : `bg-slate-800/40 border-slate-700/60 text-slate-400 ${canToggle ? 'cursor-pointer hover:bg-rose-950/40 hover:border-rose-400/50' : 'hover:bg-slate-800/70'}`
                              }`}
                            >
                              {/* Số ghế */}
                              <span
                                className={`absolute top-0.5 left-1 text-[9px] font-black ${
                                  isWinner || isHoppingHere
                                    ? 'text-white'
                                    : occupiedStudent
                                    ? 'text-purple-300 font-bold'
                                    : isDisabled
                                    ? 'text-slate-600 line-through'
                                    : 'text-slate-400'
                                }`}
                              >
                                #{seat.number}
                              </span>

                              {/* Vị trí Ghế (Trái/Phải trong bàn) */}
                              <span
                                className={`absolute top-0.5 right-1 text-[8px] font-medium ${
                                  isWinner || isHoppingHere ? 'text-white/80' : 'text-slate-400'
                                }`}
                              >
                                {seat.seatInDesk === 1 ? 'T' : 'P'}
                              </span>

                              {/* Nội dung ghế */}
                              <div className="flex flex-col items-center justify-center text-center w-full px-0.5">
                                {occupiedStudent ? (
                                  <div className="flex flex-col items-center w-full animate-in zoom-in duration-300">
                                    <span className="text-lg sm:text-xl">{occupiedStudent.avatarIcon || '⭐'}</span>
                                    <span className="text-[10px] font-bold text-purple-100 truncate w-full max-w-[65px] drop-shadow leading-tight">
                                      {occupiedStudent.name}
                                    </span>
                                  </div>
                                ) : isHoppingHere ? (
                                  <span className="text-xl sm:text-2xl animate-bounce">{mascot}</span>
                                ) : isDisabled ? (
                                  <div className="flex flex-col items-center gap-0.5">
                                    <Ban className="w-4 h-4 text-rose-400/80" />
                                    <span className="text-[9px] font-black text-rose-300/80 uppercase">Tắt</span>
                                  </div>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-400 opacity-80">
                                    {canToggle ? 'Bấm tắt' : 'Trống'}
                                  </span>
                                )}
                              </div>

                              {/* Huy hiệu trúng thưởng */}
                              <AnimatePresence>
                                {isWinner && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1.1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="absolute -top-2.5 -right-1 bg-amber-400 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-full shadow border border-white uppercase animate-bounce"
                                  >
                                    🎉 TRÚNG!
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LỐI ĐI GIỮA CÁC TỔ */}
              {groupIdx < groupsData.length - 1 && (
                <div className="flex flex-col items-center justify-center self-stretch px-1 sm:px-2 select-none opacity-40 hover:opacity-80 transition">
                  <div className="h-full border-r-2 border-dashed border-slate-600 flex flex-col justify-around py-4">
                    <span className="text-[10px] font-bold text-slate-400 rotate-90 whitespace-nowrap tracking-widest uppercase">
                      Lối đi
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 rotate-90 whitespace-nowrap tracking-widest uppercase">
                      Lối đi
                    </span>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* KHU VỰC CUỐI LỚP HỌC (CỬA SAU NẾU CÓ) */}
      <div className="w-full max-w-5xl mx-auto mt-4 flex items-center justify-between gap-3">
        {isBackLeftDoor ? (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 text-xs font-black shadow-lg animate-pulse">
            <DoorOpen className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <div>CỬA RA VÀO</div>
              <span className="text-[10px] text-amber-200/80 font-normal">Cửa sau (Trái)</span>
            </div>
          </div>
        ) : (
          <div className="w-24 hidden sm:block opacity-0" />
        )}

        <div className="text-xs text-slate-400 font-medium">
          💡 Quy ước: <strong className="text-purple-300">Tổ 1</strong> (bên trái lớp) → <strong className="text-purple-300">Tổ {numGroups}</strong> (bên phải lớp). Mỗi bàn gồm 2 ghế ghép đôi.
        </div>

        {isBackRightDoor ? (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 text-xs font-black shadow-lg animate-pulse">
            <DoorOpen className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <div>CỬA RA VÀO</div>
              <span className="text-[10px] text-amber-200/80 font-normal">Cửa sau (Phải)</span>
            </div>
          </div>
        ) : (
          <div className="w-24 hidden sm:block opacity-0" />
        )}
      </div>
    </div>
  );
};
