📘 WargaPlus Technical Reference & Integration Guide

Versi Dokumen: 1.0
Tanggal: 25 Mei 2025
Repository: warga_plus (Flutter App)

1. Ikhtisar Project (Overview)

WargaPlus adalah aplikasi mobile berbasis Flutter yang berfungsi sebagai "Laboratorium Edukasi Kebijakan Publik". Aplikasi ini menggabungkan jurnalisme investigasi dengan gamifikasi dan interaksi AI.

Tech Stack

Framework: Flutter (Dart)

Backend: Firebase (Firestore, Auth, Storage)

AI Engine: Groq API (Llama 3.1-8b) - Lihat lib/core/services/ai_service.dart

Architecture: Feature-First Layered Architecture (lib/features/)

2. Struktur Direktori (Folder Structure)

Struktur ini memisahkan kode berdasarkan fitur bisnis, memudahkan skalabilitas.

lib/
├── core/                   # Komponen inti yang dipakai di mana-mana
│   ├── config/             # Konfigurasi App (API Keys, Env)
│   ├── services/           # Logika bisnis global (AI, Auth, Content)
│   ├── theme/              # Styling (Warna, Font)
│   └── widgets/            # Widget reusable (ResponsiveWrapper)
├── features/               # Modul Fitur Utama
│   ├── admin/              # Portal upload JSON & validasi
│   ├── auth/               # Login & Register UI
│   ├── home/               # Timeline & Dashboard
│   ├── reader/             # INTI APLIKASI: Chat Stream & Redacted Doc
│   └── profile/            # Gamifikasi & Badges
├── main.dart               # Entry point
└── firebase_options.dart   # Config Firebase


3. Struktur Data Konten (The JSON Schema)

Ini adalah bagian TERPENTING untuk integrasi Web Portal. Web Portal akan membaca/memparse sebagian data ini untuk dijadikan artikel berita.

File referensi: content_releases/bencanasumatra.json

3.1. Level Root (Metadata Rilis)

Data ini digunakan untuk menampilkan kartu di Timeline App dan Headline di Web.

{
  "release_id": "ekologi_bencana_sumatera", // ID Unik (Slug)
  "title": "Ekologi Bencana: Jejak Oligarki di Sumatera",
  "description": "Investigasi forensik di balik banjir bandang...",
  "cover_image": "URL_GAMBAR",
  "author": "Tim Riset Warga+",
  "created_at": "ISO-8601 Date",
  "tags": ["environment", "politics"],
  "total_xp": 450,
  "sub_modules": [ ... ] // Array Sub-Modul (Lihat 3.2)
}


3.2. Level Sub-Modul (Chapter)

Setiap rilis dipecah menjadi beberapa chapter. Web Portal bisa me-link ke ID spesifik di sini.

{
  "id": "sub_01_intro_bencana",
  "title": "Intro: Bencana atau Kejahatan?",
  "type": "chat_stream", // Tipe: 'chat_stream' atau 'redacted_doc'
  "xp_reward": 40,
  "ai_context": "Teks panjang untuk pengetahuan AI...", // PENTING: Ini sumber artikel Web
  "chat_script": [ ... ] // Array percakapan (Lihat 3.3)
}


3.3. Tipe Konten Khusus

A. Chat Stream (chat_script)

Digunakan untuk simulasi percakapan di App.

{
  "role": "ai", // atau 'user', 'system'
  "text": "Halo Warga! Ada kabar buruk nih..."
}


B. Bibliography Card (bibliography_card)

Digunakan untuk validitas data (Daftar Pustaka).

{
  "role": "bibliography_card",
  "title": "Sumber Data",
  "content": "• Laporan Walhi 2024\n• Data GFW"
}


4. Fitur Utama & Logika Integrasi

4.1. AI Service (lib/core/services/ai_service.dart)

Sistem AI menggunakan RAG (Retrieval-Augmented Generation) sederhana.

Logika: Saat user bertanya, App mengirimkan ai_context dari JSON + Pertanyaan User ke API LLM.

Persona:

Default: Asisten edukasi netral.

Redacted Doc: Whistleblower/Investigator (Prompt khusus di baris 25-30).

Integrasi Web: Web Portal tidak perlu menjalankan AI Service ini. Web hanya menampilkan hasil statis, lalu mengarahkan user ke App untuk chat.

4.2. Redacted Document Reader (redacted_doc_screen.dart)

Fitur unggulan untuk membaca dokumen sensor.

Cara Kerja: Teks ditampilkan dengan efek blur/hitam. User harus tap/geser untuk membuka.

Integrasi Web (Locked Content):

Web Portal mengambil ai_context dari JSON.

Tampilkan 3 paragraf awal.

Sisanya di-blur menggunakan CSS.

Tombol "Buka di App" menggunakan Deep Link.

4.3. Gamifikasi (Badges)

Aset lencana ada di assets/badges/.

Logika: Setiap menyelesaikan sub-modul, user dapat XP. Jika total XP cukup/menyelesaikan topik tertentu, badge diberikan.

Daftar Badge:

oligarch_hunter: Investigasi korupsi/ekonomi politik.

earth_guardian: Isu lingkungan.

historian: Isu sejarah (Cacat Wawasan).

lawmaker: Isu hukum (KUHAP).

5. Protokol Integrasi Web Portal (Deep Linking)

Agar Web Portal bisa membuka halaman spesifik di App, gunakan skema URL berikut:

Format URL Scheme

wargaplus://open/module/{release_id}/{sub_module_id}

Contoh Implementasi

Kasus: User membaca artikel "Bencana Sumatra" di Web.

Tombol CTA: "Buka Dokumen Tata Kelola".

Link: wargaplus://open/module/ekologi_bencana_sumatera/sub_03_dokumen_tata_kelola

Behavior di App:

App terbuka.

Routing otomatis menavigasi ke RedactedDocScreen.

Memuat data JSON bencanasumatra.json.

Scroll ke sub-modul sub_03.

6. Aset & Branding

Gunakan path ini untuk menjaga konsistensi visual antara Web dan App.

Logo Utama: assets/logo/app_logo.png (Gunakan di Header Web).

Favicon Web: web/favicon.png.

Maskot (Bung Warga):

Netral: assets/mascot/bung_warga_neutral.png

Berpikir: assets/mascot/bung_warga_thinking.png (Gunakan untuk artikel opini/analisis).

7. Setup & Deployment (Development)

Menjalankan App (Flutter)

flutter pub get
flutter run


Pastikan file google-services.json sudah ada di android/app/.

Mengupdate Konten

Edit file JSON di folder content_releases/.

Gunakan fitur Admin Portal di App (lib/features/admin/) untuk upload JSON ke Firestore.

Catatan: Saat ini fitur import masih manual/dev mode. Untuk production, gunakan script upload.

Kontak Pengembang:
Falah Fahrurozi