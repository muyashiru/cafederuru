import { motion } from "framer-motion";

const TurtleLoader = ({ onComplete }) => {
  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-cream to-beige flex flex-col items-center justify-center z-[9999] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        initial={{ x: "120vw" }}
        animate={{ x: "-120vw" }}
        transition={{
          duration: 3,
          ease: "linear",
        }}
        onAnimationComplete={onComplete}
      >
        <motion.div
          className="text-7xl md:text-8xl drop-shadow-lg"
          animate={{
            y: [0, -10],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          🐢
        </motion.div>
      </motion.div>
      <motion.p
        className="absolute bottom-[30%] font-body text-base md:text-lg text-matcha-dark font-semibold tracking-wide"
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
