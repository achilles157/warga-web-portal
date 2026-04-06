# Dokumentasi Pengembangan: Warga Web Portal

Dokumen ini merangkum apa saja yang telah berhasil dikembangkan, struktur proyek, dan fitur-fitur yang sudah teridentifikasi di dalam sistem `Warga Web Portal`.

## 🏗️ Tech Stack & Arsitektur
- **Frontend Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Database & Backend**: Firebase (Firestore)
- **Authentication**: Firebase Auth
- **Text Editor**: Tiptap / Custom Rich Text Editor

---

## 🚀 Fitur Utama yang Telah Dikembangkan

### 1. Sistem Publik (Public-Facing Website)
Fitur yang dapat diakses oleh pembaca reguler (Warga).
- **Halaman Utama (Homepage)**: Menampilkan artikel-artikel terbaru, pilihan kurasi (Weekly Picks), dan navigasi kategori.
- **Halaman Baca Artikel (`/read/[slug]`)**: Menampilkan isi artikel secara lengkap beserta bibliografi. Juga mendukung identifikasi artikel terkunci (*locked content*) yang mengharuskan redirect ke aplikasi mobile.
- **Halaman Kategori (`/[category]`)**: Menampilkan artikel berdasarkan tag/kategori spesifik (mis. Investigasi, Opini).
- **Halaman Penulis (`/author`)**: Menampilkan profil penulis dan artikel-artikel yang telah mereka buat.

### 2. Autentikasi & Otorisasi
- **Login (`/login`)**: Sistem masuk menggunakan kredensial Firebase Auth.
- **Role-Based Access Control (RBAC)**: Pengelolaan hak akses dengan peran (Admin, Staff, Contributor).
- **Auth Context (`components/auth`)**: Memastikan state pengguna tersinkronisasi di seluruh komponen (apakah sedang login atau tidak).

### 3. Dashboard Editorial (Admin Portal)
Halaman internal Warga Daily untuk pengelolaan konten oleh tim redaksi.
- **Overview Area (`/dashboard`)**: Ringkasan performa/status artikel.
- **Article Management (`/dashboard/articles`)**: 
  - **Daftar Artikel**: Melihat seluruh artikel dengan filter status (Draft, Pending Review, Published, Rejected).
  - **Editor Artikel (`/dashboard/articles/[id]`)**: Halaman untuk mengedit metadata, status, thumbnail, judul, dan *body* artikel. Tersedia pula pengaturan App Integration untuk mengunci konten (locked text / Call-to-action).
- **Settings (`/dashboard/settings`)**: Konfigurasi profil atau pengaturan lainnya.

### 4. Komponen & Editor Khusus
- **Rich Text Editor (`components/editor/RichTextEditor.tsx`)**: Editor WYSIWYG untuk menulis paragraf, heading, atau media.
- **Bibliography Editor (`components/editor/BibliographyEditor.tsx`)**: Komponen untuk mengelola referensi dan daftar pustaka yang digunakan dalam sebuah tulisan.
- **Auto-resize Judul**: Input judul yang canggih (komponen `textarea` otomatis menyesuaikan tinggi tulisan yang terlalu panjang), sehingga menghindari teks terpotong (*text-clipping*).

---

## 📁 Struktur Direktori (Mapping)

```text
warga-web-portal/
├── app/
│   ├── [category]        # Tampilan List Artikel berdasarkan Kategori
│   ├── author            # Tampilan Profil Penulis & Artikelnya
│   ├── dashboard/        # CMS / Editorial Portal (Private)
│   │   ├── articles/     # Pengelolaan & Editor Artikel
│   │   └── settings/     # Pengaturan Akun Redaksi
│   ├── login/            # Halaman Login
│   ├── read/             # Halaman Baca Artikel
│   ├── globals.css       # Tailwind entry & global styling
│   ├── layout.tsx        # Root layout website
│   └── page.tsx          # Homepage website
├── components/
│   ├── article/          # Komponen UI spesifik artikel (mis. Section, Bibliografi)
│   ├── auth/             # Konteks Auth
│   ├── editor/           # Modul Editor Text & Bibliografi
│   ├── home/             # Komponen untuk UI Homepage
│   └── layout/           # Komponen tata letak (Navbar, Footer, Sidebar, dll)
├── lib/
│   ├── services/
│   │   ├── articleService.ts # Komunikasi Firestore untuk Artikel
│   │   └── userService.ts    # Komunikasi Firestore untuk User/Role
│   ├── firebase.ts       # Inisialisasi SDK Firebase
│   └── utils.ts          # Fungsi utilitas (mis. tailwind merge)
└── next.config.ts        # Konfigurasi Next.js
```

---

## 💡 Status Observasi (Udah Sampai Mana?)

1. **Struktur Dasar Selesai**: Skema routing fundamental untuk Next.js App Router (baik mode publik maupun *dashboard auth*) sudah berjalan.
2. **Koneksi Database Aktif**: Layer `services` sudah menangani CRUD operasi (seperti fungsi `updateArticle` di `articleService.ts` untuk menyimpan draft, dan lain-lain).
3. **Penyempurnaan UI Sedang Berlangsung**: Sistem berangsur memoles komponen UI per bagian agar lebih *user-friendly* (mis. perbaikan input form editor yang tidak terpotong (word wrap), integrasi visualisasi bibliografi).
