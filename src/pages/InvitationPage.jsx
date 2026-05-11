import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TurtleLoader from "../components/TurtleLoader";

const InvitationPage = () => {
  const navigate = useNavigate();
  const [minutesSinceLastMeet, setMinutesSinceLastMeet] = useState(0);
  const [secondsSinceLastMeet, setSecondsSinceLastMeet] = useState(0);
  const [showLoading, setShowLoading] = useState(false);

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

  const handleNoClick = () => {
    navigate("/goodbye");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
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
            className="h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-cream via-beige to-cream"
          >
            {/* Decorative Elements - Smaller */}
            <div className="absolute top-3 right-3 flex gap-3 opacity-60 z-0">
              <span className="text-lg animate-float">🍵</span>
              <span
                className="text-lg animate-float"
                style={{ animationDelay: "0.5s" }}
              >
                ✨
              </span>
              <span
                className="text-lg animate-float"
                style={{ animationDelay: "1s" }}
              >
                💚
              </span>
            </div>

            <motion.div
              className="max-w-[380px] w-full bg-white/95 backdrop-blur-lg rounded-3xl px-6 py-6 shadow-[0_10px_40px_rgba(136,176,75,0.2)] border border-matcha-primary/10 relative z-10 flex flex-col"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Title - Compact */}
              <motion.div className="text-center mb-3" variants={itemVariants}>
                <h1 className="font-heading text-4xl text-matcha-primary tracking-[3px] mb-1 font-semibold drop-shadow-lg animate-pulse">
                  SUKMA
                </h1>
                <p className="font-body text-[10px] text-matcha-dark tracking-wider">
                  (Surat Undangan Kafe Matcha)
                </p>
              </motion.div>

              {/* Divider - Compact */}
              <motion.div
                className="flex items-center gap-2 my-3"
                variants={itemVariants}
              >
                <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-matcha-light to-transparent"></div>
                <span
                  className="text-base animate-spin"
                  style={{ animationDuration: "4s" }}
                >
                  ☕
                </span>
                <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-matcha-light to-transparent"></div>
              </motion.div>

              {/* Message - Compact */}
              <motion.div
                className="text-center mb-3 space-y-2"
                variants={itemVariants}
              >
                <p className="font-heading text-sm font-medium text-matcha-dark">
                  Hallo seng, how's ur day? 💕
                </p>
                <p className="font-body text-xs text-gray-600 leading-relaxed">
                  We haven't meet for{" "}
                  <span className="font-bold text-sm text-gradient-matcha">
                    {minutesSinceLastMeet.toLocaleString()}
                  </span>{" "}
                  minute and{" "}
                  <span className="font-bold text-sm text-gradient-matcha">
                    {secondsSinceLastMeet}
                  </span>{" "}
                  second
                </p>
                <p className="font-body text-xs text-gray-600 leading-relaxed">
                  I still remember that you wish we had a study date at Cafe de
                  RURU, so...
                </p>
              </motion.div>

              {/* Question - Compact */}
              <motion.div
                className="text-center my-3 p-3 bg-gradient-to-br from-matcha-light/10 to-peach/10 rounded-xl border-2 border-dashed border-matcha-light"
                variants={itemVariants}
              >
                <h2 className="font-heading text-sm text-matcha-dark font-medium leading-relaxed">
                  Will you attend this special date at Cafe de RURU? ☕✨
                </h2>
              </motion.div>

              {/* Buttons - Compact */}
              <motion.div
                className="flex flex-col gap-2.5 mt-3"
                variants={itemVariants}
              >
                <motion.button
                  onClick={handleYesClick}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 px-6 bg-gradient-to-r from-matcha-primary to-matcha-light text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-body tracking-wide"
                >
                  Yes, Give Me The Details! ✨
                </motion.button>

                <motion.button
                  onClick={handleNoClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 px-6 bg-gradient-to-r from-softpink to-peach text-gray-800 font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-body tracking-wide"
                >
                  No, Thank You 💔
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Bottom Decoration - Smaller */}
            <div className="absolute bottom-3 left-3 flex gap-3 opacity-60 z-0">
              <span
                className="text-lg animate-float"
                style={{ animationDelay: "0s" }}
              >
                🌿
              </span>
              <span
                className="text-lg animate-float"
                style={{ animationDelay: "0.7s" }}
              >
                💚
              </span>
              <span
                className="text-lg animate-float"
                style={{ animationDelay: "1.2s" }}
              >
                🍃
              </span>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InvitationPage;
