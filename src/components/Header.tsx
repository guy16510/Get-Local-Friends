// src/components/Header.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Flex, Button, View } from '@aws-amplify/ui-react';
import { LightDarkToggle } from './LightDarkToggle';
import './Header.css';

interface HeaderProps {
  colorMode: 'light' | 'dark';
  setColorMode: (mode: 'light' | 'dark') => void;
}

const Header: React.FC<HeaderProps> = ({ colorMode, setColorMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Helper to style active nav links
  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    textDecoration: isActive ? 'none' : 'underline',
    color: 'inherit',
  });

  return (
    <View
      as="header"
      padding="1rem"
      backgroundColor="var(--amplify-colors-background-primary)"
    >
      <Flex justifyContent="space-between" alignItems="center">
        {/* Site Title / Logo */}
        <NavLink
          to="/"
          style={{
            textDecoration: 'none',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'inherit',
          }}
        >
          Get Local Friends
        </NavLink>

        {/* Desktop Navigation */}
        <Flex className="nav-links" alignItems="center" gap="1rem">
          <NavLink to="/" style={navLinkStyle} end>
            Home
          </NavLink>
          <NavLink to="/search" style={navLinkStyle}>
            Search
          </NavLink>
          <NavLink to="/signup" style={navLinkStyle}>
            Sign Up
          </NavLink>
          <NavLink to="/contact" style={navLinkStyle}>
            Contact Us
          </NavLink>
          <NavLink to="/profile" style={navLinkStyle}>
            Profile
          </NavLink>
        </Flex>

        {/* Right Side: Dark mode toggle and hamburger */}
        <Flex alignItems="center" gap="1rem">
          <LightDarkToggle colorMode={colorMode} setColorMode={setColorMode} />
          <Button
            className="hamburger"
            variation="primary"
            onClick={toggleMenu}
            aria-label="Toggle menu"
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

      {/* Mobile Navigation */}
      {menuOpen && (
        <Flex className="mobile-nav" direction="column" gap="1rem" marginTop="1rem">
          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/search" onClick={() => setMenuOpen(false)}>
            Search
          </NavLink>
          <NavLink to="/signup" onClick={() => setMenuOpen(false)}>
            Sign Up
          </NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
            Contact Us
          </NavLink>
          <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
            Profile
          </NavLink>
        </Flex>
      )}
    </View>
  );
};

export default Header;