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
import LoginPage from "./pages/LoginPage";
import SignaturePage from "./pages/SignaturePage";
import GoodbyePage from "./pages/GoodbyePage";
import DetailsPage from "./pages/DetailsPage";
import BlankPage from "./pages/BlankPage";
import { checkHasAnswer } from "./lib/rsvpService";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRejected, setIsRejected] = useState(false);
  const [hasYes, setHasYes] = useState(false);

  useEffect(() => {
    let timer;
    const init = async () => {
      const status = await checkHasAnswer();
      if (status.hasAnswer && status.response === 'no') {
        setIsRejected(true);
        setIsLoading(false); // Langsung skip loading
      } else {
        if (status.hasAnswer) {
          setHasYes(true);
        }
        // Simulate initial load time jika belum direject
        timer = setTimeout(() => {
          setIsLoading(false);
        }, 3500); // Sesuai durasi animasi kura-kura
      }
    };
    init();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <MobileOnly>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <TurtleLoader key="loader" onComplete={() => {}} />
        ) : (
          <Router key="app">
            <Routes>
              {isRejected ? (
                <>
                  <Route path="/goodbye" element={<GoodbyePage />} />
                  <Route path="*" element={<BlankPage />} />
                </>
              ) : (
                <>
                  <Route path="/" element={hasYes ? <Navigate to="/login" replace /> : <InvitationPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signature" element={hasYes ? <Navigate to="/details" replace /> : <SignaturePage />} />
                  <Route path="/goodbye" element={<GoodbyePage />} />
                  <Route path="/details" element={<DetailsPage />} />
                  <Route path="/blank" element={<BlankPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              )}
            </Routes>
          </Router>
        )}
      </AnimatePresence>
    </MobileOnly>
  );
}

export default App;
