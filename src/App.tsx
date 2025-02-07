// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@aws-amplify/ui-react';
import theme from './theme';
import Header from './components/Header';
import HomePage from './components/HomePage';
import SignupForm from './components/SignupForm';
import ContactUs from './components/ContactUs';
import ProfilePage from './components/ProfilePage';
import SearchPage from './components/SearchPage';
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