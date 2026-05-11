# 🗄️ SUPABASE SETUP GUIDE

## 📋 Checklist Setup

- [ ] Buat account Supabase
- [ ] Buat project baru
- [ ] Buat table `rsvp_responses`
- [ ] Copy API credentials
- [ ] Update file `.env`
- [ ] Test koneksi

---

## 🚀 STEP 1: Buat Account & Project

1. **Buka:** https://supabase.com
2. **Sign Up/Login** (pakai GitHub lebih cepat)
3. **Klik "New Project"**
4. **Isi form:**
   - Name: `cafederuru`
   - Database Password: **CATAT INI!** (akan dipakai nanti)
   - Region: Singapore (atau yang terdekat)
   - Plan: **Free**
5. **Klik "Create new project"**
6. **Tunggu ~2 menit** sampai project ready

---

## 🗄️ STEP 2: Buat Table

### ⚡ CARA TERCEPAT: Import SQL File (RECOMMENDED!)

1. **Buka file `supabase_schema.sql`** (ada di root project)
2. **Copy SELURUH isi file**
3. **Buka Supabase Dashboard**
4. **Klik "SQL Editor"** di sidebar
5. **Klik "New Query"**
6. **Paste SQL yang udah di-copy**
7. **Klik "Run"** (atau Ctrl/Cmd + Enter)
8. **Done!** ✅ Table otomatis terinstall lengkap dengan indexes & policies!

### Atau Manual: Via SQL Editor

1. **Klik "SQL Editor"** di sidebar
2. **Klik "New Query"**
3. **Copy-paste SQL ini:**

```sql
-- Create table rsvp_responses
CREATE TABLE rsvp_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  login_date DATE NOT NULL,
  response TEXT NOT NULL DEFAULT 'yes',
  signature_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add index for faster queries
CREATE INDEX idx_rsvp_username ON rsvp_responses(username);
CREATE INDEX idx_rsvp_created_at ON rsvp_responses(created_at DESC);

-- Enable Row Level Security (optional - can be enabled later)
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
CREATE POLICY "Allow all operations" ON rsvp_responses
FOR ALL
USING (true)
WITH CHECK (true);
```

4. **Klik "Run"** (atau tekan Ctrl/Cmd + Enter)
5. **Cek "Table Editor"** → Harusnya table `rsvp_responses` muncul! ✅

### Via Table Editor (Manual - Slower)

Kalau mau manual, ikuti struktur ini:

| Column | Type | Default | Primary | Nullable |
|--------|------|---------|---------|----------|
| `id` | uuid | `gen_random_uuid()` | ✅ | ❌ |
| `username` | text | - | ❌ | ❌ |
| `login_date` | date | - | ❌ | ❌ |
| `response` | text | `'yes'` | ❌ | ❌ |
| `signature_image` | text | - | ❌ | ✅ |
| `created_at` | timestamptz | `now()` | ❌ | ❌ |

---

## 🔑 STEP 3: Get API Credentials

1. **Klik "Project Settings"** (icon gear ⚙️ di sidebar bawah)
2. **Klik "API"**
3. **Copy 2 values ini:**

### Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```

### anon/public Key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```

⚠️ **JANGAN SHARE KEYS INI!**

---

## 🔐 STEP 4: Update `.env` File

1. **Buka file `.env`** di root project
2. **Replace dengan credentials kamu:**

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc...
```

3. **Save file**
4. **Restart dev server:**

```bash
npm run dev
```

---

## ✅ STEP 5: Test Koneksi

Buat file test sederhana untuk cek koneksi:

**Create: `src/testSupabase.js`**

```javascript
import { supabase } from './lib/supabase';

export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('rsvp_responses')
      .select('count');
    
    if (error) throw error;
    
    console.log('✅ Supabase connected successfully!');
    console.log('Table exists and accessible');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    return false;
  }
};
```

**Test di browser console:**
```javascript
import { testConnection } from './testSupabase';
testConnection();
```

Kalau muncul "✅ Supabase connected successfully!" → **SUCCESS!** 🎉

---

## 📝 STEP 6: Cara Pakai di Code

### Example: Save RSVP Data

```javascript
import { saveRSVP } from './lib/rsvpService';

// Di SignaturePage atau setelah user submit
const handleSaveRSVP = async () => {
  const result = await saveRSVP({
    username: 'Nasywa Cantik Anak Teknik',
    loginDate: new Date('2025-05-01'),
    signatureImage: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
  });

  if (result.success) {
    console.log('✅ Data saved!', result.data);
    // Navigate to next page
  } else {
    console.error('❌ Error:', result.error);
    // Show error message
  }
};
```

### Example: Check Existing RSVP

```javascript
import { checkExistingRSVP } from './lib/rsvpService';

const username = 'Nasywa Fauziyyah';
const result = await checkExistingRSVP(username);

if (result.exists) {
  alert('Kamu udah RSVP sebelumnya!');
}
```

---

## 🔍 STEP 7: View Data di Dashboard

1. **Klik "Table Editor"**
2. **Pilih table `rsvp_responses`**
3. **Liat semua data yang masuk!** 📊

You can:
- ✅ View all rows
- ✅ Edit manually
- ✅ Delete rows
- ✅ Export to CSV

---

## 🐛 Troubleshooting

### Error: "Missing Supabase environment variables"
- ✅ Pastikan file `.env` ada di root project
- ✅ Cek nama variable: `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`
- ✅ Restart dev server: `npm run dev`

### Error: "relation "rsvp_responses" does not exist"
- ✅ Pastikan table sudah dibuat di Supabase
- ✅ Cek typo di nama table
- ✅ Refresh Supabase dashboard

### Error: "Invalid API key"
- ✅ Copy ulang anon key dari dashboard
- ✅ Pastikan no extra spaces di `.env`
- ✅ Pastikan pakai **anon/public key**, bukan service_role key

### Error: "Row Level Security policy violation"
- ✅ Disable RLS: `ALTER TABLE rsvp_responses DISABLE ROW LEVEL SECURITY;`
- ✅ Atau buat policy yang allow all (lihat SQL di atas)

---

## 🎉 Done!

Sekarang kamu bisa:
- ✅ Save data ke Supabase
- ✅ Query data
- ✅ View di dashboard
- ✅ Ready untuk production!

**Next:** Implement di SignaturePage untuk save signature! 🚀
