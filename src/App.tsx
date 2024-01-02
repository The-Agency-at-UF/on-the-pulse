import React, { useEffect, useContext } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { UserProvider, UserContext } from './contexts/UserContext';
import { getAuth, getRedirectResult } from 'firebase/auth';

// Firebase
import './firebase/firebaseConfig';

// Components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import LearnMore from './pages/LearnMore';
import AdminPage from './pages/AdminPage';
import BlogPost from './pages/BlogPost';

const App = () => {
  const userContext = useContext(UserContext);

  useEffect(() => {
    if (userContext) {
      const auth = getAuth();
      getRedirectResult(auth)
        .then((result) => {
          if (result) {
            userContext.setCurrentUser(result.user);
          }
        })
        .catch((error) => {
          console.error('Error handling redirect:', error);
        });
    }
  }, [userContext]);

  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/blog/:blogId" element={<BlogPost />} />
        </Routes>

        <Footer />
      </Router>
    </UserProvider>
  );
};

export default App;
