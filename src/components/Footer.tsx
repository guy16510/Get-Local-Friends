// src/components/Footer.tsx
import React from 'react';
import {
  Flex,
  View,
  Text,
  useTheme,
} from '@aws-amplify/ui-react';
import '../index.css';

const Footer: React.FC = () => {
  const { tokens } = useTheme();

  return (
    <View
      as="footer"
      backgroundColor={tokens.colors.black.value}
      color="#fff"
      padding="2rem 1.5rem"
      marginTop="4rem"
    >
      <Flex
        className="footer-content"
        maxWidth="1200px"
        margin="0 auto"
        gap="2rem"
        wrap="wrap"
      >
        <Flex className="footer-branding" direction="column" gap="1rem" flex="1">
          <Text className="logo" fontWeight="bold" fontSize="1.5rem" color="#fff">
            ISOTOPE
          </Text>
          <Text>© 2023 Isotope Inc.</Text>
        </Flex>

        <View className="footer-links" flex="1">
          <ul style={{ listStyle: 'none' }}>
            <li style={{ margin: '0.5rem 0' }}>
              <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>
                Legal
              </a>
            </li>
            <li style={{ margin: '0.5rem 0' }}>
              <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>
                Safety
              </a>
            </li>
            <li style={{ margin: '0.5rem 0' }}>
              <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>
                Terms
              </a>
            </li>
            <li style={{ margin: '0.5rem 0' }}>
              <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>
                Privacy
              </a>
            </li>
            <li style={{ margin: '0.5rem 0' }}>
              <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>
                Cookie Policy
              </a>
            </li>
          </ul>
        </View>

        <Flex className="footer-apps" direction="column" gap="1rem" flex="1">
          <Text>Download Our App</Text>
          <Flex className="store-badges" gap="1rem">
            {/* <Image
              src="https://via.placeholder.com/150x50?text=Google+Play"
              alt="Google Play"
              width="150px"
              style={{ cursor: 'pointer' }}
            />
            <Image
              src="https://via.placeholder.com/150x50?text=App+Store"
              alt="App Store"
              width="150px"
              style={{ cursor: 'pointer' }}
            /> */}
          </Flex>
        </Flex>
      </Flex>

      <View className="footer-bottom" textAlign="center" marginTop="2rem">
        <Text fontSize="0.85rem" color="#aaa">
          2023 Isotope App, LLC. All Rights Reserved.
        </Text>
        <Text fontSize="0.85rem" color="#aaa">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Place for disclaimers,
          trademark notices, etc.
        </Text>
      </View>
    </View>
  );
};

export default Footer;