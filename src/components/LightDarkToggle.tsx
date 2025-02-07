import React from 'react';
import { SwitchField } from '@aws-amplify/ui-react';

interface LightDarkToggleProps {
  colorMode: 'light' | 'dark';
  setColorMode: (mode: 'light' | 'dark') => void;
}

export const LightDarkToggle: React.FC<LightDarkToggleProps> = ({
  colorMode,
  setColorMode,
}) => {
  const handleChange = () => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light');
  };

  return (
    <SwitchField
      label="Dark Mode"
      labelPosition="end"
      isChecked={colorMode === 'dark'}
      onChange={handleChange}
      size="small"
    />
  );
};