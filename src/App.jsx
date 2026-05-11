import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MobileOnly from "./components/MobileOnly";
import TurtleLoader from "./components/TurtleLoader";
import InvitationPage from "./pages/InvitationPage";
import GoodbyePage from "./pages/GoodbyePage";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500); // Sesuai durasi animasi kura-kura

    return () => clearTimeout(timer);
  }, []);

  return (
    <MobileOnly>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <TurtleLoader key="loader" onComplete={() => setIsLoading(false)} />
        ) : (
          <Router key="app">
            <Routes>
              <Route path="/" element={<InvitationPage />} />
              <Route path="/goodbye" element={<GoodbyePage />} />
              <Route
                path="/login"
                element={
                  <div style={{ padding: "40px", textAlign: "center" }}>
                    Login Page (Coming Soon)
                  </div>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        )}
      </AnimatePresence>
    </MobileOnly>
  );
}

export default App;
