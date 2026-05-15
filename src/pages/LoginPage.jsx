import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Listbox } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./LoginPage.css";
import { createRSVPEntry } from "../lib/rsvpService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  // This is the date user should remember (last time you kissed)
  const correctDate = new Date("2026-05-01");

  const usernameOptions = [
    { value: "nasywa1", label: "Nasywa Cantik Anak Teknik" },
    { value: "nasywa2", label: "Nasywa Fauziyyah" },
    { value: "nasywa3", label: "Dr. Nasywa Fauziyyah, S.Pd., M.Ars" },
    { value: "nasywa4", label: "Nasywa Tercantik Sedunia" },
    { value: "nasywa5", label: "Calon Ibu Rumah Tangga Idaman" },
    { value: "nasywa6", label: "Nasywa Yang Selalu Benar" },
    { value: "nasywa7", label: "Nasywa Sibuk" },
    { value: "nasywa8", label: "Nasywa Instruktur Senam" },
    { value: "nasywa9", label: "Nasywa Nyebelin" },
    { value: "nasywa10", label: "Nasywa Yang Gampang Laper" },
    { value: "nasywa11", label: "Nasywa Mode Hemat Baterai" },
    { value: "nasywa12", label: "Nasywa Sang Pemilik Hati" },
    { value: "nasywa13", label: "Nasywa Kicau Mania" },
    { value: "nasywa14", label: "My Future Wife" },
    { value: "nasywa15", label: "Nasywa Calon Menteri Keuangan" },
    { value: "nasywa16", label: "Nasywa HMTB" },
    { value: "nasywa17", label: "Nasywa Racing" },
    { value: "nasywa18", label: "Nasywa Fomo" },
    { value: "nasywa19", label: "Nasywa Anak Senja" },
    { value: "nasywa20", label: "Nasywa Nokturnal" },
    { value: "nasywa21", label: "Nasywa Si Paling Gemas" },
    { value: "nasywa22", label: "Nasywa Yang Sering Lupa" },
    { value: "nasywa23", label: "Nasywa Si Tukang Overthinking" },
    { value: "nasywa24", label: "Nasywa Arsitek Masa Depan" },
    { value: "nasywa25", label: "Nasywa Si Paling Wangi" },
    { value: "nasywa26", label: "Nasywa Pencinta Anak Kucing" },
    { value: "nasywa27", label: "Nasywa Telkomsel" },
    { value: "nasywa28", label: "Nasywa Si Paling Sabar" },
    { value: "nasywa29", label: "Nasywa Tukang Tidur Siang" },
    { value: "nasywa30", label: "Kangen seng :(" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!selectedUsername) {
      setErrorMessage("Pilih nama kamu dulu dong! 🥺");
      triggerShake();
      return;
    }

    if (!selectedDate) {
      setErrorMessage("Ga inget kapan terakhir kita ketemu seng? 🤔");
      triggerShake();
      return;
    }

    const selectedDateOnly = new Date(selectedDate.setHours(0, 0, 0, 0));
    const correctDateOnly = new Date(correctDate.setHours(0, 0, 0, 0));

    if (selectedDateOnly.getTime() !== correctDateOnly.getTime()) {
      setErrorMessage("Hmm... coba inget-inget lagi deh 🤔");
      triggerShake();
      return;
    }

    // Create RSVP entry saat login
    // Use today's date as login_date (when they're filling this form)
    const todayDate = new Date().toISOString();
    console.log("📝 Creating RSVP entry for:", selectedUsername?.label);
    console.log("   Login date (today):", todayDate);
    const result = await createRSVPEntry({
      username: selectedUsername?.label,
      loginDate: todayDate,
    });

    if (!result.success) {
      setErrorMessage("Gagal menyimpan data. Coba lagi ya!");
      triggerShake();
      return;
    }

    setTimeout(() => {
      navigate("/motor-choice", {
        state: {
          username: selectedUsername?.label,
          loginDate: selectedDate,
        },
      });
    }, 500);
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
        type: "spring",
        damping: 25,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120 },
    },
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-5 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-1/4 right-8 opacity-60 animate-float z-0 text-3xl">
        🔐
      </div>
      <div className="absolute bottom-1/4 left-8 opacity-50 animate-float-delayed z-0 text-3xl">
        💕
      </div>

      <motion.div
        className={`max-w-[380px] w-full glass-panel px-6 py-8 relative z-10 ${
          isShaking ? "animate-[shake_0.5s_ease-in-out]" : ""
        }`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-6" variants={itemVariants}>
          <div className="w-16 h-16 mx-auto mb-3 bg-white/50 rounded-full flex items-center justify-center border border-white shadow-sm">
            <span className="text-3xl">🕵🏻‍♀️</span>
          </div>
          <h1 className="font-heading text-2xl text-sunset-dark font-bold mb-1">
            Siapa nih yang login?
          </h1>
          <p className="font-body text-xs text-gray-500 font-medium tracking-wide">
            PILIH YANG PALING SESUAI ✨
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          className="space-y-5"
          onSubmit={handleLogin}
          variants={itemVariants}
        >
          {/* Username Dropdown */}
          <div className="space-y-2">
            <label className="block font-body text-xs font-bold text-sunset-dark/80 uppercase tracking-wider ml-1">
              Nama Kamu
            </label>
            <Listbox value={selectedUsername} onChange={setSelectedUsername}>
              <div className="relative">
                <Listbox.Button className="w-full font-body text-sm px-4 py-3.5 glass-input text-left flex items-center justify-between group">
                  <span
                    className={`block truncate ${selectedUsername ? "text-gray-800 font-medium" : "text-gray-400"}`}
                  >
                    {selectedUsername
                      ? selectedUsername.label
                      : "Pilih identitas..."}
                  </span>
                  <span className="pointer-events-none flex items-center text-sunset-primary group-hover:text-sunset-dark transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </Listbox.Button>
                <AnimatePresence>
                  <Listbox.Options className="absolute z-20 w-full mt-2 bg-white/90 backdrop-blur-xl border border-white shadow-xl rounded-2xl max-h-60 overflow-auto focus:outline-none">
                    {usernameOptions.map((option, idx) => (
                      <Listbox.Option
                        key={option.value}
                        value={option}
                        className={({ active }) =>
                          `cursor-pointer select-none relative py-3 px-4 text-sm transition-colors border-b border-gray-100 last:border-0 ${
                            active
                              ? "bg-sunset-50 text-sunset-dark"
                              : "text-gray-700 hover:bg-gray-50"
                          }`
                        }
                      >
                        {({ selected }) => (
                          <span
                            className={`block truncate ${selected ? "font-bold text-sunset-dark" : "font-normal"}`}
                          >
                            {option.label}
                          </span>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </AnimatePresence>
              </div>
            </Listbox>
          </div>

          {/* Date Picker */}
          <div className="space-y-2 relative z-10">
            <label
              htmlFor="date"
              className="block font-body text-[10px] font-bold text-sunset-dark/80 uppercase tracking-wider ml-1"
            >
              When did the last time we kisses?
            </label>
            <DatePicker
              id="date"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd MMMM yyyy"
              placeholderText="Pilih tanggal di kalender..."
              className="w-full font-body text-sm px-4 py-3.5 glass-input text-gray-800 placeholder-gray-400 font-medium"
              maxDate={new Date()}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </div>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-semibold text-center shadow-sm flex items-center justify-center gap-2"
              >
                <span>⚠️</span>
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full font-body font-bold text-sm py-4 px-6 btn-sunset flex items-center justify-center gap-2 mt-4"
          >
            <span>Login Bang</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </motion.button>
        </motion.form>
      </motion.div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
