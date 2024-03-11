import * as React from 'react';
import { Text, Dimensions, Platform, PixelRatio } from 'react-native';

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

  // based on iphone 5s's scale
  const scale = SCREEN_WIDTH / 320;

class StyledText extends React.Component {

  normalize(size) {
    const newSize = size * scale 
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
  }

  render() {
    return (
      <Text 
        className={`text-[Axumin] ${this.props.style}`} allowFontScaling={false}
        style={
          {fontSize: this.normalize(this.props.fontSize)}
        }
      >
        {this.props.text}
      </Text>
    )
  }
}

export default StyledText