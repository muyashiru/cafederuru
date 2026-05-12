import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MobileOnly = ({ children }) => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = [
        "android",
        "iphone",
        "ipad",
        "ipod",
        "blackberry",
        "windows phone",
      ];
      const isMobileDevice = mobileKeywords.some((keyword) =>
        userAgent.includes(keyword),
      );
      const isSmallScreen = window.innerWidth <= 768;

      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  if (!isMobile) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-cream to-beige p-5">
        <div className="text-center max-w-lg p-10 bg-white rounded-3xl shadow-2xl">
          <motion.div
            className="text-7xl md:text-8xl mb-5"
            animate={{
              rotate: [0, -10, 10, -10, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            📱
          </motion.div>
          <h2 className="font-heading text-3xl md:text-4xl text-matcha-primary mb-4 font-semibold">
            Hanya bisa dibuka di HP
          </h2>
          <p className="font-body text-base md:text-lg text-gray-700 leading-relaxed mb-3">
            Undangan ini spesial dibuat untuk <br></br> Iphone 11 Nasywa
          </p>
          <p className="font-body text-lg md:text-xl text-matcha-dark font-semibold">
            Silahkan buka lewat link yang dikirimkan :V
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MobileOnly;
