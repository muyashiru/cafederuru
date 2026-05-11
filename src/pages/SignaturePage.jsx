import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import { saveRSVP } from "../lib/rsvpService";
import TurtleLoader from "../components/TurtleLoader";

const SignaturePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const signatureRef = useRef(null);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Get data from LoginPage
  const { username, loginDate } = location.state || {};

  // Redirect if no data
  if (!username || !loginDate) {
    navigate("/login");
    return null;
  }

  const handleClear = () => {
    signatureRef.current?.clear();
    setError("");
  };

  const handleSubmit = async () => {
    // Check if signature is empty
    if (signatureRef.current?.isEmpty()) {
      setError("Tanda tangan dulu dong! 🥺");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      // Get signature as base64
      const signatureImage = signatureRef.current?.toDataURL();

      // Save to Supabase
      const result = await saveRSVP({
        username,
        loginDate,
        signatureImage,
      });

      if (result.success) {
        console.log("✅ Data saved successfully!", result.data);

        // Save username to localStorage for DetailsPage
        localStorage.setItem("username", username);

        // Wait for loading animation, then navigate
        setTimeout(() => {
          navigate("/details", {
            state: {
              username,
              savedData: result.data,
            },
          });
        }, 3000); // 3 seconds for loading animation
      } else {
        throw new Error(result.error || "Failed to save data");
      }
    } catch (err) {
      console.error("Error saving RSVP:", err);
      setError("Gagal menyimpan data. Coba lagi ya! 😢");
      setIsSaving(false);
    }
  };

  const handleBegin = () => {
    setError("");
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  // Show loading animation while saving
  if (isSaving) {
    return <TurtleLoader onComplete={() => {}} />;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-cream via-beige to-cream">
      {/* Decorative Top */}
      <div className="absolute top-3 right-3 flex gap-3 opacity-60 z-0">
        <span className="text-lg animate-float">✍️</span>
        <span
          className="text-lg animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          💚
        </span>
      </div>

      <motion.div
        className="max-w-[380px] w-full bg-white/95 backdrop-blur-lg rounded-3xl px-6 py-6 shadow-[0_10px_40px_rgba(136,176,75,0.2)] border border-matcha-primary/10 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-4" variants={itemVariants}>
          <h1 className="font-heading text-2xl text-matcha-primary font-semibold mb-1">
            Tanda Tangan ✍️
          </h1>
          <p className="font-body text-xs text-gray-600">
            Tanda tangani di sini untuk konfirmasi kehadiran kamu ya! 💕
          </p>
        </motion.div>

        {/* Signature Canvas */}
        <motion.div className="mb-4" variants={itemVariants}>
          <div className="border-2 border-dashed border-matcha-light rounded-xl overflow-hidden bg-white">
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                className: "w-full h-48 cursor-crosshair",
              }}
              onBegin={handleBegin}
              backgroundColor="transparent"
              penColor="#6B8E3D"
            />
          </div>
          <p className="text-[10px] text-gray-500 text-center mt-2 italic">
            Gambar tanda tangan kamu di kotak di atas
          </p>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-gradient-to-r from-red-400 to-red-500 text-white px-3 py-2 rounded-lg text-xs font-medium text-center shadow-lg mb-3"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Card */}
        <motion.div
          className="bg-matcha-light/10 rounded-xl p-3 mb-4 border border-matcha-light/30"
          variants={itemVariants}
        >
          <p className="text-xs text-matcha-dark mb-1">
            <span className="font-semibold">Nama:</span> {username}
          </p>
          <p className="text-xs text-matcha-dark">
            <span className="font-semibold">Tanggal:</span>{" "}
            {new Date(loginDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div className="flex gap-3" variants={itemVariants}>
          <motion.button
            onClick={handleClear}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3 px-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm rounded-xl hover:border-gray-400 transition-all duration-300 font-body"
          >
            Clear 🗑️
          </motion.button>

          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-matcha-primary to-matcha-light text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-body"
          >
            Submit 🚀
          </motion.button>
        </motion.div>

        {/* Hint */}
        <motion.p
          className="text-center text-[10px] text-matcha-dark italic opacity-80 mt-3"
          variants={itemVariants}
        >
          Data akan tersimpan dengan aman di database ✅
        </motion.p>
      </motion.div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-3 left-3 flex gap-3 opacity-60 z-0">
        <span className="text-lg animate-float">📝</span>
        <span
          className="text-lg animate-float"
          style={{ animationDelay: "0.7s" }}
        >
          💚
        </span>
      </div>
    </div>
  );
};

export default SignaturePage;
