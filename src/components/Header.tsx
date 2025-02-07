// src/components/Header.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Flex, Button, View } from '@aws-amplify/ui-react';
import { LightDarkToggle } from './LightDarkToggle';

interface HeaderProps {
  colorMode: 'light' | 'dark';
  setColorMode: (mode: 'light' | 'dark') => void;
}

const Header: React.FC<HeaderProps> = ({ colorMode, setColorMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  // const { tokens } = useTheme();

  // Toggle the mobile nav
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Decide background & text colors based on dark/light mode:
  const bgColor = colorMode === 'dark' ? 'rgba(17,17,17,0.7)' : 'rgba(219,219,219,0.9)';
  const textColor = colorMode === 'dark' ? '#fff' : '#000';

  // Use your brand's heading/body font here:
  const fontFamily = `'Open Sans', sans-serif`;

  // For styling active links:
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? 'var(--amplify-colors-brand-primary)' : 'inherit',
    textDecoration: 'none',
    fontWeight: isActive ? 700 : 400,
  });

  return (
    <View
      as="header"
      width="100%"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        // Optional: Slight blur & box-shadow to float above hero
        backdropFilter: 'blur(8px)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderBottomLeftRadius: '2rem',
        borderBottomRightRadius: '2rem',
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      <Flex
        as="div"
        alignItems="center"
        justifyContent="space-between"
        padding="1rem 1.5rem"
      >
        {/* Logo / Site Title */}
        <View style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.05rem' }}>
          <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Get Local Friends
          </NavLink>
        </View>

        {/* Desktop Navigation */}
        <Flex
          as="nav"
          display={{ base: 'none', medium: 'flex' }}
          gap="1.5rem"
          alignItems="center"
          style={{ fontSize: '1rem' }}
        >
          <NavLink to="/signup" style={linkStyle}>
            Sign Up
          </NavLink>
          <NavLink to="/contact" style={linkStyle}>
            Contact
          </NavLink>
          <NavLink to="/profile" style={linkStyle}>
            Profile
          </NavLink>
          <NavLink to="/search" style={linkStyle}>
            Search
          </NavLink>
        </Flex>

        {/* Right side: dark/light toggle & hamburger */}
        <Flex alignItems="center" gap="1rem">
          <LightDarkToggle colorMode={colorMode} setColorMode={setColorMode} />

          {/* Hamburger menu (mobile only) */}
          <Button
            variation="primary"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            display={{ base: 'block', medium: 'none' }}
            style={{ borderRadius: '0.5rem' }}
          >
            <svg width="24" height="24" fill="currentColor">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </Button>
        </Flex>
      </Flex>

      {/* Mobile Navigation (only when menuOpen) */}
      {menuOpen && (
        <Flex
          as="nav"
          direction="column"
          gap="1rem"
          padding="1rem 1.5rem"
          display={{ base: 'flex', medium: 'none' }}
          style={{
            fontFamily: fontFamily,
            fontSize: '1rem',
          }}
        >
          <NavLink to="/signup" onClick={() => setMenuOpen(false)} style={linkStyle}>
            Sign Up
          </NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)} style={linkStyle}>
            Contact
          </NavLink>
          <NavLink to="/profile" onClick={() => setMenuOpen(false)} style={linkStyle}>
            Profile
          </NavLink>
          <NavLink to="/search" onClick={() => setMenuOpen(false)} style={linkStyle}>
            Search
          </NavLink>
        </Flex>
      )}
    </View>
  );
};

export default Header;