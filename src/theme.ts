import { createTheme, defaultDarkModeOverride } from '@aws-amplify/ui-react';

const theme = createTheme({
  name: 'IsotopeTheme',
  tokens: {
    colors: {
      font: {
        primary: { value: '#333333' },
      },
      background: {
        primary: { value: '#ffffff' },   // Light mode background
        secondary: { value: '#f8f8f8' }, // Light mode alt BG
      },
      brand: {
        primary: { value: '#000' },
        accent: { value: '#ff0055' },
      },
    },
    components: {
      // Example override for Button "primary"
      button: {
        primary: {
          backgroundColor: { value: '{colors.brand.accent}' },
          color: { value: '#fff' },
          _hover: {
            backgroundColor: { value: '#e0004c' },
          },
        },
      },
    },
  },
  overrides: [defaultDarkModeOverride],
});

export default theme;