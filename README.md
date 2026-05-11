# SUKMA - Surat Undangan Kafe Matcha ☕💚

**Website Undangan Kencan untuk Nasywa**  
*A special invitation website with love and effort* 💕

---

## 📊 PROJECT STATUS

### ✅ Completed (90%)
- [x] Project initialization (React + Vite)
- [x] Tailwind CSS setup & configuration
- [x] Custom theme (Matcha Green aesthetic)
- [x] Loading animation (Suika the turtle 🐢)
- [x] Invitation page (with real-time counter)
- [x] Login page (username dropdown + date picker)
- [x] Goodbye page (rejection page)
- [x] Mobile-only guard
- [x] Supabase database setup
- [x] Database schema & helper functions
- [x] Environment variables configuration
- [x] Signature page (canvas for digital signature)
- [x] Details page (rundown, maps, benefits, countdown, dress code, checklist)

### 🚧 In Progress (10%)
- [ ] Final polish & testing
- [ ] Deployment to Vercel

---

## 🎯 PROJECT OVERVIEW

**SUKMA** adalah website undangan kencan ke **Cafe de RURU** dengan tema matcha yang aesthetic dan interaktif.

**Tujuan:**
- Mengajak Nasywa ke study date di Cafe de RURU
- Menampilkan effort & sincerity melalui website yang well-designed
- Menyimpan RSVP dan signature ke database

**Target Deadline:** Rabu Malam

---

## 🛠️ TECH STACK

### Frontend
- **React 19.2.6** - UI library
- **Vite 8.0.12** - Build tool & dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router DOM** - Client-side routing
- **React DatePicker** - Date input component

### Backend & Database
- **Supabase** - PostgreSQL database (BaaS)
- **@supabase/supabase-js** - Supabase client

### Deployment
- **Vercel** - Hosting & deployment (planned)

### Fonts
- **Lora** - Elegant serif (headings)
- **Inter** - Modern sans-serif (body)
- **Outfit** - Geometric sans (accent)

---

## 🎨 DESIGN SYSTEM

### Color Palette (Matcha Theme)
```css
/* Primary Colors */
--matcha-primary: #88B04B  /* Main matcha green */
--matcha-light: #A8D08D    /* Light matcha */
--matcha-dark: #6B8E3D     /* Dark matcha */

/* Neutral Colors */
--cream: #F5F5DC           /* Cream background */
--beige: #FFF8DC           /* Beige accent */

/* Accent Colors */
--soft-pink: #FFB6C1       /* Soft pink */
--peach: #FFDAB9           /* Peach */
```

### Typography
- **Headings:** Lora (serif, elegant)
- **Body:** Inter (sans-serif, clean)
- **Accent:** Outfit (geometric, modern)

---

## 📁 PROJECT STRUCTURE

```
cafederuru/
├── public/                      # Static assets
├── src/
│   ├── assets/                  # Images, icons
│   │   └── images/
│   ├── components/              # Reusable components
│   │   ├── MobileOnly.jsx       # Mobile-only guard
│   │   ├── TurtleLoader.jsx     # Loading animation (Suika 🐢)
│   │   └── SupabaseTest.jsx     # Test component (dev only)
│   ├── pages/                   # Page components
│   │   ├── InvitationPage.jsx   # Landing page (pertanyaan)
│   │   ├── LoginPage.jsx        # Login/verification page
│   │   ├── LoginPage.css        # DatePicker custom styles
│   │   ├── SignaturePage.jsx    # Signature canvas page
│   │   ├── GoodbyePage.jsx      # Rejection page
│   │   └── DetailsPage.jsx      # Final details page (NEW!)
│   ├── lib/                     # Utilities & services
│   │   ├── supabase.js          # Supabase client config
│   │   └── rsvpService.js       # Database helper functions
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles (Tailwind)
├── .env                         # Environment variables (GITIGNORED!)
├── .gitignore                   # Git ignore rules
├── supabase_schema.sql          # Database schema (import to Supabase)
├── SUPABASE_SETUP.md           # Full Supabase setup guide
├── QUICK_START_SUPABASE.md     # Quick setup guide (5 min)
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── vite.config.js               # Vite configuration
├── package.json                 # Dependencies
└── README.md                    # This file
```

