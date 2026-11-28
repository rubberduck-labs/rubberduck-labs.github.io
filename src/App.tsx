import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigationType } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Snow } from './components/Snow';
import { Fireworks } from './components/Fireworks';
import { SnowPile } from './components/SnowPile';
import { useHoliday } from './hooks/useHoliday';
import { HomePage } from './pages/HomePage';
import { TeamPage } from './pages/TeamPage';
import { JobsPage } from './pages/JobsPage';
import { ImpactPage } from './pages/ImpactPage';
import { HandbookPage } from './pages/HandbookPage';
import { OppdragPage } from './pages/OppdragPage';
import { IntervjuPage } from './pages/IntervjuPage';
import { track } from './utils/track';

// React Router bytter side uten å utløse hashchange, så menyklikk telles ikke av t.js alene. Her telles hvert sidebytte.
// t.js hopper over en sidevisning av samme side som kom under to sekunder før, så lasting og tilbake-knapp ikke telles to ganger.
function RouteTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    track('pageview');
  }, [pathname]);
  return null;
}

// Nytt sidebytte starter øverst. Tilbake- og frem-knappen (POP) lar nettleseren ta vare på rulleposisjonen.
function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  useEffect(() => {
    if (navigationType !== 'POP') window.scrollTo(0, 0);
  }, [pathname, navigationType]);
  return null;
}

// Noen høytider bytter ut det gule: isblått med snø til jul, gresskaroransje til halloween,
// og til nyttår blir siden en midnattsblå natthimmel med fyrverkeri.
// En farge valgt med «bgcolor» i terminalen vinner fortsatt.
const YELLOW = { bg: '#fde047', nav: 'rgba(253, 216, 71, 0.9)' };
const DARK = { bg: '#1f2937', nav: 'rgba(31, 41, 55, 0.9)' };
const MIDNIGHT = { bg: '#0b1230', nav: 'rgba(11, 18, 48, 0.9)' };
const ICE_BLUE = { bg: '#cfe6f5', nav: 'rgba(207, 230, 245, 0.9)' };
const PUMPKIN = { bg: '#f6a04d', nav: 'rgba(246, 160, 77, 0.9)' };

function App() {
  const holiday = useHoliday();
  const theme = holiday === 'christmas' ? ICE_BLUE : holiday === 'halloween' ? PUMPKIN : YELLOW;
  const [darkMode, setDarkMode] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState<string | null>(null);
  const [navBackgroundColor, setNavBackgroundColor] = useState<string>('rgba(253, 224, 71, 0.9)');
  const isNewYear = holiday === 'newyear';
  const dark = isNewYear ? MIDNIGHT : DARK;

  // Initialize dark mode based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    setDarkMode(hour >= 19 || hour < 6);
  }, []);

  // Fyrverkeri trenger mørk himmel, så nyttår starter i mørk modus. Bryteren virker fortsatt.
  useEffect(() => {
    if (isNewYear) setDarkMode(true);
  }, [isNewYear]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      setNavBackgroundColor(dark.nav);
    } else {
      document.documentElement.classList.remove('dark');
      if (backgroundColor) {
        setNavBackgroundColor(backgroundColor.replace(')', ', 0.9)').replace('rgb', 'rgba'));
      } else {
        setNavBackgroundColor(theme.nav);
      }
    }
  }, [darkMode, backgroundColor, theme.nav, dark.nav]);

  return (
    <Router>
      <RouteTracker />
      <ScrollToTop />
      <div 
        className="isolate min-h-screen transition-colors duration-300"
        style={{
          backgroundColor: darkMode ? dark.bg : (backgroundColor || theme.bg)
        }}
      >
        <Navigation 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          navBackgroundColor={navBackgroundColor}
        />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<HomePage setBackgroundColor={setBackgroundColor} />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/kunder" element={<ImpactPage />} />
            <Route path="/impact" element={<Navigate to="/kunder" replace />} />
            <Route path="/handbook" element={<HandbookPage />} />
            <Route path="/oppdrag" element={<OppdragPage />} />
            <Route path="/intervju/:token" element={<IntervjuPage />} />
          </Routes>
        </main>
        {holiday === 'christmas' && <SnowPile />}
        <Footer />
        {holiday === 'christmas' && (
          <>
            <SnowPile fixed />
            <Snow />
          </>
        )}
        {isNewYear && <Fireworks />}
      </div>
    </Router>
  );
}

export default App;
