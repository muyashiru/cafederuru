# 🎉 DETAILS PAGE - Complete Guide

## 📋 Overview

DetailsPage adalah halaman final yang menampilkan semua informasi lengkap tentang acara di **Cafe de RURU**. Halaman ini dilengkapi dengan:

✅ **Countdown Timer** - Real-time countdown sampai hari H
✅ **Benefits Section** - List lengkap keuntungan datang ke cafe
✅ **Editable Rundown** - Timeline acara yang bisa diedit
✅ **Dress Code Selector** - Pilihan warna outfit
✅ **Interactive Checklist** - Checklist barang yang perlu dibawa
✅ **Tujuan Acara** - Story & goals dari acara
✅ **Google Maps** - Location embed Cafe de RURU
✅ **Quote & Closing** - Personal message
✅ **Instagram Button** - Link ke Instagram @atmiwwa

---

## 🗄️ Database Schema Updates

### New Columns Added:

| Column | Type | Description |
|--------|------|-------------|
| `dress_code` | TEXT | Selected dress code color (white/green/pink/brown/black/surprise) |
| `custom_rundown` | JSONB | Customized rundown array in JSON format |

### How to Update Existing Database:

#### Option 1: Fresh Install
If you're setting up the database for the first time, just use the main schema file:
```bash
# In Supabase SQL Editor, run:
supabase_schema.sql
```

#### Option 2: Migration (Existing Database)
If you already have the `rsvp_responses` table, run the migration:
```bash
# In Supabase SQL Editor, run:
database_migration_details_page.sql
```

This will:
- Add `dress_code` column
- Add `custom_rundown` column
- Enable UPDATE policy for RLS

---

## 🎨 Features Breakdown

### 1. **Countdown Timer** ⏱️

**Hardcoded Target Date:**
```javascript
const TARGET_DATE = new Date("2025-05-08T07:00:00");
```

**How to Change:**
Edit line 112 in `DetailsPage.jsx` to your target date & time.

**Features:**
- Real-time countdown (updates every second)
- Shows: Days, Hours, Minutes, Seconds
- Animated seconds counter (pulse effect)

---

### 2. **Benefits Section** 🎁

**Categories:**
- Study & Productivity
- Food & Drink
- Tech Support
- Experience & Fun
- Extras

**Display:**
- Grid layout (2 columns)
- Icon + text for each benefit
- Hover animation (scale & rotate)

**Edit Benefits:**
Modify `BENEFITS` array in `DetailsPage.jsx` (lines 23-67)

---

### 3. **Editable Rundown** ⏰

**Default Rundown:**
```
07:00 - 🚗 Jemput di tempat
07:40 - ☕ Arrive at Cafe de RURU
08:00 - 📚 Nugas Session 1 + Deep talk(Focus Time)
11:30 - 📸 Photo Session & Break
12:00 - 🕌 Shalat Dzuhur
12:30 - 🍽️ Lunch Break
13:00 - 💻 Nuggas Session 2 + Optional Games
15:00 - 🕌 Shalat Ashar
15:30 - 🏠 Pulang (safe trip!)
```

**Features:**
- Click ✏️ icon to edit any item
- Press Enter or click outside to save
- Click "💾 Save Changes" to save to database
- Loads saved rundown from Supabase on page load

**How It Works:**
1. User clicks edit icon (✏️)
2. Input field appears
3. User types new activity
4. Press Enter or blur to save locally
5. Click "Save Changes" to persist to database

**Database Storage:**
Saved as JSONB array:
```json
[
  { "time": "07:00", "activity": "🚗 Jemput di tempat", "editable": true },
  ...
]
```

---

### 4. **Dress Code Selector** 👗

**Options:**
- 🤍 White (Clean & Fresh)
- 💚 Green (Matching Matcha)
- 🩷 Pink (Soft & Feminine)
- 🤎 Brown/Beige (Earthy)
- 🖤 Black (Classic & Chic)
- 🌈 Surprise Me!

**Features:**
- Single selection
- Auto-saves to database on selection
- Loads saved selection on page load
- Visual feedback (selected state)

