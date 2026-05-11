# Migration Guide - Event Date Column

## Apa yang Ditambahkan?
Kolom baru `event_date` di tabel `rsvp_responses` untuk menyimpan target tanggal countdown yang bisa diubah dari UI.

## Cara Menjalankan Migration

### Opsi 1: Manual via Supabase Dashboard (Paling Mudah)

1. **Buka Supabase Dashboard**: https://app.supabase.com
2. **Pilih Project Anda**
3. **Klik "SQL Editor"** di sidebar kiri
4. **Klik "New Query"**
5. **Copy-paste SQL berikut**:

```sql
-- Add event_date column to rsvp_responses table
ALTER TABLE rsvp_responses 
ADD COLUMN IF NOT EXISTS event_date TIMESTAMP WITH TIME ZONE;

-- Add comment to explain the column
COMMENT ON COLUMN rsvp_responses.event_date IS 'Target date and time for the event countdown';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_rsvp_responses_event_date 
ON rsvp_responses(event_date);
```

6. **Klik "Run"** atau tekan `Ctrl+Enter`
7. ✅ **Selesai!** Kolom sudah ditambahkan

### Opsi 2: Via Supabase CLI (untuk Developer)

```bash
# 1. Install Supabase CLI jika belum
npm install -g supabase

# 2. Login ke Supabase
supabase login

# 3. Link project Anda
supabase link --project-ref YOUR_PROJECT_REF

# 4. Push migration
supabase db push
```

## Verifikasi Migration Berhasil

Setelah menjalankan migration, verifikasi dengan query ini di SQL Editor:

```sql
-- Cek apakah kolom event_date sudah ada
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'rsvp_responses' 
AND column_name = 'event_date';
```

Harusnya return 1 row dengan:
- `column_name`: event_date
- `data_type`: timestamp with time zone

## Update RLS Policy (Opsional)

Jika Anda menggunakan Row Level Security, pastikan user bisa update kolom `event_date`:

```sql
-- Update policy untuk allow update event_date
CREATE POLICY "Users can update their own event date"
ON rsvp_responses
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

## Cara Menggunakan Fitur Baru

Setelah migration selesai:

1. **Buka Details Page** di aplikasi
2. **Lihat section Countdown** di bagian atas
3. **Klik icon ✏️** di pojok kanan countdown
4. **Set tanggal dan waktu** yang diinginkan
5. **Klik "💾 Simpan Tanggal"**
6. **Countdown akan otomatis update!** 🎉

## Rollback (Jika Perlu)

Jika ingin rollback migration:

```sql
-- Hapus kolom event_date
ALTER TABLE rsvp_responses 
DROP COLUMN IF EXISTS event_date;

-- Hapus index
DROP INDEX IF EXISTS idx_rsvp_responses_event_date;
```

## Default Value

Jika user belum set tanggal, default value adalah: **14 April 2026 pukul 07:00**

Untuk mengubah default ini, edit di `DetailsPage.jsx`:
```javascript
const [eventDate, setEventDate] = useState("2026-04-14"); // Ubah tanggal default
const [eventTime, setEventTime] = useState("07:00"); // Ubah waktu default
```
