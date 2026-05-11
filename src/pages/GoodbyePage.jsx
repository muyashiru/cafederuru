import { motion } from "framer-motion";

const GoodbyePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-100 p-5">
      <motion.div
        className="text-center p-12 md:p-16 bg-white rounded-3xl shadow-xl max-w-md w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-7xl md:text-8xl mb-6 grayscale-[20%]"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          💔
        </motion.div>
        <h1 className="font-heading text-4xl md:text-5xl text-gray-500 mb-4 font-medium">
          Oh...
        </h1>
        <p className="font-body text-xl md:text-2xl text-gray-600 mb-2 font-medium">
          Okay then.
        </p>
        <p className="font-body text-sm md:text-base text-gray-400 italic">
          I understand.
        </p>
      </motion.div>
    </div>
  );
};

export default GoodbyePage;
