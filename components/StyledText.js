import * as React from 'react';
import { Text, PixelRatio } from 'react-native';



class StyledText extends React.Component {

  normalize(size) {
    const fontScale = PixelRatio.getFontScale();
    return size / fontScale;
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