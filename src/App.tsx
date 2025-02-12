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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    fetch('/kommuner.geojson')
      .then(response => response.json())
      .then(data => setGeoData(data))
      .catch(error => console.error('Error loading map data:', error));
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-custom-yellow dark:bg-custom-dark transition-colors duration-300">
        <Navigation darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
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