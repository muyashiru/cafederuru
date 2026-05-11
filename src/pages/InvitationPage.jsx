import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./InvitationPage.css";

const InvitationPage = () => {
  const navigate = useNavigate();
  const [minutesSinceLastMeet, setMinutesSinceLastMeet] = useState(0);
  const [secondsSinceLastMeet, setSecondsSinceLastMeet] = useState(0);

  useEffect(() => {
    // Calculate minutes and seconds since May 1st, 2025, 8 PM
    const calculateTime = () => {
      const lastMeetDate = new Date("2025-05-01T20:00:00"); // 1 Mei 2025, 8 PM
      const now = new Date();
      const diffInMs = now - lastMeetDate;
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInSeconds = Math.floor((diffInMs % (1000 * 60)) / 1000);
      setMinutesSinceLastMeet(diffInMinutes);
      setSecondsSinceLastMeet(diffInSeconds);
    };

    calculateTime();
    // Update every second
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleYesClick = () => {
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  const handleNoClick = () => {
    navigate("/goodbye");
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  // Text animation variants
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
    <div className="invitation-page">
      {/* Decorative Elements */}
      <div className="decoration-top">
        <span className="emoji">🍵</span>
        <span className="emoji">✨</span>
        <span className="emoji">💚</span>
      </div>

      <motion.div
        className="invitation-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Title */}
        <motion.div className="title-section" variants={itemVariants}>
          <h1 className="main-title cute-heading">SUKMA</h1>
          <p className="subtitle">(Surat Undangan Kafe Matcha)</p>
        </motion.div>

        {/* Divider */}
        <motion.div className="divider" variants={itemVariants}>
          <div className="divider-line"></div>
          <span className="divider-icon">☕</span>
          <div className="divider-line"></div>
        </motion.div>

        {/* Personal Message */}
        <motion.div className="message-section" variants={itemVariants}>
          <p className="message-text greeting">Hallo seng, how's ur day? 💕</p>
          <p className="message-text">
            We haven't meet for{" "}
            <span className="highlight-number">
              {minutesSinceLastMeet.toLocaleString()}
            </span>{" "}
            minute and{" "}
            <span className="highlight-number">{secondsSinceLastMeet}</span>{" "}
            second
          </p>
          <p className="message-text">
            I still remember that you wish we had a study date at Cafe de RURU,
            so...
          </p>
        </motion.div>

        {/* Question Section */}
        <motion.div className="question-section" variants={itemVariants}>
          <h2 className="question cute-heading">
            Will you attend this special date at Cafe de RURU? ☕✨
          </h2>
        </motion.div>

        {/* Buttons Section */}
        <motion.div className="buttons-container" variants={itemVariants}>
          <motion.button
            className="btn btn-yes"
            onClick={handleYesClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Yes, Give Me The Details! ✨
          </motion.button>

          <motion.button
            className="btn btn-no"
            onClick={handleNoClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            No, Thank You 💔
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Decorative Bottom */}
      <div className="decoration-bottom">
        <span className="emoji">🌿</span>
        <span className="emoji">💚</span>
        <span className="emoji">🍃</span>
      </div>
    </div>
  );
};

export default InvitationPage;
