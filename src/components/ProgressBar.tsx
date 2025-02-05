import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ background: '#ccc', height: '10px', borderRadius: '5px' }}>
        <div
          style={{
            width: `${progressPercentage}%`,
            height: '10px',
            background: '#4caf50',
            borderRadius: '5px'
          }}
        />
      </div>
      <p>
        Step {currentStep + 1} of {totalSteps}
      </p>
    </div>
  );
};

export default ProgressBar;
