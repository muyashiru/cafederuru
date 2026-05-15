import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { updateMotorChoice } from "../lib/rsvpService";

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
        { icon: "⛽", text: "Hemat Bensin" },
        { icon: "🎒", text: "Bagasi Luas" },
      ],
      cons: [
        { icon: "🚫", text: "Gada Rem" },
        { icon: "🌊", text: "Bergetar" },
      ],
      color: "from-blue-400 to-blue-600",
      hoverColor: "hover:from-blue-500 hover:to-blue-700",
    },
    {
      id: "vario_bapak",
      name: "Vario Bapak",
      emoji: "🛵",
      pros: [
        { icon: "⚡", text: "Flexibel (Bisa ngebut/santai)" },
        { icon: "🔄", text: "Bisa ganti supir" },
        { icon: "🛑", text: "Rem aman" },
      ],
      cons: [
        { icon: "💸", text: "Bensin Mahal" },
      ],
      color: "from-red-400 to-red-600",
      hoverColor: "hover:from-red-500 hover:to-red-700",
    },
  ];

  const handleSelect = (motorId) => {
    setSelectedMotor(motorId);
  };

  const handleSubmit = async () => {
    if (!selectedMotor) {
      alert("Pilih motor dulu dong! 🏍️");
      return;
    }

    setIsSaving(true);

    try {
      const result = await updateMotorChoice(username, selectedMotor);

      if (result.success) {
        // Navigate to SignaturePage with data
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
      console.error("Error saving motor choice:", error);
      alert("Gagal menyimpan pilihan. Coba lagi ya!");
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-beige to-sunset-light/20 relative overflow-hidden font-body">
      {/* Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sunset-primary rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse-soft z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-beige rounded-full mix-blend-multiply filter blur-[120px] opacity-50 z-0" style={{ animationDelay: "1s" }}></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="inline-block mb-4"
            >
              <span className="text-6xl">🏍️</span>
            </motion.div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-sunset-dark mb-2">
              Mau Pakai Motor Siapa Nanti?
            </h1>
            <p className="font-body text-sm sm:text-base text-gray-600">
              Pilih kendaraan yang cocok buat perjalanan kita! 🛣️
            </p>
          </div>

          {/* Motor Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {motors.map((motor, index) => (
              <motion.div
                key={motor.id}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => handleSelect(motor.id)}
                className={`relative cursor-pointer transition-all duration-300 ${
                  selectedMotor === motor.id
                    ? "ring-4 ring-sunset-primary scale-105"
                    : "hover:scale-102"
                }`}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-white/60">
                  {/* Selected Badge */}
                  <AnimatePresence>
                    {selectedMotor === motor.id && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        className="absolute -top-3 -right-3 bg-sunset-primary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-10"
                      >
                        <span className="text-2xl">✓</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Motor Header */}
                  <div className="text-center mb-6">
                    <div className={`inline-block p-4 rounded-2xl bg-gradient-to-br ${motor.color} mb-3 shadow-lg`}>
                      <span className="text-5xl">{motor.emoji}</span>
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-sunset-dark">
                      {motor.name}
                    </h3>
                  </div>

                  {/* Pros */}
                  <div className="mb-4">
                    <h4 className="font-accent text-xs uppercase tracking-wider text-green-600 font-bold mb-2 flex items-center gap-2">
                      <span className="text-lg">✅</span> Kelebihan
                    </h4>
                    <div className="space-y-2">
                      {motor.pros.map((pro, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-green-50 p-2 rounded-lg">
                          <span className="text-base shrink-0">{pro.icon}</span>
                          <span className="font-body text-sm text-gray-700">{pro.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cons */}
                  <div>
                    <h4 className="font-accent text-xs uppercase tracking-wider text-red-600 font-bold mb-2 flex items-center gap-2">
                      <span className="text-lg">❌</span> Kekurangan
                    </h4>
                    <div className="space-y-2">
                      {motor.cons.map((con, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-red-50 p-2 rounded-lg">
                          <span className="text-base shrink-0">{con.icon}</span>
                          <span className="font-body text-sm text-gray-700">{con.text}</span>
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
            className="text-center"
          >
            <button
              onClick={handleSubmit}
              disabled={!selectedMotor || isSaving}
              className={`
                px-8 py-4 rounded-full font-heading font-bold text-lg
                transition-all duration-300 shadow-xl
                ${
                  !selectedMotor || isSaving
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-sunset-primary to-sunset-dark text-white hover:scale-105 hover:shadow-2xl"
                }
              `}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Menyimpan...
                </span>
              ) : (
                "Lanjut! 🚀"
              )}
            </button>

            {selectedMotor && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-sm text-gray-600 font-body"
              >
                Kamu pilih: <span className="font-bold text-sunset-dark">
                  {motors.find(m => m.id === selectedMotor)?.name}
                </span> 🏍️
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default MotorChoicePage;
