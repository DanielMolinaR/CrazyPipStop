import * as React from 'react';
import { Text } from 'react-native';

class StyledText extends React.Component {
  render() {
    return (
      <Text className={`font-[Acumin]  ${this.props.style}`} allowFontScaling={false}>
        {this.props.text}
      </Text>
    )
  }
}

export default StyledText