# Changelog Aplikasi

Di sini Anda akan menemukan riwayat perubahan dan penjelasan untuk setiap pembaruan yang dilakukan pada kode.

---

## Pembaruan Terakhir

### `App.jsx`
- **Tampilan Pesan Status**: Komponen `div` untuk pesan "Akses Ditolak" dan "Anda Belum Login" diperbarui.
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
