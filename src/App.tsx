import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './Header';
import LandingPage from './pages/LandingPage/LandingPage';

const App = () => {
  return (
      <Router>
        <Header />
          <Routes>
              <Route path="/" element={<LandingPage />} />
          </Routes>
      </Router>
  );
};

export default App;