---

## 🚀 GETTING STARTED

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier OK)

### 1. Clone & Install Dependencies
```bash
cd cafederuru
npm install
```

### 2. Setup Environment Variables
Create `.env` file in root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Get credentials from:** Supabase Dashboard → Project Settings → API

### 3. Setup Supabase Database
See detailed guide: **`QUICK_START_SUPABASE.md`** (5 minutes setup)

**Quick steps:**
1. Create Supabase project
2. Copy contents of `supabase_schema.sql`
3. Paste in Supabase SQL Editor
4. Run query ✅

### 4. Run Development Server
```bash
npm run dev
```

Open browser: **http://localhost:5174/**

---

## 🎯 FEATURES

### ✅ Completed Features

#### 1. Loading Animation (Suika)
- Cute turtle animation walking from right to left
- Text: "Loading, Suika mau lewat dulu... 🐢"
- Smooth transitions with Framer Motion

#### 2. Mobile-Only Guard
- Detects device type & screen size
- Blocks desktop users with friendly message
- Responsive design optimized for mobile

#### 3. Invitation Page
- **Real-time counter:** Minutes & seconds since last meeting
- Updates every second (1 Mei 2025, 8 PM baseline)
- Personal message to Nasywa
- Two buttons:
  - "Yes, Give Me The Details!" → Shows loading, goes to login
  - "No, Thank You" → Goes to goodbye page
- Smooth animations & floating decorations

#### 4. Login Page
- **Username dropdown:** 5 cute options (all correct!)
  - Nasywa Cantik Anak Teknik
  - Nasywa Fauziyyah
  - Dr. Nasywa Fauziyyah, S.Pd., M.Ars
  - Nasywa Tercantik Sedunia
  - Calon Ibu Rumah Tangga Idaman
- **Date picker:** Calendar input for last meeting date
- **Validation:** Checks correct date (1 Mei 2025)
- **Error handling:** Shake animation + cute error messages
- Proceeds to signature page on success

#### 5. Goodbye Page
- Simple rejection page
- Grayscale theme with broken heart 💔
- Bounce animation

#### 6. Database Integration
- **Supabase PostgreSQL** setup
- Table: `rsvp_responses` with indexes
- Helper functions ready:
  - `saveRSVP()` - Save response to database
  - `getAllRSVPs()` - Get all responses
  - `checkExistingRSVP()` - Check duplicates
- Security policies configured (RLS)

### 🚧 Planned Features

#### 7. Signature Page ✅
- Canvas for digital signature
- Clear & Submit buttons
- Save signature (base64) + data to Supabase
- Loading state during save
- Auto-navigate to Details Page

#### 8. Details Page ✅
- **Countdown Timer** - Real-time countdown to date
- **Benefits Section** - 20+ benefits across 5 categories
- **Editable Rundown** - Interactive timeline with edit & save
- **Dress Code Selector** - 6 color options with auto-save
- **Interactive Checklist** - Wajib & Optional items
- **Tujuan Acara** - Story + goals
- **Google Maps Embed** - Cafe de RURU location
- **Personal Quote** - Matcha-themed closing message
- **Instagram Button** - Link to @atmiwwa
- **Floating Animations** - Matcha elements (🍵🌿✨💚)
- **All data saves to Supabase** (dress_code, custom_rundown)

---

## 🗄️ DATABASE SCHEMA

### Table: `rsvp_responses`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `username` | TEXT | Selected username from dropdown |
| `login_date` | DATE | Date when they last met |
| `response` | TEXT | Response status (default: 'yes') |
| `signature_image` | TEXT | Base64 signature image (nullable) |
| `dress_code` | TEXT | Selected dress code color (nullable) |
| `custom_rundown` | JSONB | Customized rundown array (nullable) |
| `created_at` | TIMESTAMPTZ | Timestamp (auto-generated) |

**Indexes:**
- `idx_rsvp_username` - Username lookup
- `idx_rsvp_created_at` - Sort by date
- `idx_rsvp_username_date` - Composite (duplicate check)

