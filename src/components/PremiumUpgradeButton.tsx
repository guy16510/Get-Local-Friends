// src/components/PremiumUpgradeButton.tsx
import React, { useState, useCallback, memo } from 'react';
import { addUserToPremiumGroup } from '../services/premiumGroupApi';

interface StatusState {
  message: string;
  type: 'idle' | 'loading' | 'success' | 'error';
}

const PremiumUpgradeButton: React.FC = memo(() => {
  const [status, setStatus] = useState<StatusState>({
    message: '',
    type: 'idle'
  });
  const [isDisabled, setIsDisabled] = useState(false);

  const handleUpgrade = useCallback(async () => {
    if (status.type === 'loading') return;

    setIsDisabled(true);
    setStatus({ message: 'Processing upgrade...', type: 'loading' });

    try {
      await addUserToPremiumGroup();
      setStatus({
        message: 'Upgrade successful! You now have premium access.',
        type: 'success'
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to upgrade. Please try again later.';
      
      setStatus({
        message: errorMessage,
        type: 'error'
      });
      setIsDisabled(false);
    }
  }, [status.type]);

  const statusStyles = {
    success: 'color: green',
    error: 'color: red',
    loading: 'color: blue',
    idle: ''
  };

  return (
    <div className="premium-upgrade-container">
      <button 
        onClick={handleUpgrade}
        disabled={isDisabled}
        className={`upgrade-button ${status.type}`}
        aria-busy={status.type === 'loading'}
      >
        {status.type === 'loading' ? 'Processing...' : 'Upgrade to Premium'}
      </button>
      {status.message && (
        <p 
          className={`status-message ${status.type}`}
          role="status"
          aria-live="polite"
          style={{ [statusStyles[status.type]]: true }}
        >
          {status.message}
        </p>
      )}
    </div>
  );
});

// Add display name for better debugging
PremiumUpgradeButton.displayName = 'PremiumUpgradeButton';

export default PremiumUpgradeButton;
