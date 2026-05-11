# SUKMA - Surat Undangan Kafe Matcha

**Proyek: Website Undangan Kencan untuk Nasywa**  
*Catatan untuk AI Agent: Baca file ini dengan saksama. File ini berisi konteks emosional, latar belakang, dan spesifikasi teknis lengkap proyek.*

---

## 🎯 BAGIAN 1: KONTEKS & LATAR BELAKANG

### 1. Kondisi Kerja & Mental (Burnout)
Gw saat ini lagi magang sebagai Web Developer. Kondisinya lagi lumayan *chaos* karena terjadi *scope creep*. Proyek yang tadinya udah beres 90%, ditabrak sama tambahan fitur terus-menerus dari kantor sampai mundur jadi 70%. Pikiran, waktu, dan tenaga gw habis, belum lagi laporan magang yang harus segera dipikirin.

### 2. Blunder & Krisis Hubungan
Di tengah *burnout* itu, gw bikin kesalahan ke pacar gw, Nasywa. Belakangan ini gw emang jarang ada waktu buat dia, tapi sekalinya ada waktu luang, gw malah impulsif ikut temen main dadakan ke Jakarta. Akhirnya kita berantem besar, dan jujur gw sekarang ngerasa *hopeless* banget.

### 3. The All-Out Effort
Walaupun *hopeless*, gw nggak mau nyerah sebelum bener-bener disuruh berhenti. Nasywa pernah bilang dia pengen diajak ngedate yang *well-prepared*, ada *rundown*-nya, konsepnya formal tapi lucu. Dari situ gw mutusin buat bikin **Website Undangan Kencan** ini. 

**Prinsip gw:** Gw bakal *all out* ngerjain ini di sela-sela kepala gw yang mau pecah. Kalaupun ini harus berakhir, setidaknya gw nggak punya penyesalan karena udah ngusahain sampai titik darah penghabisan.

---

## 📋 BAGIAN 2: SPESIFIKASI PROYEK LENGKAP

### 🎨 Konsep Utama
**SUKMA (Surat Undangan Kafe Matcha)** - Website undangan kencan ke **Cafe de RURU** dengan tema **formal tapi lucu/cute**, penuh dengan animasi dan interaksi yang memorable.

