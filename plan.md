📑 MASTERPLAN V2.0: WARGA DAILY (COMMUNITY JOURNALISM)

Versi Dokumen: 2.0 (Updated with Editorial Workflow)
Fokus: CMS, Community Submission, & App Conversion.

🏗️ BAB I: ARSITEKTUR & EKOSISTEM

1.1. Perubahan Konsep Fundamental

Website kini berfungsi ganda:

Public Front-End: Portal berita yang dibaca pengunjung.

Editorial Back-End (Dashboard): Ruang kerja untuk Penulis, Redaktur, dan Kontributor mengirim serta mereview tulisan.

1.2. Struktur Pengguna (User Roles)

Sistem ini membagi pengguna menjadi 3 level kewenangan:

Role

Deskripsi & Kewenangan

Admin/Redaktur (Editor)

- Akses penuh ke CMS.



- Bisa menulis & publish langsung.



- Wajib mereview tulisan Kontributor (Approve/Reject).



- Bisa mengedit tulisan orang lain.

Penulis Internal (Staff)

- Tim inti WargaPlus.



- Bisa menulis & publish langsung (Bypass review).



- Tidak bisa mengedit tulisan orang lain.

Kontributor (Audiens)

- Pengguna umum yang login via Google/Email.



- Bisa membuat Draft Artikel.



- Status artikel "Pending Review" saat disubmit.



- Tidak bisa publish sendiri.

💾 BAB II: STRUKTUR DATA (FIRESTORE SCHEMA)

Agar alur review dan fitur "Locked Content" berjalan mulus, skema database harus mengakomodasi status artikel dan metadata integrasi aplikasi.

2.1. Collection: web_users

Menyimpan profil penulis dan peran mereka.

2.2. Collection: web_articles

Koleksi utama. Memiliki field status untuk workflow redaksi.

(Detail JSON ada di file terpisah: firestore_schema_example.json)

⚙️ BAB III: ALUR KERJA REDAKSI (EDITORIAL WORKFLOW)

3.1. Skenario 1: Penulis Internal / Redaktur

Login ke Dashboard (/dashboard).

Klik "New Article".

Menulis konten (Rich Text Editor).

Menentukan apakah artikel ini ada "Locked Content" yang nyambung ke App.

Klik "Publish Now".

System: Artikel langsung live dengan status published.

3.2. Skenario 2: Kontributor (Audiens)

Login ke Website (/login).

Masuk ke menu "Kirim Tulisan".

Menulis konten.

Klik "Submit for Review".

System: Artikel disimpan dengan status pending_review.

Redaktur menerima notifikasi (di dashboard) ada tulisan baru.

Redaktur membaca, mengedit typo, dan memutuskan:

Approve: Status berubah jadi published. Kontributor dapat notifikasi email.

Reject: Status jadi rejected + Catatan Redaktur (misal: "Kurang data valid").

🌉 BAB IV: INTEGRASI "LOCKED CONTENT" (THE HOOK)

Ini adalah strategi monetisasi/konversi ke SuperApp.

4.1. Mekanisme "The Paywall"

Di dalam CMS editor, Redaktur/Penulis memiliki opsi khusus: "Insert App Lock".

Penulis menentukan di paragraf ke berapa artikel akan dipotong.

Penulis memilih Module ID dari SuperApp yang relevan (misal: bencanasumatra).

4.2. Tampilan di Sisi Pembaca (Front-End)

Ketika artikel dirender oleh Next.js:

Sistem membaca field is_locked.

Jika true, sistem merender konten hanya sampai batas yang ditentukan.

Di bawah batas itu, render komponen <AppLockCard />.

Visual: Blur gradient.

Data: Mengambil cta_text dari database (misal: "Buka Dokumen Asli RTRW").

Action: Deep Link wargaplus://module/{module_id}.

🗓️ BAB V: FITUR PENUNJANG (CMS FEATURES)

Untuk mendukung "Warga Portal" sebagai media yang serius, fitur ini wajib ada di Roadmap:

Rich Text Editor (WYSIWYG):

Jangan suruh kontributor nulis Markdown mentah. Gunakan library seperti Tiptap atau Quill di dashboard agar pengalaman menulis seperti di Medium/Google Docs.

Asset Manager:

Penulis bisa upload gambar ke Cloudinary langsung dari editor, lalu otomatis terpasang di artikel.

Versioning (Riwayat Edit):

(Opsional/Tahap Lanjut) Menyimpan revisi sebelumnya jika Redaktur mengubah tulisan Kontributor secara drastis.

Profile Page:

Halaman profil penulis yang menampilkan daftar artikel mereka (Portofolio Jurnalis Warga).

Disetujui Oleh:
Founder WargaPlus