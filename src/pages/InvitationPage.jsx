import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TurtleLoader from "../components/TurtleLoader";
import { saveRejection } from "../lib/rsvpService";

const InvitationPage = () => {
  const navigate = useNavigate();
  const [minutesSinceLastMeet, setMinutesSinceLastMeet] = useState(0);
  const [secondsSinceLastMeet, setSecondsSinceLastMeet] = useState(0);
  const [showLoading, setShowLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const lastMeetDate = new Date("2026-05-01T20:00:00");
      const now = new Date();
      const diffInMs = now - lastMeetDate;
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInSeconds = Math.floor((diffInMs % (1000 * 60)) / 1000);
      setMinutesSinceLastMeet(diffInMinutes);
      setSecondsSinceLastMeet(diffInSeconds);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleYesClick = () => {
    setShowLoading(true);
  };

  const handleLoadingComplete = () => {
    navigate("/login");
  };

  const handleNoClick = async () => {
    setIsDeleting(true);
    await saveRejection();
    navigate("/goodbye", { replace: true });
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
        type: "spring",
        stiffness: 150,
        damping: 20
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoading ? (
          <TurtleLoader key="loader" onComplete={handleLoadingComplete} />
        ) : (
          <div
            key="content"
            className="h-screen w-full flex flex-col items-center justify-center p-5 relative overflow-hidden"
          >
            {/* Background Floating Elements */}
            <div className="absolute top-10 right-10 opacity-70 animate-float-delayed z-0 text-3xl">🍵</div>
            <div className="absolute bottom-20 left-10 opacity-60 animate-float z-0 text-2xl">✨</div>
            <div className="absolute top-1/4 left-5 opacity-40 animate-float-delayed z-0 text-4xl">🍃</div>
            <div className="absolute bottom-1/3 right-5 opacity-50 animate-float z-0 text-3xl">💚</div>

            <motion.div
              className="max-w-[380px] w-full glass-panel px-6 py-8 relative z-10 flex flex-col items-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Profile / Avatar Graphic */}
              <motion.div
                className="w-20 h-20 mb-4 bg-matcha-100 rounded-[1.5rem] rotate-3 flex items-center justify-center shadow-inner border-2 border-white"
                variants={itemVariants}
                whileHover={{ rotate: 12, scale: 1.05 }}
              >
                <span className="text-4xl animate-pulse-soft">💌</span>
              </motion.div>

              {/* Title */}
              <motion.div className="text-center mb-4" variants={itemVariants}>
                <h1 className="font-heading text-4xl text-matcha-dark tracking-wide mb-1 font-bold">
                  SUKMA
                </h1>
                <p className="font-accent text-[11px] text-matcha-primary tracking-[0.2em] font-medium uppercase">
                  Surat Undangan Kafe Matcha
                </p>
              </motion.div>

              {/* Message */}
              <motion.div
                className="text-center w-full space-y-3 mb-6 bg-white/40 p-4 rounded-2xl border border-white/50 shadow-inner"
                variants={itemVariants}
              >
                <p className="font-heading text-sm font-semibold text-gray-800">
                  Hawow seng, how's ur day? ✨
                </p>
                <p className="font-body text-xs text-gray-600 leading-relaxed">
                  We haven't met for{" "}
                  <span className="font-bold text-matcha-dark bg-matcha-100 px-1.5 py-0.5 rounded-md">
                    {minutesSinceLastMeet.toLocaleString()}
                  </span>{" "}
                  minutes and{" "}
                  <span className="font-bold text-matcha-dark bg-matcha-100 px-1.5 py-0.5 rounded-md">
                    {secondsSinceLastMeet}
                  </span>{" "}
                  seconds.
                </p>
                <p className="font-body text-xs text-gray-600 leading-relaxed">
                  I still remember that you wish we had a study date at Cafe de
                  RURU... shall we? :D
                </p>
              </motion.div>

              {/* Question */}
              <motion.div
                className="text-center w-full mb-6"
                variants={itemVariants}
              >
                <h2 className="font-heading text-base text-gray-800 font-bold leading-relaxed px-2">
                  Will you attend this special date at Cafe de RURU on 14 April? 🥺
                </h2>
              </motion.div>

              {/* Buttons */}
              <motion.div
                className="flex flex-col gap-3 w-full"
                variants={itemVariants}
              >
                <button
                  onClick={handleYesClick}
                  className="w-full py-3.5 px-6 btn-matcha flex items-center justify-center gap-2"
                >
                  <span>Yes, I will attend!</span>
                  <span className="text-lg">✨</span>
                </button>

                <button
                  onClick={handleNoClick}
                  disabled={isDeleting}
                  className="w-full py-3.5 px-6 bg-white/70 text-gray-600 font-semibold rounded-2xl border-2 border-transparent hover:border-softpink hover:bg-softpink/20 hover:text-red-500 transition-all duration-300 font-body text-sm disabled:opacity-50"
                >
                  {isDeleting ? "Processing..." : "No (delete this website)"}
                </button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InvitationPage;