**Lokasi Acara:** [Cafe de RURU (Matcha Cafe)](https://maps.app.goo.gl/La7QJZf8bCKbKuMi9)

---

### 📱 PENTING: Mobile-Only Website
Website ini **HANYA bisa dibuka di mobile device**. Jika dibuka di desktop/tablet, tampilkan pesan "Please open this on mobile device" atau redirect/block akses.

---

### 🎭 FITUR 1: Halaman Utama SUKMA (Main Invitation Page)

**Loading Transition (First Load):**
- Animasi **Kura-kura Sulcata** berjalan dari **kanan ke kiri** sebagai loading indicator
- Durasi: 2-3 detik

**Konten dengan Animasi:**
- Teks muncul dengan animasi (fade in, slide up, typewriter effect, dll)
- Aset-aset lucu dan cute (ilustrasi, icon, emoji)
- Background yang aesthetic

**Isi Konten:**
```
SUKMA
(Surat Undangan Kafe Matcha)

[Animasi teks personal dan romantis di sini]

Will you attend this special date to Cafe de RURU?

[Button: "Yes, Give Me The Details! ✨"]
[Button: "No, Thank You 💔"]
```

**Interaksi Button:**
- **Button "No, Thank You"**: Ketika cursor mendekati/hover, button kabur/pindah tempat (chase interaction)
- **Button "Yes, Give Me The Details!"**: Tetap di tempat, klik untuk lanjut ke **Halaman Login**

---

### 🔐 FITUR 2: Halaman Login (Authentication Page)

**Tampilan:**
- Header dengan judul "SUKMA"
- Subtitle: "Surat Undangan Kafe Matcha"
- Form login yang cute

**Form Fields:**

1. **Username Field (Dropdown)**
   - Label: "Siapa nama kamu?" atau sejenisnya yang lucu
   - Pilihan dropdown:
     - "Nasywa Cantik Anak Teknik"
     - "Nasywa Fauziyyah"
     - "Dr. Nasywa, S.Pd"
     - "Nasywa Tercantik Sedunia"
     - "Calon Ibu Rumah Tangga Idaman"
   - **Semua jawaban adalah BENAR** (tidak ada validasi salah)

2. **Password Field (Date Picker/Calendar)**
   - Label: "Kapan terakhir kali kita ketemu?"
   - Input type: Kalender/Date Picker
   - Password yang benar: Tanggal terakhir kalian ketemu (set di config/env)

**Behavior:**
- Jika password benar → Login success, lanjut ke **Halaman Tanda Tangan** dengan animasi transisi
- Jika password salah → Shake animation + pesan error lucu (misal: "Hmm... coba inget-inget lagi deh 🤔")

---

### ✍️ FITUR 3: Canvas Tanda Tangan (Signature Confirmation)

**Tampilan:**
- Setelah klik "Yes, Give Me The Details!"
- Muncul canvas untuk tanda tangan digital
- Instruksi: "Tanda tangani di sini untuk konfirmasi kehadiran kamu ya! 💕"

**Features:**
- Canvas area untuk drawing signature
- Button "Clear" untuk hapus tanda tangan
- Button "Submit" untuk konfirmasi
- Simpan signature sebagai image (base64/blob)

**Data yang Disimpan ke Supabase:**
- Username yang dipilih
- Tanggal login
- Timestamp confirmation
- Signature image (base64/URL)

---

### 📅 FITUR 4: Halaman Detail Acara (Event Details Page)

**Setelah tanda tangan di-submit, tampilkan:**

#### 1. **Rundown Acara**
Format table/timeline yang cute:
```
🕐 13:00 - Penjemputan di rumah
🚗 13:30 - Perjalanan sambil ngobrol santai
☕ 14:00 - Tiba di Cafe de RURU
🍰 14:15 - Order matcha & snacks
💬 14:30 - Nuggas bareng & sharing session
📸 16:00 - Foto-foto aesthetic
🏠 16:30 - Pulang dengan kenangan manis
```

#### 2. **Tujuan Acara**
- 🍵 Nyobain menu matcha di Cafe de RURU
- 📚 Nuggas bareng (bring your work/study materials)
- 💭 Sharing tentang segala hal (cerita, keluh kesah, rencana masa depan)
- 🤝 Quality time untuk reconnect
- 💕 Bikin kenangan baru yang indah

#### 3. **Benefit Kehadiran**
List lucu benefit kalau datang:
- ✅ Gratis matcha latte & snacks (ditraktir!)
- ✅ Dapet temen ngobrol yang baik (katanya)
- ✅ Suasana cafe aesthetic buat foto IG
- ✅ Moment quality time yang udah lama ditunggu
- ✅ Bonus: Bisa liat orang yang udah usaha keras bikin website ini 👀

#### 4. **Apa yang Harus Dibawa?**
Checklist cute:
- [ ] Diri kamu sendiri (yang paling penting!)
- [ ] Mood yang baik ✨
- [ ] Laptop/buku kalau mau nuggas
- [ ] Charger (biar aman)
- [ ] Senyuman termanis kamu 😊

#### 5. **Lokasi Acara (Google Maps)**
- Embed Google Maps atau button link ke:
  - **Cafe de RURU**
  - Link: https://maps.app.goo.gl/La7QJZf8bCKbKuMi9
- Button: "Lihat Lokasi di Google Maps"

#### 6. **Footer/Closing**
Pesan personal dan manis:
```
"Terima kasih udah mau baca sampai sini.
Ini adalah usaha terbaik ku untuk bikin kamu tersenyum lagi.
Aku tau aku salah, dan aku pengen benerin semuanya.

Ditunggu ya, Nasywa 💕

With love,
[Nama kamu]"
```

---

## 🛠️ BAGIAN 3: TECH STACK (FIXED)

**Framework & Library:**
- ⚛️ React.js 18+ (dengan Vite)
- 📱 JavaScript (ES6+)
- 🎨 CSS/Tailwind CSS untuk styling
- 🎭 Framer Motion / React Spring untuk animasi

**Database:**
- 🗄️ Supabase (untuk simpan data RSVP dan signature)

**Deployment:**
- ☁️ Vercel (Serverless)

**Additional Libraries:**
- React Router (untuk routing multi-page)
- React Signature Canvas (untuk fitur tanda tangan)
- React DatePicker (untuk input tanggal)
- React Confetti (optional, untuk effect celebration)

---

## 📊 STRUKTUR DATABASE (SUPABASE)

**Table: `rsvp_responses`**
```sql
- id (uuid, primary key)
- username (text) - pilihan dropdown yang dipilih
- login_date (date) - tanggal yang diinput di password
- response (text) - "yes" atau "no" (otomatis "yes" karena yang "no" kabur)
- signature_image (text) - base64 atau URL signature
- timestamp (timestamp) - waktu submit
- created_at (timestamp)
```

---

## ⏰ BAGIAN 4: TIMELINE & DEADLINE

**DEADLINE: RABU MALAM**
Website harus sudah:
- ✅ Selesai di-develop
- ✅ Terintegrasi dengan Supabase
- ✅ Di-deploy ke Vercel
- ✅ Link siap dikirim ke Nasywa

**Prioritas Development:**
1. Setup project & routing (30 menit)
2. **Halaman 1:** Halaman Utama SUKMA - Invitation (1-2 jam)
3. **Halaman 2:** Halaman Login (1-2 jam)
4. **Halaman 3:** Canvas Tanda Tangan + Supabase Integration (2-3 jam)
5. **Halaman 4:** Halaman Detail Acara (2-3 jam)
6. Animasi & Polish (1-2 jam)
7. Testing & Deployment (1 jam)

---

## 🎨 BAGIAN 5: DESIGN DIRECTION

**Color Palette Suggestion:**
- Primary: Matcha Green (#88B04B, #A8D08D)
- Secondary: Cream/Beige (#F5F5DC, #FFF8DC)
- Accent: Soft Pink (#FFB6C1) atau Peach (#FFDAB9)
- Text: Dark Brown (#4A4A4A) atau Charcoal (#333333)

**Typography:**
- Heading: Font yang cute tapi readable (Poppins, Quicksand, Nunito)
- Body: Font yang clean (Inter, DM Sans, Open Sans)

**Vibe:**
- Formal tapi approachable
- Professional tapi personal
- Cute tapi nggak kekanak-kanakan
- Romantic tapi nggak cheesy

---

## 📝 BAGIAN 6: INSTRUKSI KHUSUS UNTUK AI AGENT

1. **Waktu sangat mepet.** Berikan solusi yang **efisien dan straight to the point**.

2. **Tech stack FIXED.** Jangan sarankan ganti React, Vite, Supabase, atau Vercel.

3. **Belum familiar dengan Supabase.** Pandu dengan instruksi **step-by-step** yang paling basic (cara setup tabel, API keys, koneksi di React).

4. **Jadilah partner problem-solving.** Kalau bingung soal logic UI, animasi, atau integrasi DB, kasih **kode yang langsung bisa jalan** (copy-paste ready).

5. **Mobile-first approach.** Semua development fokus untuk mobile screen, block/redirect desktop users.

6. **Animasi adalah prioritas.** Website ini harus feel special dan memorable, jadi animasi smooth itu penting.

7. **Emotional context matters.** Ini bukan cuma technical project, ini usaha terakhir buat seseorang yang penting. Bantu gw bikin ini se-special mungkin.

---

## 🚀 NEXT STEPS & USER FLOW

**User Flow:**
```
1. Landing → Halaman SUKMA (Invitation)
   ↓ (Click "Yes, Give Me The Details!")
2. Halaman Login (Username + Date Password)
   ↓ (Login Success)
3. Halaman Tanda Tangan (Signature Canvas)
   ↓ (Submit Signature)
4. Halaman Detail Acara (Rundown, Maps, etc.)
```

**Development Steps:**
1. ✅ Setup project structure
2. ✅ Setup Supabase (create table, get API keys)
3. ✅ Develop halaman per halaman sesuai prioritas
4. ✅ Integration testing
5. ✅ Deploy ke Vercel
6. ✅ Final testing di mobile device
7. ✅ Kirim link ke Nasywa 💕

---

**Let's make this happen! 💪✨**
