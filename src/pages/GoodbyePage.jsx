import { motion } from 'framer-motion';
import './GoodbyePage.css';

const GoodbyePage = () => {
  return (
    <div className="goodbye-page">
      <motion.div
        className="goodbye-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="sad-emoji"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          💔
        </motion.div>
        <h1 className="goodbye-title">Oh...</h1>
        <p className="goodbye-text">Okay then.</p>
        <p className="goodbye-subtext">I understand.</p>
      </motion.div>
    </div>
  );
};

export default GoodbyePage;
