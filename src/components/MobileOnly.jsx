import { useEffect, useState } from 'react';
import './MobileOnly.css';

const MobileOnly = ({ children }) => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword));
      const isSmallScreen = window.innerWidth <= 768;

      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (!isMobile) {
    return (
      <div className="desktop-block">
        <div className="desktop-block-content">
          <div className="icon">📱</div>
          <h2>Mobile Only</h2>
          <p>This special invitation is designed exclusively for mobile devices.</p>
          <p className="hint">Please open this link on your phone! 💕</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MobileOnly;
