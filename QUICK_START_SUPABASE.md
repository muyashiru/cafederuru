# ⚡ QUICK START - SUPABASE SETUP (5 MENIT!)

## 🚀 Setup Super Cepat

### 1️⃣ Buat Project Supabase (2 menit)
1. Buka: https://supabase.com
2. Login/Sign up
3. Klik "New Project"
4. Isi:
   - Name: `cafederuru`
   - Password: (catat ini!)
   - Region: Singapore
5. Wait ~2 minutes

### 2️⃣ Import Database (30 detik!)
1. **Buka file:** `supabase_schema.sql`
2. **Copy semua** (Ctrl+A, Ctrl+C)
3. **Di Supabase:** Klik "SQL Editor"
4. **Klik "New Query"**
5. **Paste** (Ctrl+V)
6. **Klik "Run"** ✅

### 3️⃣ Get API Keys (1 menit)
1. Klik "Project Settings" (⚙️)
2. Klik "API"
3. Copy:
   - **URL:** `https://xxxxx.supabase.co`
   - **anon key:** `eyJhbG...`

### 4️⃣ Update .env (30 detik)
Buka `.env` file, ganti dengan:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

### 5️⃣ Restart Server (30 detik)
```bash
npm run dev
```

## ✅ DONE! 

Sekarang:
- ✅ Database ready
- ✅ Table created dengan indexes
- ✅ Security policies configured
- ✅ Ready to save data!

---

## 🧪 Test Connection

Buka browser console dan test:
```javascript
// Test 1: Check table exists
const { data } = await fetch('/api/test').then(r => r.json());
console.log(data); // Should show empty array or existing data

// Test 2: Try insert (akan diimplementasi di SignaturePage)
```

---

## 📊 View Data

Di Supabase Dashboard:
1. Klik "Table Editor"
2. Select "rsvp_responses"
3. See all data! 🎉

---

## ❓ Troubleshooting

**Error: "Missing Supabase environment variables"**
→ Restart server: `npm run dev`

**Error: "Invalid API key"**
→ Copy ulang dari dashboard, pastikan no spaces

**Table ga keliatan?**
→ Refresh Supabase dashboard

---

**Full documentation:** Lihat `SUPABASE_SETUP.md`
