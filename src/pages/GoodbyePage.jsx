import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const GoodbyePage = () => {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown <= 0) {
      navigate("/blank", { replace: true });
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <h1 className="text-red-500 font-mono text-2xl md:text-4xl mb-6 font-bold uppercase tracking-widest animate-pulse">
          Goodbye :D
        </h1>
        <p className="text-white font-mono text-lg md:text-xl mb-8">
          Website akan dihapus...
        </p>
        <div className="text-6xl md:text-8xl font-mono text-red-600 font-bold">
          {countdown}
        </div>
      </motion.div>
    </div>
  );
};

export default GoodbyePage;
