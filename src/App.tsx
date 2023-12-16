import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './Header';
import LandingPage from './pages/LandingPage';
import LearnMore from './pages/LearnMore';

const App = () => {
  return (
      <Router>
        <Header />
          <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/learn-more" element={<LearnMore />} />
          </Routes>
      </Router>
  );
};

export default App;