**Database Storage:**
Saved as TEXT value: `"white"`, `"green"`, etc.

---

### 5. **Interactive Checklist** ✅

**Categories:**

**Wajib Dibawa:**
- 💻 Laptop
- 📱 HP
- 💧 Air Minum
- 📓 Notes
- 😊 Good Mood & Smile
- 🔌 Charger Laptop & HP

**Optional:**
- ☔ Jas Hujan
- 💄 Make up Touch Up
- 🎧 TWS
- 📷 Kamera
- 💰 Uang Parkir

**Features:**
- Interactive checkboxes
- Checked state stored in local state (not database)
- Hover animation (slide effect)

**Note:** Checklist state is NOT saved to database (intentional - fresh each time)

---

### 6. **Tujuan Acara** 🎯

**Sections:**

**Kenapa Acara Ini Diadakan?**
Personal story tentang bagaimana ide ini muncul (tiduran di masjid setelah dzuhur).

**Apa yang Mau Dicapai?**
- ✅ Progress Tugas
- 💚 Quality Time
- 📸 Create Memories
- ☕ Matcha Experience

---

### 7. **Google Maps Embed** 📍

**Location:** Cafe de RURU

**Features:**
- Embedded Google Maps iframe
- Tap to open in Google Maps app
- Responsive design

**How to Change Location:**
1. Go to Google Maps
2. Search for your location
3. Click "Share" → "Embed a map"
4. Copy the iframe URL
5. Replace the `src` in line 543 of `DetailsPage.jsx`

---

### 8. **Quote & Closing** 💝

**Current Quote:**
> "Life is like a cup of matcha – a little bitter, a little sweet,
> but always better when shared with the right person."

**Features:**
- Gradient background (matcha colors)
- Elegant typography (Lora font)
- Heart emoji decoration

**How to Change:**
Edit lines 557-559 in `DetailsPage.jsx`

---

### 9. **Instagram Button** 📸

**Link:** `https://instagram.com/atmiwwa`

**Features:**
- Opens in new tab
- Instagram gradient colors
- Call-to-action text

**How to Change Username:**
Edit line 222 in `DetailsPage.jsx`:
```javascript
window.open("https://instagram.com/YOUR_USERNAME", "_blank");
```

---

## 🎨 Styling & Animations

