import * as React from 'react';
import ConfettiCannon from 'react-native-confetti-cannon';

const CPS_PALETTE = ['#D2160F', '#E87600', '#F7D133', '#8CC63F'];

export default function CustomConfettiCannon() {
  return (
    <ConfettiCannon
      count={100}
      origin={{ x: -20, y: 0 }}
      fallSpeed={4000}
      colors={CPS_PALETTE}
      autoStartDelay={200}
    />
  );
}
