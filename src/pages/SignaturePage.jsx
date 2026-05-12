import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import { saveRSVP } from "../lib/rsvpService";
import TurtleLoader from "../components/TurtleLoader";

const SignaturePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const signatureRef = useRef(null);
  const videoRef = useRef(null);

  const [step, setStep] = useState(1); // 1 = Signature, 2 = Face Verification
  const [isSaving, setIsSaving] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [showJumpscare, setShowJumpscare] = useState(false);
  const [error, setError] = useState("");

  // Get data from LoginPage
  const { username, loginDate } = location.state || {};

  // Redirect if no data
  useEffect(() => {
    if (!username || !loginDate) {
      navigate("/login");
    }
  }, [username, loginDate, navigate]);

  // Handle Camera Access for Step 2
  useEffect(() => {
    let stream = null;
    if (step === 2) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.error("Camera error:", err);
          setError("Kamera gak bisa diakses. Kita skip verifikasi ya! 😢");
          setTimeout(() => handleFinalSubmit(), 2000);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleClear = () => {
    signatureRef.current?.clear();
    setError("");
  };

  const handleSignatureSubmit = () => {
    if (signatureRef.current?.isEmpty()) {
      setError("Tanda tangan dulu dong! 🥺");
      return;
    }
    setError("");
    setStep(2); // Proceed to Face Verification
  };

  const captureFace = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      // Mirror the image to match what the user sees
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/png");
    }
    return null;
  };

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate 3s scan, capture image at the end
    setTimeout(() => {
      const capturedFace = captureFace();
      setIsScanning(false);
      setScanComplete(true);
      
      // Wait 1s so they see the success checkmark
      setTimeout(() => {
        // Boom! Trigger jumpscare
        setShowJumpscare(true);
        
        // Start uploading in the background while jumpscare covers the screen
        handleFinalSubmit(capturedFace);
      }, 1000);
    }, 3000);
  };

  const handleFinalSubmit = async (capturedFace = null) => {
    setIsSaving(true);
    setError("");

    try {
      const signatureImage = signatureRef.current?.toDataURL();

      const result = await saveRSVP({
        username,
        loginDate,
        signatureImage,
        faceImage: capturedFace,
      });

      if (result.success) {
        localStorage.setItem("username", username);

        setTimeout(() => {
          navigate("/details", {
            state: {
              username,
              savedData: result.data,
            },
          });
        }, 3000);
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
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        type: "spring",
        bounce: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (isSaving && !showJumpscare) {
    return <TurtleLoader onComplete={() => {}} />;
  }

  if (!username) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-cream font-body">
      {/* Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-matcha-primary rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse-soft z-0 pointer-events-none"></div>
      <div
        className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-beige rounded-full mix-blend-multiply filter blur-[120px] opacity-50 z-0 pointer-events-none"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Decorative Floating Elements */}
      <div className="fixed top-10 right-10 flex gap-3 opacity-60 z-0 pointer-events-none">
        <span className="text-2xl animate-float">✍️</span>
        <span className="text-2xl animate-float-delayed">✨</span>
      </div>
      <div className="fixed bottom-10 left-10 flex gap-3 opacity-60 z-0 pointer-events-none">
        <span className="text-2xl animate-float-delayed">📝</span>
        <span className="text-2xl animate-float">💚</span>
      </div>

      <motion.div
        className="max-w-[400px] w-full bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 shadow-glass border border-white/80 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {step === 1 ? (
          // ================= STEP 1: SIGNATURE =================
          <>
            {/* Header */}
            <motion.div className="text-center mb-6" variants={itemVariants}>
              <div className="inline-block p-2 bg-beige/30 rounded-xl mb-3 border border-beige/50 -rotate-3">
                <span className="text-2xl">📝</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl text-matcha-dark font-bold mb-2">
                Tanda Tangan
              </h1>
              <p className="font-body text-xs sm:text-sm text-gray-600">
                Tanda tangani di sini sebagai bukti komitmen kehadiran kamu ya! 💕
              </p>
            </motion.div>

            {/* Signature Canvas */}
            <motion.div className="mb-6" variants={itemVariants}>
              <div className="border-2 border-dashed border-matcha-primary/30 rounded-2xl overflow-hidden bg-white/80 shadow-inner relative group transition-colors hover:border-matcha-primary/60">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    className: "w-full h-48 cursor-crosshair",
                  }}
                  onBegin={handleBegin}
                  backgroundColor="transparent"
                  penColor="#546B41"
                />
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30 group-hover:opacity-10 transition-opacity">
                  <span className="font-heading text-4xl text-matcha-primary">✍️</span>
                </div>
              </div>
              <p className="font-accent tracking-widest uppercase text-[10px] text-gray-500 text-center mt-3 font-semibold">
                Gambar tanda tangan di dalam kotak
              </p>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="bg-red-50 text-red-500 border border-red-200 px-4 py-3 rounded-xl text-xs font-semibold text-center shadow-sm mb-4"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info Card */}
            <motion.div
              className="bg-white/40 rounded-xl p-4 mb-6 border border-white/60 shadow-sm"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/50">
                <span className="font-accent text-[10px] uppercase tracking-wider text-matcha-primary font-bold">
                  Nama
                </span>
                <span className="font-heading font-bold text-matcha-dark text-sm">
                  {username}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-accent text-[10px] uppercase tracking-wider text-matcha-primary font-bold">
                  Tanggal
                </span>
                <span className="font-body font-medium text-gray-700 text-xs">
                  {new Date(loginDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div className="flex gap-3" variants={itemVariants}>
              <motion.button
                onClick={handleClear}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 px-4 bg-white/50 border border-gray-300 text-gray-600 font-bold text-sm rounded-xl hover:bg-white hover:text-gray-800 transition-all shadow-sm font-body"
              >
                Bersihkan
              </motion.button>

              <motion.button
                onClick={handleSignatureSubmit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 px-4 bg-matcha-primary text-white font-bold text-sm rounded-xl shadow-md hover:bg-matcha-dark transition-all font-body"
              >
                Lanjut 👉
              </motion.button>
            </motion.div>
          </>
        ) : (
          // ================= STEP 2: FACE VERIFICATION =================
          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <div className="text-center mb-6">
              <h1 className="font-heading text-2xl sm:text-3xl text-matcha-dark font-bold mb-2">
                Face Verification
              </h1>
              <p className="font-body text-xs sm:text-sm text-gray-600">
                {scanComplete
                  ? "Verifikasi Berhasil! 100% Valid ✨"
                  : "Posisikan wajah cantikmu di kamera 📸"}
              </p>
            </div>

            {/* Camera View */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-white shadow-glass mb-8 bg-black/5">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />

              {/* Scanning Animation Line */}
              {isScanning && (
                <motion.div
                  className="absolute left-0 w-full h-1.5 bg-matcha-primary shadow-[0_0_20px_rgba(153,173,122,1)] z-20"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}

              {/* Scanning Glow */}
              {isScanning && (
                <div className="absolute inset-0 bg-matcha-primary/20 animate-pulse z-10 pointer-events-none"></div>
              )}

              {/* Success Overlay */}
              {scanComplete && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-sm z-30"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.6 }}
                    className="bg-matcha-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg"
                  >
                    ✓
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="bg-red-50 text-red-500 border border-red-200 px-4 py-3 rounded-xl text-xs font-semibold text-center shadow-sm mb-4 w-full"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

        {/* Action Buttons */}
            {!isScanning && !scanComplete && !error && (
              <motion.button
                onClick={handleScan}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-matcha-primary text-white font-bold text-sm rounded-xl shadow-md hover:bg-matcha-dark transition-all font-body"
              >
                Mulai Verifikasi 🔍
              </motion.button>
            )}

            {isScanning && (
              <p className="font-accent text-xs font-bold text-matcha-primary animate-pulse tracking-widest uppercase">
                Scanning facial features...
              </p>
            )}
            
            {scanComplete && !showJumpscare && (
              <p className="font-accent text-xs font-bold text-matcha-primary tracking-widest uppercase">
                Identity Confirmed 💖
              </p>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Jumpscare Overlay */}
      <AnimatePresence>
        {showJumpscare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden pointer-events-none"
          >
            <motion.img
              src="/WhatsApp%20Image%202026-05-12%20at%2015.44.25.jpeg"
              alt="Jumpscare"
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignaturePage;
