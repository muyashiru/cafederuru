import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { updateMotorChoiceOnly } from "../lib/rsvpService";

const MotorChoicePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMotor, setSelectedMotor] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Get data from LoginPage
  const { username, loginDate } = location.state || {};

  // Redirect if no data
  if (!username || !loginDate) {
    navigate("/login");
    return null;
  }

  const motors = [
    {
      id: "supra_geter",
      name: "Supra Geter",
      emoji: "🏍️",
      pros: [
        { icon: "🐢", text: "Jalannya santai" },
        { icon: "⛽", text: "Hemat bensin" },
        { icon: "🎒", text: "Bagasi luas" },
      ],
      cons: [
        { icon: "🚫", text: "Gak ada rem" },
        { icon: "🌊", text: "Agak bergetar" },
      ],
      theme: "blue",
    },
    {
      id: "vario_bapak",
      name: "Vario Bapak",
      emoji: "🛵",
      pros: [
        { icon: "⚡", text: "Bisa ngebut/santai" },
        { icon: "🔄", text: "Bisa ganti supir" },
        { icon: "🛑", text: "Rem pakem & aman" },
      ],
      cons: [{ icon: "💸", text: "Bensin lumayan" }],
      theme: "red",
    },
  ];

  const handleSelect = (motorId) => {
    setSelectedMotor(motorId);
  };

  const handleSubmit = async () => {
    if (!selectedMotor) {
      alert("Pilih motor dulu dong! 🛵");
      return;
    }

    setIsSaving(true);

    try {
      console.log("🚵 Updating motor choice:", { username, selectedMotor });
      const result = await updateMotorChoiceOnly(username, selectedMotor);

      console.log("🔍 Update result:", result);

      if (result.success) {
        console.log("✅ Motor choice updated, navigating to signature page");
        navigate("/signature", {
          state: {
            username,
            loginDate,
            motorChoice: selectedMotor,
          },
        });
      } else {
        throw new Error(result.error || "Failed to save motor choice");
      }
    } catch (error) {
      console.error("❌ Error saving motor choice:", error);
      alert("Gagal menyimpan pilihan. Coba lagi ya!");
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-beige to-sunset-100 relative overflow-hidden font-body text-gray-800">
      {/* Soft Background Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sunset-primary rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-pulse-soft z-0 pointer-events-none"></div>
      <div
        className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-white rounded-full mix-blend-overlay filter blur-[100px] opacity-60 z-0 pointer-events-none"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="inline-block mb-4 p-4 rounded-3xl bg-white/60 shadow-glass border border-white/60 backdrop-blur-sm"
            >
              <span className="text-4xl block">🛵</span>
            </motion.div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-800 mb-3 tracking-tight">
              Pilih Kendaraan
            </h1>
            <p className="font-body text-sm sm:text-base text-gray-600 max-w-sm mx-auto">
              Tentukan motor apa yang bakal nemenin perjalanan kita nanti! ✨
            </p>
          </div>

          {/* Motor Cards */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-10 max-w-2xl mx-auto">
            {motors.map((motor, index) => (
              <motion.div
                key={motor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => handleSelect(motor.id)}
                className={`relative cursor-pointer transition-all duration-300 ease-out ${
                  selectedMotor === motor.id
                    ? "scale-[1.02] -translate-y-1"
                    : "hover:scale-[1.01] hover:-translate-y-0.5 opacity-90 hover:opacity-100"
                }`}
              >
                <div
                  className={`bg-white/80 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-glass transition-all duration-300 h-full flex flex-col border-2 ${
                    selectedMotor === motor.id
                      ? "border-sunset-dark shadow-glass-hover"
                      : "border-transparent hover:border-white/60"
                  }`}
                >
                  {/* Selected Badge */}
                  <AnimatePresence>
                    {selectedMotor === motor.id && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-3 -right-3 bg-sunset-dark text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Motor Header */}
                  <div className="text-center mb-6">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-sm transition-colors ${
                        motor.theme === "blue"
                          ? "bg-blue-50/80 text-blue-500"
                          : "bg-red-50/80 text-red-500"
                      }`}
                    >
                      <span className="text-4xl block">{motor.emoji}</span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-gray-800">
                      {motor.name}
                    </h3>
                  </div>

                  {/* Pros */}
                  <div className="mb-5 flex-1">
                    <h4 className="font-accent text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-gray-400 font-semibold mb-3 text-center">
                      Kelebihan
                    </h4>
                    <div className="space-y-3">
                      {motor.pros.map((pro, idx) => (
                        <div key={idx} className="flex items-start gap-3 px-2">
                          <span className="text-sm shrink-0 leading-tight grayscale opacity-80">
                            {pro.icon}
                          </span>
                          <span className="font-body text-xs text-gray-600 leading-snug font-medium">
                            {pro.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cons */}
                  <div className="mt-auto pt-5 border-t border-gray-200/50">
                    <h4 className="font-accent text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-gray-400 font-semibold mb-3 text-center">
                      Kekurangan
                    </h4>
                    <div className="space-y-3">
                      {motor.cons.map((con, idx) => (
                        <div key={idx} className="flex items-start gap-3 px-2">
                          <span className="text-sm shrink-0 leading-tight grayscale opacity-80">
                            {con.icon}
                          </span>
                          <span className="font-body text-xs text-gray-600 leading-snug font-medium">
                            {con.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full text-center max-w-sm mx-auto"
          >
            <AnimatePresence mode="wait">
              {selectedMotor && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 text-sm text-gray-600 font-body"
                >
                  Kamu pilih:{" "}
                  <span className="font-bold text-sunset-dark">
                    {motors.find((m) => m.id === selectedMotor)?.name}
                  </span>{" "}
                  ✨
                </motion.p>
              )}
            </AnimatePresence>

            <button
              onClick={handleSubmit}
              disabled={!selectedMotor || isSaving}
              className={`
                w-full px-8 py-3.5 rounded-2xl font-heading font-bold text-base
                transition-all duration-300 shadow-glass flex items-center justify-center gap-2
                ${
                  !selectedMotor || isSaving
                    ? "bg-white/50 text-gray-400 cursor-not-allowed border border-gray-200"
                    : "bg-gradient-to-r from-sunset-primary to-sunset-dark text-white hover:shadow-glass-hover hover:-translate-y-0.5"
                }
              `}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Menyimpan...
                </>
              ) : (
                "Lanjut! 🚀"
              )}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default MotorChoicePage;
