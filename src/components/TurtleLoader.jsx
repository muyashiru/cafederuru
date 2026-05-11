import { motion } from "framer-motion";
import "./TurtleLoader.css";

const TurtleLoader = ({ onComplete }) => {
  return (
    <motion.div
      className="turtle-loader-container"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="turtle"
        initial={{ x: "120vw" }}
        animate={{ x: "-120vw" }}
        transition={{
          duration: 3,
          ease: "linear",
        }}
        onAnimationComplete={onComplete}
      >
        <div className="turtle-emoji">🐢</div>
      </motion.div>
      <motion.p
        className="loading-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Loading, Suika mau lewat dulu... 🐢
      </motion.p>
    </motion.div>
  );
};

export default TurtleLoader;
