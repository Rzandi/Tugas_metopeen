## [Released] - 2025-12-01 (Major Update)

### Fitur Baru (Owner Exclusive)

- **Hapus Transaksi**: Owner kini dapat menghapus transaksi langsung dari Dashboard.
- **Manajemen Anggota**: Halaman khusus bagi Owner untuk melihat dan menghapus akun staff/admin.
- **Menu Navigasi Khusus**: Link "Anggota" dan "Inbox" hanya muncul untuk Owner.

### UI/UX Improvements

- **Modern Card Design**: Redesain halaman Manajemen Anggota dan Inbox Persetujuan menggunakan layout berbasis kartu yang responsif.
- **Button Styling**: Update gaya tombol "Jual" (Orange), "Restock" (Emerald), dan "Hapus" (Soft Red) agar lebih menarik dan interaktif.
- **Dark Mode Consistency**: Perbaikan warna dan variabel CSS agar tampilan dark mode konsisten di seluruh halaman baru.
- **Feedback Visual**: Penambahan pesan sukses/error dan konfirmasi dialog untuk aksi destruktif.

### Technical & Bug Fixes

- **Dynamic API URL**: Frontend kini otomatis mendeteksi apakah diakses via `localhost` atau IP Network (misal: `192.168.x.x`), sehingga tidak perlu ubah `.env` manual untuk akses mobile.
- **Session Persistence**: Perbaikan bug dimana user ter-logout saat refresh halaman.
- **Transaction ID Fix**: Perbaikan error "No query results" saat menghapus transaksi dengan ID string.
- **Error Handling**: Penambahan header `Accept: application/json` untuk mencegah error parsing HTML pada request API.

---

## [Unreleased] - 2025-11-30

### Fitur Baru

- **Role-Based Access Control (RBAC)**: Menambahkan role `owner`, `admin`, dan `staff`.
- **Approval Workflow**: Pendaftaran `admin` memerlukan persetujuan `owner`.
- **Manajemen Daftar Harga**: Fitur tambah, edit, jual, dan restock barang dengan sinkronisasi stok real-time.
- **Notifikasi Email**: Notifikasi ke owner saat ada pendaftaran admin baru.
- **Dark Mode**: Dukungan tema gelap untuk seluruh aplikasi.
- **Responsive Design**: Optimasi tampilan untuk perangkat mobile.

### Perbaikan & Refactor

- **Backend Integration**: Migrasi total dari `localStorage` ke API Backend Laravel untuk Dashboard, Transaksi, dan Laporan.
- **Automated Testing**: Menambahkan `EndToEndTest` untuk memverifikasi alur pendaftaran, login, dan transaksi.
- **Security**: Implementasi token Sanctum untuk semua endpoint yang dilindungi.

- Class `card` ditambahkan untuk memberikan gaya dasar yang konsisten dengan elemen lain.
- Ikon SVG ditambahkan untuk memberikan isyarat visual yang lebih jelas.
- Struktur `h4` dan `p` dipertahankan namun sekarang akan terlihat lebih baik di dalam card.
- **Integrasi Halaman Pengaturan**:
  - Menambahkan route baru untuk komponen `Settings`.
  - Menambahkan fungsi `handleUserUpdate` untuk menyegarkan state pengguna secara global saat profil diperbarui.

### `Dashboard.jsx`

- **Pesan Selamat Datang**: Menambahkan `useState` untuk memuat data pengguna dan menampilkan pesan sambutan yang personal.
- **Komponen DataViz**: Dibuat komponen baru `DataViz` untuk menampilkan visualisasi data sederhana dalam bentuk bar chart. Komponen ini menerima `sales` dan `expense` sebagai props dan menghitung persentase masing-masing untuk lebar bar.
- **Tampilan Visualisasi**: Di dalam JSX utama, komponen `<DataViz>` dipanggil untuk menampilkan ringkasan visual di dalam sebuah card baru.
- **formatIDR**: Diperbarui untuk tidak menampilkan angka desimal (`minimumFractionDigits: 0`) agar lebih rapi.

### `LoginForm.jsx`

- **Logika Inisialisasi**: Logika untuk inisialisasi pengguna default diubah dari `useState` ke dalam `useEffect` dengan dependency array kosong `[]`. Ini memastikan logika tersebut hanya berjalan satu kali saat komponen pertama kali dimuat (mount), yang merupakan praktik yang lebih tepat dan efisien.
- **Sentralisasi Fungsi**: Logika untuk mengambil dan menyimpan data pengguna dipindahkan ke `src/utils/storage.js`.

### `Settings.jsx` (Fitur Baru)

- **Pengaturan Profil**: Pengguna (owner & staff) dapat mengubah nama dan password mereka.
- **Manajemen Pengguna (Khusus Owner)**: Owner dapat melihat daftar pengguna `staff` dan memiliki otoritas untuk menghapus akun mereka.

### `Navbar.jsx`

- **Tombol Pengaturan**: Menambahkan ikon "gear" yang berfungsi sebagai link ke halaman Pengaturan.

### `utils/storage.js` (Pembaruan)

- **Sentralisasi Logika**: Fungsi untuk mengelola data `users` (`getUsers`, `saveUsers`) dan logika inisialisasi pengguna default ditempatkan di sini.

---

## Saran Umum & Pengembangan Selanjutnya

- **Manajemen State Global**: Saat aplikasi semakin kompleks, pertimbangkan untuk menggunakan Context API atau library seperti Redux/Zustand untuk mempermudah pengelolaan state di seluruh aplikasi.
- **Validasi Input**: Formulir bisa ditingkatkan dengan validasi yang lebih detail.
- **Backend & Database**: Untuk aplikasi yang sesungguhnya, data sebaiknya disimpan di database melalui API backend, bukan `localStorage`.
- **Fitur Tambahan**: Anda bisa menambahkan fitur seperti edit/hapus transaksi, paginasi pada tabel, atau grafik yang lebih interaktif.
- **Styling**: Penggunaan variabel CSS sudah sangat baik. Untuk proyek lebih besar, pertimbangkan menggunakan CSS Modules atau Styled-Components.
