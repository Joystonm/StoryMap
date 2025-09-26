import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocationProvider } from './contexts/LocationContext';
import Home from './pages/Home';
import Explore from './pages/Explore';
import StoryTeller from './pages/StoryTeller';
import ClimateMap from './pages/ClimateMap';
import Indigenous from './pages/Indigenous';
import About from './pages/About';

function App() {
  return (
    <Router>
      <LocationProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/storyteller" element={<StoryTeller />} />
            <Route path="/climate" element={<ClimateMap />} />
            <Route path="/indigenous" element={<Indigenous />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </LocationProvider>
    </Router>
  );
}

export default App;
