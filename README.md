# 🎲 Web Chia Chỗ Ngồi Lớp Học Ngẫu Nhiên (Random Seat Classroom)

Ứng dụng web tương tác vui nhộn, sống động dành cho giáo viên và học sinh để chia chỗ ngồi ngẫu nhiên trong lớp học. Được thiết kế với giao diện chuẩn màn chiếu lớp học, hỗ trợ tiếng Việt 100%, hiệu ứng hoạt họa mượt mà, âm thanh sinh động và tự động lưu trữ.

---

## 🌟 Tính Năng Nổi Bật

1. **Giao Diện Tiếng Việt Trực Quan & Vui Nhộn**:
   - Thiết kế theo phong cách Game Show lớp học (màu sắc tươi sáng, card bo tròn hiện đại, hiệu ứng phát sáng mượt mà).
   - Vị trí **BẢNG LỚP HỌC & BÀN GIÁO VIÊN** trên cùng giúp học sinh dễ dàng định hướng chỗ ngồi của mình.
2. **Quy Trình 2 Bước Tương Tác**:
   - **Bước 1 — 🎰 Vòng Quay Chọn Học Sinh**: Vòng quay Slot Machine quay nhanh qua danh sách học sinh chưa có chỗ rồi dừng lại ở bạn may mắn.
   - **Bước 2 — 🎲 Lắc Xúc Xắc 3D & Linh Vật Nhảy Bàn**: Học sinh trực tiếp lên bấm xúc xắc 3D xoay tít, sau đó chú Ếch 🐸 (hoặc 🐱, 🐶, 🚀, 🦄, 🐼) sẽ nhảy nhót tưng tưng qua các bàn trống và dừng lại tại bàn trúng thưởng kèm hiệu ứng pháo hoa rực rỡ.
3. **Hiệu Ứng Âm Thanh Tương Tác (Web Audio API)**:
   - Tự tổng hợp âm thanh dạng game vui nhộn: Tiếng *tick tick* quay số, tiếng xúc xắc lắc, tiếng *boing boing* linh vật nhảy qua từng bàn, âm thanh *Tada!* chúc mừng.
   - Có nút Bật/Tắt âm thanh tiện lợi trên thanh Header.
4. **Lưu Trữ & Khôi Phục Thông Minh**:
   - Tự động lưu vào `localStorage` giúp tải lại trang (F5) không bao giờ bị mất danh sách hay kết quả đang chia dở.
   - Kết nối Supabase lưu dữ liệu đám mây với URL và Anon Key đã cấu hình.
5. **Tiện Ích Cho Giáo Viên**:
   - Dễ dàng dán danh sách học sinh từ Excel hoặc Word.
   - Tự động kiểm tra phát hiện tên trùng lặp.
   - Tùy chỉnh số Hàng x Cột với thanh xem trước trực quan. Cảnh báo rõ ràng nếu số bàn ít hơn số học sinh.
   - Hỗ trợ In/Lưu Sơ Đồ Lớp Học (PDF) sau khi chia xong.
   - Nút "Bốc Thăm Lại" (giữ nguyên danh sách lớp) và "Tạo Lớp Mới".

---

## 🚀 Hướng Dẫn Chạy Trên Máy Tính

1. Cài đặt các gói thư viện:
   ```bash
   npm install
   ```

2. Khởi động môi trường phát triển:
   ```bash
   npm run dev
   ```

3. Mở trình duyệt tại địa chỉ hiển thị trên màn hình (thường là `http://localhost:5173`).

---

## 📦 Hướng Dẫn Triển Khai Lên GitHub & Vercel

1. **Khởi tạo Git & Đẩy lên GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: Khoi tao ung dung Random Seat Classroom Tieng Viet"
   git branch -M main
   git remote add origin <URL-REPO-GITHUB-CUA-BAN>
   git push -u origin main
   ```

2. **Triển khai lên Vercel / Netlify**:
   - Truy cập [vercel.com](https://vercel.com) và chọn **Import Git Repository**.
   - Chọn repository vừa tạo, cài đặt Environment Variables nếu cần (`VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`), sau đó bấm **Deploy**.
