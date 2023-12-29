import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
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
        <Footer />

      </Router>
  );
};

export default App;
