// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@aws-amplify/ui-react';
import theme from './theme';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import SignupForm from './components/SignupForm';
import ContactUs from './pages/ContactUs';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import Footer from './components/Footer';

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
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;