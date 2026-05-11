# 🚀 QUICK DEPLOY CHECKLIST

**Follow these steps to get your website live ASAP!**

---

## ⚡ STEP 1: UPDATE DATABASE (5 minutes)

### If you ALREADY have the database:
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy & paste **`database_migration_details_page.sql`**
4. Click **"Run"**
5. ✅ Done!

### If this is FIRST TIME setup:
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy & paste **`supabase_schema.sql`**
4. Click **"Run"**
5. ✅ Done!

**Verify:** Go to Table Editor → Check `rsvp_responses` table has `dress_code` and `custom_rundown` columns.

---

## ⚙️ STEP 2: CUSTOMIZE SETTINGS (10 minutes)

### 2.1 Set Countdown Date
**File:** `src/pages/DetailsPage.jsx` (Line 112)

```javascript
// Change this to your actual date!
const TARGET_DATE = new Date("2025-05-08T07:00:00");
```

**Example:**
- For May 10, 2025 at 3 PM: `new Date("2025-05-10T15:00:00")`
- For June 1, 2025 at 9 AM: `new Date("2025-06-01T09:00:00")`

### 2.2 Update Google Maps (Optional)
**File:** `src/pages/DetailsPage.jsx` (Line 543)

1. Go to [Google Maps](https://www.google.com/maps)
2. Search for "Cafe de RURU" (or your location)
3. Click **Share** → **Embed a map**
4. Copy the iframe URL
5. Replace line 543 in DetailsPage.jsx

**Current location:** Cafe de RURU (already set)
**Skip if correct!**

### 2.3 Verify Instagram Username
**File:** `src/pages/DetailsPage.jsx` (Line 222)

```javascript
// Make sure this is correct!
window.open("https://instagram.com/atmiwwa", "_blank");
```

Change `atmiwwa` to your Instagram username if different.

---

## 🧪 STEP 3: TEST LOCALLY (15 minutes)

### 3.1 Start Dev Server
```bash
npm run dev
```

### 3.2 Test Full User Flow
Open `http://localhost:5174` on your phone (or mobile emulator)

**Complete Journey:**
1. ✅ Loading animation (Suika) works
2. ✅ InvitationPage → Click "Yes!"
3. ✅ LoginPage → Select any username + date "1 Mei 2025"
4. ✅ SignaturePage → Draw signature + Submit
5. ✅ Wait for loading (3 seconds)
6. ✅ DetailsPage → All features visible

**On Details Page, verify:**
- [ ] Countdown shows correct time
- [ ] Benefits display nicely
- [ ] Rundown can be edited (click ✏️)
- [ ] Rundown "Save Changes" works
- [ ] Dress Code selection works
- [ ] Checklist checkboxes work
- [ ] Maps loads
- [ ] Instagram button works

### 3.3 Check Database
1. Go to Supabase Dashboard → Table Editor
2. Open `rsvp_responses` table
3. See your test entry with:
   - username ✅
   - login_date ✅
   - signature_image ✅
   - dress_code ✅ (if you selected one)
   - custom_rundown ✅ (if you edited & saved)

**If all checks pass → Ready to deploy! 🎉**

---

## 🌐 STEP 4: DEPLOY TO VERCEL (10 minutes)

### 4.1 Prepare Repository (if not done)
```bash
git add .
git commit -m "Complete website with Details Page"
git push origin main
```

### 4.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repo
4. Add Environment Variables:
   - `VITE_SUPABASE_URL` = (your Supabase project URL)
   - `VITE_SUPABASE_ANON_KEY` = (your Supabase anon key)
5. Click **"Deploy"**
6. Wait ~2 minutes ⏳
7. ✅ Done!

**Your website is LIVE!** 🎉

---

## 📱 STEP 5: FINAL TESTING (5 minutes)

### Test on Real Device
1. Open deployed URL on your phone
2. Complete full flow again (Invitation → Details)
3. Verify everything works

### Test Different Scenarios
- [ ] Username selection works
- [ ] Date validation works
- [ ] Signature saves
- [ ] Details page loads with saved data
- [ ] Dress code saves and persists
- [ ] Rundown edits save and persist
- [ ] Instagram link opens correctly

**If all pass → YOU'RE DONE! 🎊**

---

## 🎯 QUICK FIXES FOR COMMON ISSUES

### Issue: Countdown shows wrong time
**Fix:** Update `TARGET_DATE` in `DetailsPage.jsx` line 112

### Issue: Maps not loading
**Fix:** Check Google Maps embed URL is correct (line 543)

### Issue: Dress code not saving
**Fix:** Make sure you ran the migration SQL in Supabase

### Issue: Instagram button not working
**Fix:** Check username is correct (line 222)

### Issue: "Username not found"
**Fix:** Make sure you completed SignaturePage first

---

## 📊 DEPLOYMENT SUMMARY

**What you just deployed:**
- 🐢 Loading Animation (Suika the turtle)
- 💚 Invitation Page (with real-time counter)
- 🔐 Login Page (username + date picker)
- ✍️ Signature Page (canvas signature)
- 🎉 Details Page (9+ features!)
- 💔 Goodbye Page (rejection page)
- 📱 Mobile-only guard
- 🗄️ Supabase database integration
- 🎨 Matcha aesthetic theme

**Total Pages:** 6
**Total Features:** 20+
**Database Tables:** 1
**API Endpoints:** 5

---

## 🎊 CONGRATULATIONS!

Your invitation website is now **LIVE** and ready to send! 🚀

**Next Steps:**
1. Share the URL with Nasywa
2. Wait for her to respond
3. Check Supabase dashboard for her choices
4. Prepare for the date! ☕💚

---

## 📞 NEED HELP?

**Check Documentation:**
- `README.md` - Project overview
- `DETAILS_PAGE_GUIDE.md` - Feature details
- `WHAT_WE_JUST_BUILT.md` - Summary
- `QUICK_START_SUPABASE.md` - Database help

---

**Total Time:** ~45 minutes
**Difficulty:** Easy ⭐⭐

**Made with 💚 and hope!**

*Good luck with your date! ☕✨*
