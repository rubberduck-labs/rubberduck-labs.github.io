import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import type { GeoJSON as GeoJSONType } from 'geojson';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { TeamPage } from './pages/TeamPage';
import { JobsPage } from './pages/JobsPage';
import { ImpactPage } from './pages/ImpactPage';
import { HandbookPage } from './pages/HandbookPage';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [geoData, setGeoData] = useState<GeoJSONType | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string | null>(null);
  const [navBackgroundColor, setNavBackgroundColor] = useState<string>('rgba(253, 224, 71, 0.9)');

  // Initialize dark mode based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    setDarkMode(hour >= 19 || hour < 6);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      setNavBackgroundColor('rgba(31, 41, 55, 0.9)');
    } else {
      document.documentElement.classList.remove('dark');
      if (backgroundColor) {
        setNavBackgroundColor(backgroundColor.replace(')', ', 0.9)').replace('rgb', 'rgba'));
      } else {
        setNavBackgroundColor('rgba(253, 224, 71, 0.9)');
      }
    }
  }, [darkMode, backgroundColor]);

  useEffect(() => {
    fetch('/kommuner.geojson')
      .then(response => response.json())
      .then(data => setGeoData(data))
      .catch(error => console.error('Error loading map data:', error));
  }, []);

  return (
    <Router>
      <div 
        className="min-h-screen transition-colors duration-300"
        style={{
          backgroundColor: darkMode ? '#1f2937' : (backgroundColor || '#fde047')
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
            <Route path="/impact" element={<ImpactPage geoData={geoData} darkMode={darkMode} />} />
            <Route path="/handbook" element={<HandbookPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;