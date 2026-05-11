import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  updateDressCode,
  updateCustomRundown,
  getRSVPByUsername,
} from "../lib/rsvpService";

// Default Rundown Data
const DEFAULT_RUNDOWN = [
  { time: "07:00", activity: "🚗 Jemput di tempat" },
  { time: "07:40", activity: "☕ Arrive at Cafe de RURU" },
  { time: "08:00", activity: "📚 Nuggas Session 1 (Focus Time)" },
  { time: "11:30", activity: "📸 Photo Session & Break" },
  { time: "12:00", activity: "🕌 Shalat Dzuhur" },
  { time: "12:30", activity: "🍽️ Lunch Break" },
  { time: "13:00", activity: "💻 Nuggas Session 2 + Optional Games" },
  { time: "15:00", activity: "🕌 Shalat Ashar" },
  { time: "15:30", activity: "🏠 Pulang (safe trip!)" },
];

// Benefits Data - WITH CATEGORIES
const BENEFITS = [
  {
    category: "Study & Productivity",
    items: [
      { icon: "📚", text: "Nuggas Bareng" },
      { icon: "💻", text: "Free WiFi" },
      { icon: "🪑", text: "Tempat Duduk Nyaman" },
      { icon: "🔌", text: "Free Charger" },
    ],
  },
  {
    category: "Food & Drink",
    items: [
      { icon: "🍵", text: "Get Free Matcha" },
      { icon: "🍽️", text: "Get Free Dish" },
    ],
  },
  {
    category: "Tech Support",
    items: [
      { icon: "💾", text: "Free Pindahin File dari Kamera ke Laptop" },
      { icon: "🛠️", text: "Troubleshoot Laptop/HP" },
      { icon: "📱", text: "Backup Files sambil Ngopi" },
    ],
  },
  {
    category: "Experience & Fun",
    items: [
      { icon: "🌿", text: "Fresh Air" },
      { icon: "📸", text: "Aesthetic Photo Spot" },
      { icon: "🎮", text: "Optional Games & Fun" },
      { icon: "🗣️", text: "Sharing Cerita & Deep Talk" },
      { icon: "⏰", text: "Quality Time Together" },
      { icon: "💕", text: "Bisa Pacaran (halal kok 😇)" },
    ],
  },
  {
    category: "Extras",
    items: [
      { icon: "🎓", text: "Matcha Education" },
      { icon: "✨", text: "New Experience" },
      { icon: "🤝", text: "Dapat Teman yang Supportive" },
    ],
  },
];

// Checklist Items
const INITIAL_CHECKLIST = {
  wajib: [
    { id: 1, icon: "💻", text: "Laptop", checked: false },
    { id: 2, icon: "📱", text: "HP", checked: false },
    { id: 3, icon: "💧", text: "Air Minum", checked: false },
    { id: 4, icon: "📓", text: "Notes", checked: false },
    { id: 5, icon: "😊", text: "Good Mood & Smile", checked: false },
    { id: 6, icon: "🔌", text: "Charger Laptop & HP", checked: false },
  ],
  optional: [
    { id: 7, icon: "☔", text: "Jas Hujan", checked: false },
    { id: 8, icon: "💄", text: "Make up Touch Up", checked: false },
    { id: 9, icon: "🎧", text: "TWS", checked: false },
    { id: 10, icon: "📷", text: "Kamera", checked: false },
    { id: 11, icon: "💰", text: "Uang Parkir", checked: false },
  ],
};

// Dress Code Options
const DRESS_CODE_OPTIONS = [
  { value: "", label: "Pilih warna outfit..." },
  { value: "white", label: "🤍 White (Clean & Fresh)" },
  { value: "green", label: "💚 Green (Matching Matcha)" },
  { value: "pink", label: "🩷 Pink (Soft & Feminine)" },
  { value: "brown", label: "🤎 Brown/Beige (Earthy)" },
  { value: "black", label: "🖤 Black (Classic & Chic)" },
  { value: "surprise", label: "🌈 Surprise Me!" },
];

const DetailsPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [rundown, setRundown] = useState(DEFAULT_RUNDOWN);
  const [editIndex, setEditIndex] = useState(null);
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);
  const [selectedDressCode, setSelectedDressCode] = useState("");
  const [isSavingDress, setIsSavingDress] = useState(false);
  const [isSavingRundown, setIsSavingRundown] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [username, setUsername] = useState("");
  const [floatingElements, setFloatingElements] = useState([]);

  // Load user data from Supabase
  const loadUserData = async (username) => {
    const result = await getRSVPByUsername(username);
    if (result.success && result.data) {
      if (result.data.dress_code) {
        setSelectedDressCode(result.data.dress_code);
      }
      if (result.data.custom_rundown) {
        setRundown(result.data.custom_rundown);
      }
    }
  };

  // Check login and load data
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (!savedUsername) {
      navigate("/login");
      return;
    }
    setUsername(savedUsername);
    loadUserData(savedUsername);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Countdown Timer - Target: 14 Mei 2026 jam 07:00
  useEffect(() => {
    const updateCountdown = () => {
      // Year, Month (0-indexed, so 4 = Mei), Day, Hour, Minute, Second
      const targetDate = new Date(2026, 4, 14, 7, 0, 0);
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      console.log("Countdown:", {
        target: targetDate.toString(),
        now: now.toString(),
        diff: difference,
        diffDays: difference / (1000 * 60 * 60 * 24),
      });

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Floating elements
  useEffect(() => {
    const elements = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      emoji: ["🍵", "🌿", "✨", "💚"][i % 4],
      left: `${Math.random() * 80 + 10}%`,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
    }));
    setFloatingElements(elements);
  }, []);

  const handleDressCodeChange = (e) => {
    const value = e.target.value;
    setSelectedDressCode(value);
  };

  const handleSaveDressCode = async () => {
    if (selectedDressCode) {
      setIsSavingDress(true);
      const result = await updateDressCode(username, selectedDressCode);
      if (result.success) {
        console.log("Dress code saved!");
      }
      setIsSavingDress(false);
    }
  };

  const handleStartEdit = (index, field) => {
    setEditIndex(index);
    setEditField(field);
    setTempValue(rundown[index][field]);
  };

  const handleSaveEdit = () => {
    if (editIndex !== null && editField !== null) {
      const updatedRundown = [...rundown];
      updatedRundown[editIndex][editField] = tempValue;
      setRundown(updatedRundown);
    }
    setEditIndex(null);
    setEditField(null);
    setTempValue("");
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditField(null);
    setTempValue("");
  };

  const handleSaveRundown = async () => {
    setIsSavingRundown(true);
    const result = await updateCustomRundown(username, rundown);
    if (result.success) {
      console.log("Rundown saved!");
    }
    setIsSavingRundown(false);
  };

  const handleChecklistToggle = (category, itemId) => {
    setChecklist((prev) => ({
      ...prev,
      [category]: prev[category].map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item,
      ),
    }));
  };

  const handleSaveAll = async () => {
    setIsSavingAll(true);
    setSaveSuccess(false);

    try {
      if (selectedDressCode) {
        await updateDressCode(username, selectedDressCode);
      }
      await updateCustomRundown(username, rundown);

      setSaveSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsSavingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-beige to-matcha-light/20 relative overflow-hidden">
      {/* Floating Decorations */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute text-2xl opacity-10 pointer-events-none"
          style={{ left: element.left, top: "-50px" }}
          animate={{ y: ["0vh", "110vh"] }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {element.emoji}
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6 pb-24 max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="font-lora text-3xl sm:text-4xl font-bold text-matcha-dark mb-2">
            🎉 The Details! 🎉
          </h1>
          <p className="font-inter text-sm text-matcha-primary">
            Everything you need to know ☕💚
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-lg border-2 border-matcha-light"
        >
          <h2 className="font-outfit text-base sm:text-lg font-bold text-center text-matcha-dark mb-3">
            ⏱️ COUNTDOWN TO OUR DATE ⏱️
          </h2>
          <div className="text-center text-xs text-gray-600 mb-2 font-inter">
            Kamis, 14 Mei 2026 • 07:00 WIB
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "DAYS", value: countdown.days },
              { label: "HOURS", value: countdown.hours },
              { label: "MINS", value: countdown.minutes },
              { label: "SECS", value: countdown.seconds },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-matcha-primary/20 rounded-lg p-2 sm:p-3"
                animate={{ scale: item.label === "SECS" ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="font-outfit text-xl sm:text-2xl font-bold text-matcha-dark text-center">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="font-inter text-[10px] text-matcha-primary mt-1 text-center">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Section - WITH CATEGORIES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 mb-6 shadow-lg border-2 border-matcha-light"
        >
          <h2 className="font-lora text-xl sm:text-2xl font-bold text-matcha-dark mb-4 text-center">
            🎁 Benefits Datang ke Cafe de RURU
          </h2>
          <div className="space-y-4">
            {BENEFITS.map((category, catIndex) => (
              <div key={catIndex}>
                <h3 className="font-outfit text-sm sm:text-base font-semibold text-matcha-primary mb-2">
                  {category.category}
                </h3>
                <div className="space-y-1.5">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center gap-3 p-2 bg-matcha-light/10 rounded-lg"
                    >
                      <span className="text-base sm:text-lg flex-shrink-0">
                        {item.icon}
                      </span>
                      <span className="font-inter text-xs sm:text-sm text-gray-700">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rundown Section - EDITABLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 mb-6 shadow-lg border-2 border-matcha-light"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-lora text-xl sm:text-2xl font-bold text-matcha-dark">
              ⏰ Rundown Acara
            </h2>
            <button
              onClick={handleSaveRundown}
              disabled={isSavingRundown}
              className="bg-matcha-primary text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-outfit text-xs sm:text-sm hover:bg-matcha-dark transition-colors disabled:opacity-50"
            >
              {isSavingRundown ? "Saving..." : "💾 Save"}
            </button>
          </div>

          <div className="space-y-2">
            {rundown.map((item, index) => (
              <div
                key={index}
                className="bg-matcha-light/20 rounded-lg p-2 sm:p-3"
              >
                <div className="flex items-start gap-2">
                  {/* Time */}
                  {editIndex === index && editField === "time" ? (
                    <div className="flex flex-col gap-1">
                      <input
                        type="time"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="w-20 bg-white rounded px-2 py-1 font-outfit text-xs sm:text-sm border-2 border-matcha-primary focus:outline-none"
                        autoFocus
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={handleSaveEdit}
                          className="flex-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded"
                        >
                          ✓
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded"
                        >
                          ✗
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(index, "time")}
                      className="w-16 sm:w-20 font-outfit font-bold text-matcha-dark text-xs sm:text-sm hover:text-matcha-primary text-left"
                    >
                      {item.time}
                    </button>
                  )}

                  {/* Activity */}
                  {editIndex === index && editField === "activity" ? (
                    <div className="flex-1 flex flex-col gap-1">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="w-full bg-white rounded px-2 py-1 font-inter text-xs sm:text-sm border-2 border-matcha-primary focus:outline-none"
                        autoFocus
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={handleSaveEdit}
                          className="flex-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded"
                        >
                          ✓ Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded"
                        >
                          ✗ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-between">
                      <button
                        onClick={() => handleStartEdit(index, "activity")}
                        className="flex-1 font-inter text-xs sm:text-sm text-gray-700 hover:text-matcha-primary text-left"
                      >
                        {item.activity}
                      </button>
                      <button
                        onClick={() => handleStartEdit(index, "activity")}
                        className="text-matcha-primary ml-2"
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 text-center mt-3 italic">
            Klik jam atau aktivitas untuk edit
          </p>
        </motion.div>

        {/* Dress Code Section - TEXT INPUT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 mb-6 shadow-lg border-2 border-matcha-light"
        >
          <h2 className="font-lora text-xl sm:text-2xl font-bold text-matcha-dark mb-3 text-center">
            👗 Dress Code
          </h2>
          <p className="font-inter text-xs sm:text-sm text-gray-600 text-center mb-4">
            Mau pakai warna apa hari itu? (Casual & comfy aja ya! ✨)
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={selectedDressCode}
              onChange={handleDressCodeChange}
              placeholder="Contoh: White, Green, Pink, dll..."
              className="flex-1 p-3 sm:p-4 rounded-xl border-2 border-matcha-light bg-white font-inter text-sm focus:outline-none focus:border-matcha-primary transition-all shadow-sm"
            />
            <button
              onClick={handleSaveDressCode}
              disabled={isSavingDress || !selectedDressCode}
              className="bg-matcha-primary text-white px-4 py-3 rounded-xl font-outfit text-sm hover:bg-matcha-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingDress ? "💾..." : "💾"}
            </button>
          </div>

          {!isSavingDress && selectedDressCode && (
            <p className="text-center text-xs text-gray-500 mt-2 italic">
              Jangan lupa klik 💾 untuk menyimpan
            </p>
          )}
        </motion.div>

        {/* Checklist Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 mb-6 shadow-lg border-2 border-matcha-light"
        >
          <h2 className="font-lora text-xl sm:text-2xl font-bold text-matcha-dark mb-4 text-center">
            ✅ Checklist Barang
          </h2>

          <div className="mb-5">
            <h3 className="font-outfit font-semibold text-matcha-primary mb-2 text-sm sm:text-base">
              Wajib Dibawa:
            </h3>
            <div className="space-y-1.5">
              {checklist.wajib.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-2 sm:p-3 bg-white rounded-lg cursor-pointer hover:bg-matcha-light/10 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleChecklistToggle("wajib", item.id)}
                    className="w-4 h-4 sm:w-5 sm:h-5 accent-matcha-primary cursor-pointer"
                  />
                  <span className="text-base sm:text-xl">{item.icon}</span>
                  <span className="font-inter text-xs sm:text-sm flex-1">
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-outfit font-semibold text-matcha-primary mb-2 text-sm sm:text-base">
              Optional:
            </h3>
            <div className="space-y-1.5">
              {checklist.optional.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-2 sm:p-3 bg-white rounded-lg cursor-pointer hover:bg-matcha-light/10 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleChecklistToggle("optional", item.id)}
                    className="w-4 h-4 sm:w-5 sm:h-5 accent-matcha-primary cursor-pointer"
                  />
                  <span className="text-base sm:text-xl">{item.icon}</span>
                  <span className="font-inter text-xs sm:text-sm flex-1">
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tujuan Acara */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 mb-6 shadow-lg border-2 border-matcha-light"
        >
          <h2 className="font-lora text-xl sm:text-2xl font-bold text-matcha-dark mb-4 text-center">
            🎯 Tujuan Acara
          </h2>

          <div className="mb-4">
            <h3 className="font-outfit font-semibold text-matcha-primary mb-2 text-sm sm:text-base">
              Kenapa Acara Ini Diadakan?
            </h3>
            <p className="font-inter text-xs sm:text-sm text-gray-700 leading-relaxed">
              Jadi ceritanya ini dadakan banget... Pas lagi tiduran di masjid
              abis shalat dzuhur, tiba-tiba kepikiran:{" "}
              <em>
                "Eh, udah lama nggak quality time sambil produktif bareng."
              </em>{" "}
              Terus langsung bikin website ini deh (yes, I'm extra like that
              😅).
            </p>
          </div>

          <div>
            <h3 className="font-outfit font-semibold text-matcha-primary mb-2 text-sm sm:text-base">
              Apa yang Mau Dicapai?
            </h3>
            <div className="space-y-2">
              {[
                {
                  icon: "✅",
                  text: "Progress Tugas (kita sama-sama produktif!)",
                },
                { icon: "💚", text: "Quality Time (catch up & ngobrol)" },
                { icon: "📸", text: "Create Memories (foto-foto aesthetic)" },
                {
                  icon: "☕",
                  text: "Matcha Experience (karena matcha is life)",
                },
              ].map((goal, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 sm:p-3 bg-matcha-light/10 rounded-lg"
                >
                  <span className="text-base sm:text-xl">{goal.icon}</span>
                  <span className="font-inter text-xs sm:text-sm text-gray-700">
                    {goal.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Location & Map - CAFE DE RURU */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 mb-6 shadow-lg border-2 border-matcha-light"
        >
          <h2 className="font-lora text-xl sm:text-2xl font-bold text-matcha-dark mb-4 text-center">
            📍 Location: Cafe de RURU
          </h2>

          {/* Google Maps Embed */}
          <div className="rounded-xl overflow-hidden shadow-lg mb-3">
            <iframe
              src="https://maps.google.com/maps?q=Cafe+de+RURU,+Jl.+Anggrek+No.24,+Merdeka,+Kec.+Sumur+Bandung,+Kota+Bandung,+Jawa+Barat+40113&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Cafe de RURU Location"
            ></iframe>
          </div>

          <a
            href="https://maps.app.goo.gl/rEXZybhtg6BHFGXz7"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-matcha-primary text-white text-center py-2 rounded-lg font-outfit hover:bg-matcha-dark transition-colors"
          >
            📍 Open in Google Maps
          </a>

          <p className="font-inter text-xs text-center text-gray-600 mt-2">
            Click button above to navigate 📱
          </p>
        </motion.div>

        {/* Closing Message & Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-matcha-primary to-matcha-dark rounded-2xl p-5 sm:p-6 mb-6 shadow-xl text-white text-center"
        >
          <p className="font-lora text-base sm:text-lg italic mb-4 leading-relaxed">
            "Life is like a cup of matcha – a little bitter, a little sweet, but
            always better when shared with the right person."
          </p>
          <p className="font-inter text-xs sm:text-sm opacity-90">
            Can't wait to see you there! ☕✨
          </p>
        </motion.div>

        {/* Save and See You Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500 text-white px-6 py-3 rounded-full mb-4 inline-block font-outfit font-semibold"
            >
              ✓ All data saved successfully!
            </motion.div>
          )}

          <motion.button
            onClick={handleSaveAll}
            disabled={isSavingAll}
            whileHover={{ scale: isSavingAll ? 1 : 1.05 }}
            whileTap={{ scale: isSavingAll ? 1 : 0.95 }}
            className="bg-gradient-to-r from-matcha-primary to-matcha-light text-white font-outfit font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-xl text-base sm:text-lg inline-block disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSavingAll ? "Saving..." : "Save, and See You!"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default DetailsPage;
