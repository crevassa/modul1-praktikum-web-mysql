# Praktikum Pemrograman Web - Modul 1: Integrasi Node.js dan MySQL

Aplikasi Node.js sederhana untuk Manajemen Buku dan Penulis (E-Library) dengan `mysql2`,
`dotenv`, Connection Pool, dan Parameterized Query.

## Cara menjalankan
1. Nyalakan MySQL (XAMPP -> Start MySQL).
2. `npm install`
3. Sesuaikan `.env` (salin dari `.env.example`; password root XAMPP bawaan = kosong).
4. `node migrate.js` (membuat database `praktikum_db` + tabel; **menghapus tabel lama**).
5. `node app.js` (insert, join, filter, update, delete).

Catatan: `app.js` memasukkan email penulis yang bersifat UNIQUE, jadi jalankan `node migrate.js`
lebih dulu setiap kali ingin menjalankan `node app.js` ulang.
