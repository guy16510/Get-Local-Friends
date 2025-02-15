// Updated App.tsx to fix HeaderProps error
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, Authenticator } from '@aws-amplify/ui-react';
import theme from './theme';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignupPage';
import ContactUsPage from './pages/ContactUsPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import TestPage from './pages/TestPage';
import ChatPage from './pages/ChatPage';
import PremiumPage from './pages/PremiumPage';

const App: React.FC = () => {
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(colorMode);
  }, [colorMode]);

  return (
    <ThemeProvider theme={theme} colorMode={colorMode}>
      <Router>
        <Header colorMode={colorMode} setColorMode={setColorMode} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/signup"
            element={
              <Authenticator>
                <SignUpPage />
              </Authenticator>
            }
          />
          <Route
            path="/chat"
            element={
              <Authenticator>
                <ChatPage />
              </Authenticator>
            }
          />
          <Route
            path="/premium"
            element={
              <Authenticator>
                <PremiumPage />
              </Authenticator>
            }
          />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route
            path="/profile"
            element={
              <Authenticator>
                <ProfilePage />
              </Authenticator>
            }
          />
          <Route
            path="/search"
            element={
              <Authenticator>
                <SearchPage />
              </Authenticator>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;