### Color Palette
- Background: Gradient from cream → beige → matcha-light
- Cards: White with backdrop blur
- Borders: matcha-light (soft green)
- Accents: matcha-primary (#88B04B)

### Animations
- **Floating Elements:** 🍵 🌿 ✨ 💚 (falling animation)
- **Entry Animations:** Staggered fade-in with slide up
- **Hover Effects:** Scale, rotate, slide
- **Countdown:** Pulse effect on seconds counter

### Fonts
- **Headers:** Lora (serif, elegant)
- **Body:** Inter (sans-serif, clean)
- **Accent:** Outfit (geometric)

---

## 🔌 API Functions Used

### From `rsvpService.js`:

#### 1. `getRSVPByUsername(username)`
```javascript
// Load saved data on page mount
const result = await getRSVPByUsername(username);
if (result.success && result.data) {
  setSelectedDressCode(result.data.dress_code);
  setRundown(result.data.custom_rundown);
}
```

#### 2. `updateDressCode(username, dressCode)`
```javascript
// Save dress code selection
const result = await updateDressCode(username, "green");
```

#### 3. `updateCustomRundown(username, customRundown)`
```javascript
// Save edited rundown
const result = await updateCustomRundown(username, rundownArray);
```

---

## 🛠️ Customization Guide

### Change Countdown Target Date
```javascript
// Line 112 in DetailsPage.jsx
const TARGET_DATE = new Date("2025-05-08T07:00:00");
```

### Add/Remove Benefits
```javascript
// Lines 23-67 in DetailsPage.jsx
const BENEFITS = [
  {
    category: "Your Category",
    items: [
      { icon: "🎯", text: "Your Benefit" },
    ],
  },
];
```

### Modify Rundown
```javascript
// Lines 11-21 in DetailsPage.jsx
const DEFAULT_RUNDOWN = [
  { time: "07:00", activity: "Your Activity", editable: true },
];
```

### Change Instagram Username
```javascript
// Line 222 in DetailsPage.jsx
window.open("https://instagram.com/YOUR_USERNAME", "_blank");
```

### Update Google Maps Location
```javascript
// Line 543 in DetailsPage.jsx
<iframe src="YOUR_GOOGLE_MAPS_EMBED_URL" />
```

---

## 🐛 Troubleshooting

### "Username not found, redirecting to login"
**Cause:** Username not saved in localStorage
**Fix:** Make sure SignaturePage saves username:
```javascript
localStorage.setItem("username", username);
```

### Dress code not saving
**Cause:** UPDATE policy not enabled in Supabase
**Fix:** Run `database_migration_details_page.sql` in Supabase SQL Editor

### Rundown not persisting
**Cause:** Same as above - UPDATE policy issue
**Fix:** Run the migration SQL

### Maps not loading
**Cause:** Invalid embed URL or CORS issue
**Fix:** 
1. Get fresh embed URL from Google Maps
2. Make sure iframe `src` is properly formatted

### Floating elements not showing
**Cause:** z-index issue or overflow hidden
**Fix:** Check parent container doesn't have `overflow: hidden`

---

## 📊 State Management

### Local State (React useState)
```javascript
const [countdown, setCountdown] = useState({});      // Timer state
const [rundown, setRundown] = useState([]);          // Rundown array
const [checklist, setChecklist] = useState({});      // Checklist state
const [selectedDressCode, setSelectedDressCode] = useState(""); // Selected color
const [username, setUsername] = useState("");        // Current user
```

### Persistent Storage
- **localStorage:** username (for session continuity)
- **Supabase:** dress_code, custom_rundown (for persistence across devices)

---

## 🎯 User Flow

```
1. User completes SignaturePage
   ↓
2. Username saved to localStorage
   ↓
3. Navigate to DetailsPage
   ↓
4. Load username from localStorage
   ↓
5. Fetch saved data from Supabase (dress_code, custom_rundown)
   ↓
6. Display all details with saved preferences
   ↓
7. User interacts (edit rundown, select dress code, check items)
   ↓
8. Changes auto-save to Supabase
   ↓
9. Click Instagram button → Open Instagram
```

---

## 📱 Mobile Optimization

- Responsive grid layouts (2 columns for benefits)
- Touch-friendly buttons (44x44px minimum)
- Scroll-friendly long page
- No horizontal scroll
- Optimized for mobile viewport (320px - 480px)

---

## ✅ Testing Checklist

Before deployment, test these scenarios:

- [ ] Countdown shows correct time
- [ ] All benefits display correctly
- [ ] Rundown can be edited
- [ ] Rundown "Save Changes" works
- [ ] Dress code selection saves
- [ ] Dress code loads on page refresh
- [ ] Checklist checkboxes work
- [ ] Google Maps loads
- [ ] Instagram button opens correct profile
- [ ] Floating animations work
- [ ] Mobile responsive (test on real device)
- [ ] No console errors
- [ ] Database updates reflect in Supabase dashboard

---

## 🚀 Performance Tips

1. **Lazy Load Maps:** Consider lazy loading the iframe
2. **Optimize Animations:** Reduce floating elements on low-end devices
3. **Debounce Rundown Saves:** Add debounce to prevent rapid API calls
4. **Image Optimization:** If adding images, use WebP format

---

## 📝 Future Enhancements (Ideas)

- [ ] Add confetti animation on page load
- [ ] Photo upload feature
- [ ] Weather widget for the date
- [ ] Spotify playlist embed
- [ ] Share to social media button
- [ ] Print/Export PDF feature
- [ ] Admin dashboard to view all responses
- [ ] Email notification on dress code selection

---

## 💚 Credits

**Built with love using:**
- React 19
- Framer Motion
- Tailwind CSS
- Supabase

**Quote Source:** Original

**Design Inspiration:** Matcha aesthetic ☕💚

---

**Made with 💚 and lots of coffee**

*Last Updated: January 2025*