---

## 🔧 DEVELOPMENT COMMANDS

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🌐 DEPLOYMENT (Planned - Vercel)

### Prerequisites
- Vercel account
- GitHub repository (optional but recommended)

### Steps
1. Connect project to Vercel
2. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy!

**Vercel auto-deploys on git push (if connected to GitHub)**

---

## 📚 DOCUMENTATION

### Setup Guides
- **`QUICK_START_SUPABASE.md`** - 5-minute Supabase setup
- **`SUPABASE_SETUP.md`** - Detailed setup guide with troubleshooting
- **`supabase_schema.sql`** - Complete database schema (ready to import)
- **`database_migration_details_page.sql`** - Migration for existing databases
- **`DETAILS_PAGE_GUIDE.md`** - Complete Details Page documentation

### Code Documentation
- JSDoc comments in `rsvpService.js`
- Inline comments in complex logic
- Component-level documentation

---

## 🔐 SECURITY NOTES

### Environment Variables
- ✅ `.env` file is gitignored
- ✅ Never commit API keys to repository
- ✅ Use `VITE_` prefix for Vite environment variables
- ✅ Anon key is safe for client-side (RLS protects data)

### Database Security
- ✅ Row Level Security (RLS) enabled
- ✅ Policies configured for public access (development)
- ⚠️ Consider tightening policies for production

---

## 🐛 TROUBLESHOOTING

### Common Issues

**1. "Missing Supabase environment variables"**
- Check `.env` file exists in root directory
- Verify variable names: `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`
- Restart dev server: `npm run dev`

**2. Database connection fails**
- Verify credentials in `.env`
- Check Supabase project is active
- Import `supabase_schema.sql` if table missing

**3. DatePicker not styled correctly**
- `LoginPage.css` contains custom DatePicker styles
- Check file is imported in `LoginPage.jsx`

**4. Tailwind classes not working**
- Run `npm install` to ensure Tailwind is installed
- Check `tailwind.config.js` content paths
- Restart dev server

---

## 📊 PROJECT METRICS

- **Total Components:** 8
- **Total Pages:** 6 (All completed! 🎉)
- **Lines of Code:** ~4,000+
- **Dependencies:** 15 packages
- **Development Time:** ~12 hours
- **Completion:** 90%

---

## 🎯 TODO / NEXT STEPS

### Before Deployment (Critical)
- [ ] Update Supabase with migration SQL
- [ ] Set correct countdown target date in DetailsPage
- [ ] Update Google Maps embed URL (if needed)
- [ ] Test full user flow (Invitation → Login → Signature → Details)
- [ ] Mobile testing on real device
- [ ] Performance optimization
- [ ] Remove test/debug components (SupabaseTest.jsx)
- [ ] Verify Instagram username is correct

### Nice to Have
- [ ] Add confetti animation on success
- [ ] Share functionality (copy link)
- [ ] Admin dashboard (view responses)
- [ ] Email notification on RSVP

---

## 💝 PROJECT CONTEXT

This project is a heartfelt effort to:
- Reconnect with someone special
- Show genuine effort and care
- Create a memorable experience
- Demonstrate technical and creative skills

**Built with:** React, Tailwind CSS, Supabase, and a lot of hope 💚

---

## 📄 LICENSE

This is a personal project. All rights reserved.

---

## 👤 CONTACT

**Project Creator:** [Your Name]  
**For:** Nasywa 💕  
**Purpose:** Special date invitation to Cafe de RURU

---

## 🙏 ACKNOWLEDGMENTS

- **Cafe de RURU** - Inspiration for this project
- **Supabase** - Amazing free database service
- **Tailwind CSS** - Making styling enjoyable
- **Framer Motion** - Smooth animations
- **Suika** 🐢 - Our beloved turtle mascot

---

**Made with 💚 and lots of effort**

**"Ini adalah usaha terbaikku untuk bikin kamu tersenyum lagi."**

---

*Last Updated: [Current Date]*  
*Status: Active Development*  
*Target Completion: Rabu Malam*
