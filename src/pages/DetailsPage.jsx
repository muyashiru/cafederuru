import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  { time: "08:00", activity: "📚 Nugas Sesi 1 (Focus Time)" },
  { time: "11:30", activity: "📸 Photo Session & Break" },
  { time: "12:00", activity: "🕌 Shalat Dzuhur" },
  { time: "12:30", activity: "🍽️ Lunch Break" },
  { time: "13:00", activity: "💻 Nugas Sesi 2 + Optional Games" },
  { time: "15:00", activity: "🕌 Shalat Ashar" },
  { time: "15:30", activity: "🏠 Pulang or Strolling around Bandung" },
];

const BENEFITS = [
  {
    category: "Experience & Fun",
    items: [
      { icon: "🌿", text: "Fresh Air" },
      { icon: "📸", text: "Aesthetic Photo Spot" },
      { icon: "🎮", text: "Optional Games & Fun" },
      { icon: "🗣️", text: "Sharing Cerita & Deep Talk" },
      { icon: "⏰", text: "Quality Time Together" },
      { icon: "💕", text: "Bisa Pacaran" },
    ],
  },
  {
    category: "Study & Productivity",
    items: [
      { icon: "📚", text: "Nuggas Bareng" },
      { icon: "💻", text: "Free WiFi" },
      { icon: "🪑", text: "Tempat Duduk Nyaman" },
      { icon: "🔌", text: "Free Charger Spot" },
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
    category: "Extras",
    items: [
      { icon: "🎓", text: "Ngobrolin Masa Depan Suika" },
      { icon: "✨", text: "New Experience" },
      { icon: "🤝", text: "Dapat Teman yang Supportive" },
    ],
  },
  {
    category: "Food & Drink",
    items: [
      { icon: "🍵", text: "Get Free Matcha" },
      { icon: "🍽️", text: "Get Free Dish" },
    ],
  },
];

// Calculate Pie Chart Data
const PIE_DATA = [
  { label: "Fun", value: 33, color: "#99AD7A" },
  { label: "Study", value: 22, color: "#546B41" },
  { label: "Tech", value: 17, color: "#FFD1DC" },
  { label: "Extras", value: 17, color: "#DCCCAC" },
  { label: "Food", value: 11, color: "#FFDAB9" },
];

// Checklist Items
const INITIAL_CHECKLIST = {
  wajib: [
    { id: 1, icon: "💻", text: "Laptop", checked: false },
    { id: 2, icon: "📱", text: "HP", checked: false },
    { id: 3, icon: "💧", text: "Air Minum", checked: false },
    { id: 4, icon: "📓", text: "Notes", checked: false },
    { id: 5, icon: "😊", text: "Mood Baik", checked: false },
    { id: 6, icon: "🔌", text: "Charger", checked: false },
  ],
  optional: [
    { id: 7, icon: "☔", text: "Jas Hujan", checked: false },
    { id: 8, icon: "💄", text: "Touch Up", checked: false },
    { id: 9, icon: "🎧", text: "TWS", checked: false },
    { id: 10, icon: "📷", text: "Kamera", checked: false },
    { id: 11, icon: "💰", text: "Uang Parkir", checked: false },
  ],
};

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

  // Play Background Music
  useEffect(() => {
    const salAudio = new Audio("/Sal%20Priadi%20-%20Besok%20Kita%20Pergi%20Makan%20(Official%20Audio).mp3");
    salAudio.loop = true;
    salAudio.volume = 0.6;

    // Langsung matikan Hachimi jika masih berjalan
    if (window.hachimiAudio) {
      window.hachimiAudio.pause();
      window.hachimiAudio.src = "";
      window.hachimiAudio = null;
    }

    // Langsung putar Sal Priadi
    salAudio.play().catch(e => console.log("Autoplay blocked or audio missing:", e));

    return () => {
      salAudio.pause();
      salAudio.src = "";
    };
  }, []);

  // Countdown Timer - Target: 14 Mei 2026 jam 07:00
  useEffect(() => {
    const updateCountdown = () => {
      // Year, Month (0-indexed, so 4 = Mei), Day, Hour, Minute, Second
      const targetDate = new Date(2026, 4, 14, 7, 0, 0);
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

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
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      emoji: ["🍵", "🌿", "✨", "💚", "🌸"][i % 5],
      left: `${Math.random() * 90}%`,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 15,
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

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-cream relative overflow-x-hidden font-body">
      {/* Elegant Colorful Background Blobs (Not Tacky Gradients) */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-matcha-primary rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse-soft z-0 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-beige rounded-full mix-blend-multiply filter blur-[120px] opacity-50 z-0 pointer-events-none" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-[40%] left-[20%] w-[300px] h-[300px] bg-matcha-dark rounded-full mix-blend-multiply filter blur-[150px] opacity-10 z-0 pointer-events-none"></div>

      {/* Floating Decorations */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute text-2xl opacity-40 pointer-events-none z-0"
          style={{ left: element.left, top: "-50px" }}
          animate={{ y: ["0vh", "110vh"], rotate: [0, 360] }}
          transition={{
            y: { duration: element.duration, delay: element.delay, repeat: Infinity, ease: "linear" },
            rotate: { duration: element.duration * 0.8, repeat: Infinity, ease: "linear" }
          }}
        >
          {element.emoji}
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 p-5 sm:p-8 pb-32 max-w-xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="text-center pt-4 pb-2 relative z-10"
        >
          <div className="inline-block p-3 bg-white/80 backdrop-blur-md rounded-2xl mb-4 shadow-sm border border-matcha-100 rotate-3">
            <span className="text-4xl">🎉</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-matcha-dark mb-2 tracking-tight">
            THE DETAILS!
          </h1>
          <p className="font-accent tracking-widest uppercase text-xs font-semibold text-matcha-primary bg-white/50 inline-block px-4 py-1.5 rounded-full backdrop-blur-sm border border-matcha-100/50">
            Scrollnya Pelan Pelan Yak, Sambil Nikmatin Lagunya☕
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="glass-panel p-6 sm:p-8"
        >
          <h2 className="font-heading text-lg sm:text-xl font-bold text-center text-matcha-dark mb-1">
            COUNTDOWN TO OUR DATE
          </h2>
          <div className="text-center text-xs text-gray-500 mb-6 font-accent tracking-wider uppercase font-medium">
            Kamis, 14 Mei 2026 • 07:00 WIB
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "HARI", value: countdown.days },
              { label: "JAM", value: countdown.hours },
              { label: "MENIT", value: countdown.minutes },
              { label: "DETIK", value: countdown.seconds },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <motion.div
                  className="w-full aspect-square bg-gradient-to-b from-white to-matcha-50 rounded-2xl shadow-sm border border-matcha-100 flex items-center justify-center mb-2"
                  animate={{ scale: item.label === "SECS" ? [1, 1.05, 1] : 1 }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-matcha-dark">
                    {String(item.value).padStart(2, "0")}
                  </span>
                </motion.div>
                <span className="font-accent text-[10px] font-bold text-matcha-primary tracking-widest">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rundown Section - EDITABLE */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="glass-panel p-6 sm:p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-matcha-dark mb-1">
                ⏰ Rundown Acara
              </h2>
              <p className="font-body text-xs text-gray-500">Klik buat ngeditnya, <br></br>atau ganti jam dijemput!</p>
            </div>
            <button
              onClick={handleSaveRundown}
              disabled={isSavingRundown}
              className="bg-white text-matcha-dark border border-matcha-200 px-4 py-2 rounded-xl font-body font-semibold text-xs shadow-sm hover:bg-matcha-50 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSavingRundown ? "Saving..." : <span>💾 Save</span>}
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/80 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-matcha-50/80 border-b border-matcha-100/50">
                  <th className="font-accent text-[10px] sm:text-xs tracking-widest uppercase font-bold text-matcha-primary px-4 py-3 w-28">Jam</th>
                  <th className="font-accent text-[10px] sm:text-xs tracking-widest uppercase font-bold text-matcha-primary px-4 py-3">Aktivitas</th>
                </tr>
              </thead>
              <tbody className="bg-white/40">
                {rundown.map((item, index) => (
                  <tr key={index} className="border-b border-white/60 hover:bg-white/80 transition-colors group">
                    <td className="px-4 py-3 align-top whitespace-nowrap">
                      {editIndex === index && editField === "time" ? (
                        <div className="flex flex-col gap-1 w-24">
                          <input
                            type="time"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="glass-input px-2 py-1.5 w-full text-xs font-bold text-matcha-dark"
                            autoFocus
                          />
                          <div className="flex gap-1">
                            <button onClick={handleSaveEdit} className="bg-matcha-primary text-white text-[10px] py-1 rounded-md flex-1 font-bold">OK</button>
                            <button onClick={handleCancelEdit} className="bg-red-400 text-white text-[10px] py-1 rounded-md flex-1 font-bold">X</button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(index, "time")}
                          className="font-heading font-bold text-matcha-primary text-sm hover:text-matcha-dark transition-colors text-left"
                        >
                          {item.time}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top">
                      {editIndex === index && editField === "activity" ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="glass-input px-3 py-1.5 w-full text-sm text-gray-700"
                            autoFocus
                          />
                          <div className="flex gap-1 shrink-0">
                            <button onClick={handleSaveEdit} className="bg-matcha-primary text-white text-xs px-3 py-1.5 rounded-lg">✅</button>
                            <button onClick={handleCancelEdit} className="bg-red-400 text-white text-xs px-3 py-1.5 rounded-lg">❌</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-2 mt-0.5">
                          <button
                            onClick={() => handleStartEdit(index, "activity")}
                            className="font-body font-medium text-sm text-gray-700 hover:text-matcha-dark text-left"
                          >
                            {item.activity}
                          </button>
                          <button
                            onClick={() => handleStartEdit(index, "activity")}
                            className="opacity-0 group-hover:opacity-100 text-matcha-light hover:text-matcha-primary transition-all p-1 text-xs shrink-0"
                          >
                            ✏️
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Dress Code Section */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="glass-panel p-6 sm:p-8"
        >
          <div className="text-center mb-6">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-matcha-dark mb-1">
              👗 Dress Code
            </h2>
            <p className="font-body text-xs text-gray-500">
              Mau warna apa dress codenya nanti?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={selectedDressCode}
              onChange={handleDressCodeChange}
              placeholder="Contoh: Green Matcha, Pink Pastel..."
              className="flex-1 px-5 py-4 glass-input font-body text-sm font-medium text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={handleSaveDressCode}
              disabled={isSavingDress || !selectedDressCode}
              className="btn-matcha px-6 py-4 flex items-center justify-center disabled:opacity-50 whitespace-nowrap"
            >
              {isSavingDress ? "Menyimpan..." : "Simpan Warna"}
            </button>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="glass-panel p-5 sm:p-8 bg-white/60 backdrop-blur-xl border border-white/80"
        >
          <div className="text-center mb-5">
            <div className="inline-block p-1.5 bg-beige/30 rounded-xl mb-2 border border-beige/50 -rotate-3">
              <span className="text-xl">🎁</span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-matcha-dark">
              Apa aja sih yang didapet klo ngedate sama aku?
            </h2>
          </div>

          {/* Activity Pie Chart */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8 bg-white/50 p-4 rounded-2xl border border-white/60 shadow-sm">
            <div className="w-32 h-32 relative shrink-0">
              <svg viewBox="0 0 42 42" className="w-full h-full -rotate-90 drop-shadow-md">
                <circle cx="21" cy="21" r="15.91549431" fill="transparent" stroke="#FFF8EC" strokeWidth="8" />
                {PIE_DATA.reduce((acc, slice, i) => {
                  const dashArray = `${slice.value} ${100 - slice.value}`;
                  const offset = 100 - acc.cumulative;

                  acc.elements.push(
                    <circle
                      key={i}
                      cx="21"
                      cy="21"
                      r="15.91549431"
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth="8"
                      strokeDasharray={dashArray}
                      strokeDashoffset={offset}
                      className="transition-all duration-1000 ease-out"
                    />
                  );
                  acc.cumulative += slice.value;
                  return acc;
                }, { elements: [], cumulative: 0 }).elements}
              </svg>
              {/* Inner Text for Donut Hole */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-xl font-bold text-matcha-dark leading-none">100%</span>
                <span className="font-accent text-[8px] font-bold text-matcha-primary tracking-widest uppercase mt-0.5">Worth It</span>
              </div>
            </div>

            {/* Chart Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-6 gap-y-2 w-full sm:w-auto">
              {PIE_DATA.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                  <span className="font-body text-xs font-semibold text-gray-700 whitespace-nowrap">
                    {item.label} <span className="text-gray-400 font-normal ml-1">{item.value}%</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            {BENEFITS.map((category, catIndex) => (
              <div key={catIndex} className="bg-white/40 p-3 rounded-xl border border-white/60">
                <h3 className="font-accent font-bold text-[10px] sm:text-xs uppercase tracking-wider text-matcha-primary mb-2">
                  {category.category}
                </h3>
                <div className="grid grid-cols-1 gap-1.5">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm text-xs shrink-0">
                        {item.icon}
                      </div>
                      <span className="font-body text-[11px] sm:text-xs font-medium text-gray-700 leading-tight">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Checklist Section */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="glass-panel p-5 sm:p-8"
        >
          <div className="text-center mb-5">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-matcha-dark mb-1">
              ✅ Checklist Barang
            </h2>
            <p className="font-body text-[11px] sm:text-xs text-gray-500">Jangan sampai ketinggalan!</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-accent font-bold text-[10px] sm:text-xs uppercase tracking-wider text-matcha-primary mb-2 px-1">
                Wajib Dibawa
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {checklist.wajib.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all border ${item.checked ? "bg-matcha-50 border-matcha-200 shadow-sm" : "bg-white/40 border-white/60 hover:bg-white/80"
                      }`}
                  >
                    <div className={`w-4 h-4 rounded-[4px] flex items-center justify-center border transition-colors shrink-0 ${item.checked ? "bg-matcha-primary border-matcha-primary" : "bg-white border-gray-300"
                      }`}>
                      {item.checked && <span className="text-white text-[10px] font-bold">✓</span>}
                    </div>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleChecklistToggle("wajib", item.id)}
                      className="hidden"
                    />
                    <span className="text-base leading-none">{item.icon}</span>
                    <span className={`font-body text-[10px] sm:text-xs font-medium leading-tight truncate ${item.checked ? "text-matcha-dark line-through opacity-70" : "text-gray-700"}`}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-accent font-bold text-[10px] sm:text-xs uppercase tracking-wider text-matcha-primary mb-2 px-1">
                Optional
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {checklist.optional.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all border ${item.checked ? "bg-matcha-50 border-matcha-200 shadow-sm" : "bg-white/40 border-white/60 hover:bg-white/80"
                      }`}
                  >
                    <div className={`w-4 h-4 rounded-[4px] flex items-center justify-center border transition-colors shrink-0 ${item.checked ? "bg-matcha-primary border-matcha-primary" : "bg-white border-gray-300"
                      }`}>
                      {item.checked && <span className="text-white text-[10px] font-bold">✓</span>}
                    </div>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleChecklistToggle("optional", item.id)}
                      className="hidden"
                    />
                    <span className="text-base leading-none">{item.icon}</span>
                    <span className={`font-body text-[10px] sm:text-xs font-medium leading-tight truncate ${item.checked ? "text-matcha-dark line-through opacity-70" : "text-gray-700"}`}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Location & Map */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="glass-panel p-6 sm:p-8"
        >
          <div className="text-center mb-6">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-matcha-dark mb-1">
              📍 Lokasi Acara
            </h2>
            <p className="font-body text-sm font-bold text-matcha-primary">Cafe de RURU</p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-sm border border-white mb-4 bg-white p-1">
            <iframe
              src="https://maps.google.com/maps?q=Cafe+de+RURU,+Jl.+Anggrek+No.24,+Merdeka,+Kec.+Sumur+Bandung,+Kota+Bandung,+Jawa+Barat+40113&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="250"
              style={{ border: 0, borderRadius: '0.75rem' }}
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
            className="btn-matcha w-full py-4 flex items-center justify-center gap-2"
          >
            <span>Buka di Google Maps</span>
            <span className="text-lg">🗺️</span>
          </a>
        </motion.div>

        {/* Closing Message */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-matcha-dark rounded-[2rem] p-8 sm:p-10 shadow-xl text-white text-center relative overflow-hidden border border-matcha-primary/30"
        >
          <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-matcha-primary rounded-full mix-blend-screen filter blur-[60px] opacity-40"></div>
          <div className="absolute bottom-[-50%] right-[-10%] w-64 h-64 bg-beige rounded-full mix-blend-screen filter blur-[60px] opacity-20"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <p className="font-heading text-lg sm:text-xl italic mb-6 leading-relaxed relative z-10 font-medium text-cream">
            "Life is like a cup of matcha – a little bitter, a little sweet, but
            always better when shared with the right person."
          </p>
          <div className="w-12 h-1 bg-beige/50 mx-auto rounded-full mb-6 relative z-10"></div>
          <p className="font-accent tracking-widest uppercase text-xs font-bold text-beige relative z-10">
            Can't wait to see you there! Jangan Lupas Save Yaa✨
          </p>
        </motion.div>

        {/* Unblock Request Button */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center mt-2 mb-10"
        >
          <a
            href="https://wa.me/628993538811"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-6 py-3 bg-white/50 backdrop-blur-sm border border-red-200 hover:bg-red-50 hover:border-red-300 rounded-full text-red-500 font-body font-bold text-sm shadow-sm transition-all flex items-center gap-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-red-100 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 z-0"></div>
            <span className="relative z-10">Unblock aku please 🥺🙏 click!</span>
            <span className="relative z-10 text-lg group-hover:animate-bounce">💔</span>
          </a>
        </motion.div>

        {/* Save All Floating Button */}
        <motion.div
          className="fixed bottom-6 left-0 right-0 z-50 px-5 flex justify-center pointer-events-none"
        >
          <div className="pointer-events-auto flex flex-col items-center">
            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className="bg-white/90 backdrop-blur-md text-matcha-dark border border-matcha-200 px-5 py-2.5 rounded-full mb-3 font-body font-bold text-xs shadow-lg flex items-center gap-2"
                >
                  <span className="text-green-500">✓</span> Semua perubahan tersimpan!
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={handleSaveAll}
              disabled={isSavingAll}
              whileHover={{ scale: isSavingAll ? 1 : 1.05 }}
              whileTap={{ scale: isSavingAll ? 1 : 0.95 }}
              className="bg-gradient-to-r from-gray-900 to-gray-800 text-white font-body font-bold px-8 py-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] text-sm flex items-center gap-3 disabled:opacity-50 border border-gray-700"
            >
              {isSavingAll ? (
                "Menyimpan..."
              ) : (
                <>
                  <span>Simpan Perubahan</span>
                  <span className="text-lg">✨</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DetailsPage;
