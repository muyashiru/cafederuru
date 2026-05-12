# Supabase Storage Setup - Signatures

## Apa yang Berubah?

Sekarang tanda tangan disimpan sebagai **FILE GAMBAR (PNG)** di **Supabase Storage**, bukan lagi sebagai base64 string di database. 

Database hanya menyimpan **URL gambar**, bukan data base64 yang besar.

## Setup Storage Bucket

### 1. Buka Supabase Dashboard

1. Pergi ke https://app.supabase.com
2. Pilih project Anda
3. Klik **Storage** di sidebar kiri

### 2. Buat Bucket Baru

1. Klik tombol **"New bucket"**
2. Isi form:
   - **Name**: `signatures`
   - **Public bucket**: ✅ **CENTANG INI** (agar gambar bisa diakses publik)
3. Klik **"Create bucket"**

### 3. Setup Storage Policy (Opsional untuk Security)

Jika ingin restrict upload, buat policy:

```sql
-- Allow anyone to upload signatures (untuk public app)
CREATE POLICY "Anyone can upload signatures"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'signatures');

-- Allow anyone to view signatures
CREATE POLICY "Anyone can view signatures"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'signatures');
```

**ATAU** jika sudah centang "Public bucket", skip langkah ini karena sudah otomatis public.

### 4. Verifikasi Setup

Test upload dengan cara:
1. Jalankan aplikasi
2. Pergi ke Signature Page
3. Buat tanda tangan
4. Klik Submit
5. Cek di Supabase Dashboard → Storage → signatures
6. Harusnya ada file PNG baru dengan format: `[username]-[timestamp].png`

## Struktur File

```
signatures/
  ├── nasywa-1704614400000.png
  ├── nasywa-1704614500000.png
  └── john-1704614600000.png
```

## Format URL Gambar

Gambar akan punya URL publik seperti:
```
https://[project-id].supabase.co/storage/v1/object/public/signatures/nasywa-1704614400000.png
```

URL ini yang disimpan di database kolom `signature_image`.

## Keuntungan Sistem Baru

✅ **Lebih Efisien** - Database tidak menyimpan data base64 yang besar
✅ **Lebih Cepat** - Loading gambar lebih cepat dari CDN Supabase
✅ **Bisa Diakses Langsung** - URL bisa dibuka langsung di browser
✅ **Backup Mudah** - Bisa download semua gambar dari Storage
✅ **Professional** - Sesuai best practice web development

## Troubleshooting

### Error: "Bucket not found"
- Pastikan bucket bernama `signatures` sudah dibuat
- Cek spelling, harus persis `signatures` (lowercase, plural)

### Error: "Permission denied"
- Pastikan bucket di-set sebagai **Public**
- Atau setup Storage Policy sesuai panduan di atas

### Gambar tidak muncul
- Buka URL gambar langsung di browser
- Cek apakah URL valid
- Pastikan bucket public

## Migrasi Data Lama (Jika Ada)

Jika sudah ada data base64 di database, jalankan script ini untuk convert:

```javascript
// Script untuk convert base64 lama ke storage
// Jalankan di browser console atau Node.js

import { supabase } from './src/lib/supabase';
import { uploadSignatureImage } from './src/lib/rsvpService';

async function migrateSignatures() {
  const { data: oldData } = await supabase
    .from('rsvp_responses')
    .select('*')
    .like('signature_image', 'data:image%'); // Only base64
  
  for (const row of oldData) {
    const uploadResult = await uploadSignatureImage(row.signature_image, row.username);
    if (uploadResult.success) {
      await supabase
        .from('rsvp_responses')
        .update({ signature_image: uploadResult.url })
        .eq('id', row.id);
      console.log(`✅ Migrated ${row.username}`);
    }
  }
}
```

## Testing

Setelah setup selesai, test dengan:
1. Submit signature baru
2. Cek database: `signature_image` harusnya berisi URL, bukan base64
3. Buka URL di browser: gambar harusnya muncul
4. Cek Storage bucket: file PNG harusnya ada

---

**Note:** Jangan lupa tambahkan bucket `signatures` ke `.gitignore` jika backup storage secara lokal!
