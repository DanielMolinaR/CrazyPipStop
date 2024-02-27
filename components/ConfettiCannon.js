import * as React from 'react';
import ConfettiCannon from 'react-native-confetti-cannon';

class CustomConfettiCannon extends React.Component {
  explosion;

  constructor(props) {
    super(props);
  }

  explodeIfVictory = () => {
    if (this.props.hasWon) {
        this.explosion.start();
    } 
  };

  render() {
    return (
      <ConfettiCannon
        count={100}
        origin={{x: -20, y: 0}}
        fallSpeed={4000}
        fadeOut={true}
        colors={['#D2160F', '#E87600', '#F7D133', '#8CC63F']}
        autoStartDelay={200}
        ref={ref => (this.explosion = ref)}
      />
    );
  }
}

export default CustomConfettiCannon;
export { CustomConfettiCannon };