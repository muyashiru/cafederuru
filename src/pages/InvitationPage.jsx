import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TurtleLoader from "../components/TurtleLoader";
import { saveRejection } from "../lib/rsvpService";

const InvitationPage = () => {
  const navigate = useNavigate();
  const [timeTogether, setTimeTogether] = useState({
    years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0
  });
  const [showLoading, setShowLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const startDate = new Date("2022-11-19T00:00:00");
      const now = new Date();

      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();
      let hours = now.getHours() - startDate.getHours();
      let minutes = now.getMinutes() - startDate.getMinutes();
      let seconds = now.getSeconds() - startDate.getSeconds();

      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }
      if (minutes < 0) {
        minutes += 60;
        hours--;
      }
      if (hours < 0) {
        hours += 24;
        days--;
      }
      if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }

      setTimeTogether({ years, months, days, hours, minutes, seconds });
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
                className="w-20 h-20 mb-4 bg-sunset-100 rounded-[1.5rem] rotate-3 flex items-center justify-center shadow-inner border-2 border-white"
                variants={itemVariants}
                whileHover={{ rotate: 12, scale: 1.05 }}
              >
                <span className="text-4xl animate-pulse-soft">💌</span>
              </motion.div>

              {/* Title */}
              <motion.div className="text-center mb-4" variants={itemVariants}>
                <h1 className="font-heading text-4xl text-sunset-dark tracking-wide mb-1 font-bold">
                  SUKORO
                </h1>
                <p className="font-accent text-[11px] text-sunset-primary tracking-[0.2em] font-medium uppercase">
                  Surat Undangan Kopi Romantis
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
                <p className="font-body text-[11px] text-gray-600 leading-relaxed">
                  It's been{" "}
                  <span className="font-bold text-sunset-dark bg-sunset-100 px-1.5 py-0.5 rounded-md">{timeTogether.years}</span> years{" "}
                  <span className="font-bold text-sunset-dark bg-sunset-100 px-1.5 py-0.5 rounded-md">{timeTogether.months}</span> months{" "}
                  <span className="font-bold text-sunset-dark bg-sunset-100 px-1.5 py-0.5 rounded-md">{timeTogether.days}</span> days{" "}
                  <span className="font-bold text-sunset-dark bg-sunset-100 px-1.5 py-0.5 rounded-md">{timeTogether.hours}</span> hours{" "}
                  <span className="font-bold text-sunset-dark bg-sunset-100 px-1.5 py-0.5 rounded-md">{timeTogether.minutes}</span> minutes{" "}
                  <span className="font-bold text-sunset-dark bg-sunset-100 px-1.5 py-0.5 rounded-md">{timeTogether.seconds}</span> seconds us together.
                </p>
                <p className="font-body text-[11px] text-gray-600 leading-relaxed">
                  Tomorrow maybe will be the new begining for out relationship cuz maybe we have to talk about lot of things, and I ask you for a date at Kopi Romantis.
                </p>
              </motion.div>

              {/* Question */}
              <motion.div
                className="text-center w-full mb-6"
                variants={itemVariants}
              >
                <h2 className="font-heading text-base text-gray-800 font-bold leading-relaxed px-2">
                  Will you attend this invitation? 🥺
                </h2>
              </motion.div>

              {/* Buttons */}
              <motion.div
                className="flex flex-col gap-3 w-full"
                variants={itemVariants}
              >
                <button
                  onClick={handleYesClick}
                  className="w-full py-3.5 px-6 btn-sunset flex items-center justify-center gap-2"
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
