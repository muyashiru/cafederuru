import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Listbox } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const correctDate = new Date("2026-05-01");

  const usernameOptions = [
    { value: "nasywa1", label: "Nasywa Cantik Anak Teknik" },
    { value: "nasywa2", label: "Nasywa Fauziyyah" },
    { value: "nasywa3", label: "Dr. Nasywa Fauziyyah, S.Pd., M.Ars" },
    { value: "nasywa4", label: "Nasywa Tercantik Sedunia" },
    { value: "nasywa5", label: "Calon Ibu Rumah Tangga Idaman" },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!selectedUsername) {
      setErrorMessage("Pilih nama kamu dulu dong! 🥺");
      triggerShake();
      return;
    }

    if (!selectedDate) {
      setErrorMessage("Inget dong kapan terakhir kita ketemu! 🤔");
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

    setTimeout(() => {
      navigate("/signature", {
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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-cream via-beige to-cream">
      {/* Decorative Top */}
      <div className="absolute top-3 right-3 flex gap-3 opacity-60 z-0">
        <span className="text-lg animate-float">🔐</span>
        <span
          className="text-lg animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          💕
        </span>
      </div>

      <motion.div
        className={`max-w-[380px] w-full bg-white/95 backdrop-blur-lg rounded-3xl px-6 py-5 shadow-[0_10px_40px_rgba(136,176,75,0.2)] border border-matcha-primary/10 relative z-10 ${
          isShaking ? "animate-[shake_0.5s_ease-in-out]" : ""
        }`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header - Compact */}
        <motion.div className="text-center mb-4" variants={itemVariants}>
          <h1 className="font-heading text-2xl text-matcha-primary font-semibold mb-1">
            Siapa nih yang login?🤔
          </h1>
          <p className="font-body text-xs text-gray-600">
            Isi form di bawah ya buat lanjut~
          </p>
        </motion.div>

        {/* Form - Compact */}
        <motion.form
          className="space-y-4"
          onSubmit={handleLogin}
          variants={itemVariants}
        >
          {/* Username Dropdown */}
          <div className="space-y-1.5">
            <label className="block font-body text-[11px] font-semibold text-matcha-dark">
              Siapa nama kamu? ✨
            </label>
            <Listbox value={selectedUsername} onChange={setSelectedUsername}>
              <div className="relative">
                <Listbox.Button className="w-full font-body text-xs px-3 py-2.5 border-2 border-matcha-light rounded-xl bg-white text-gray-700 cursor-pointer transition-all duration-300 outline-none hover:border-matcha-primary focus:border-matcha-primary focus:ring-2 focus:ring-matcha-primary/10 text-left flex items-center justify-between">
                  <span
                    className={
                      selectedUsername ? "text-gray-700" : "text-gray-400"
                    }
                  >
                    {selectedUsername
                      ? selectedUsername.label
                      : "-- Pilih nama kamu --"}
                  </span>
                  <svg
                    className="w-4 h-4 text-matcha-primary"
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
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 w-full mt-1 bg-white border-2 border-matcha-light rounded-xl shadow-lg max-h-48 overflow-auto">
                  {usernameOptions.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      value={option}
                      className={({ active }) =>
                        `cursor-pointer select-none relative py-2 px-3 text-xs ${
                          active
                            ? "bg-matcha-light/20 text-matcha-dark"
                            : "text-gray-700"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <span
                          className={`block truncate ${
                            selected
                              ? "font-semibold text-matcha-dark"
                              : "font-normal"
                          }`}
                        >
                          {option.label}
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label
              htmlFor="date"
              className="block font-body text-[11px] font-semibold text-matcha-dark"
            >
              Kapan terakhir kali kita ketemu? 📅
            </label>
            <DatePicker
              id="date"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd MMMM yyyy"
              placeholderText="Pilih tanggal..."
              className="w-full font-body text-sm px-3 py-2.5 border-2 border-matcha-light rounded-xl bg-white text-gray-700 cursor-pointer transition-all duration-300 outline-none hover:border-matcha-primary focus:border-matcha-primary focus:ring-2 focus:ring-matcha-primary/10"
              maxDate={new Date()}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gradient-to-r from-red-400 to-red-500 text-white px-3 py-2 rounded-lg text-xs font-medium text-center shadow-lg"
              >
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full font-body font-semibold text-sm py-3 px-6 bg-gradient-to-r from-matcha-primary to-matcha-light text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 tracking-wide mt-2"
          >
            Login 🚀
          </motion.button>
        </motion.form>
      </motion.div>

      {/* Decorative Bottom */}
      <div className="absolute bottom-3 left-3 flex gap-3 opacity-60 z-0">
        <span className="text-lg animate-float">🌸</span>
        <span
          className="text-lg animate-float"
          style={{ animationDelay: "0.7s" }}
        >
          💚
        </span>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
