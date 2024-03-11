import React from 'react';
import PropTypes from 'prop-types';

import {
  View,
  AppState
} from 'react-native';
import _ from 'lodash';

import CpsButtonBig from './CpsButtonBig';
import StyledText from './StyledText';

class CountDown extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    until: PropTypes.number,
    onFinish: PropTypes.func,
  };

  state = {
    until: Math.max(this.props.until, 0),
    time: Math.max(this.props.until, 0),
    lastUntil: 0,
    wentBackgroundAt: null,
  };

  constructor(props) {
    super(props);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  componentDidMount() {
    this.appStateSubscription = AppState.addEventListener(
      "change",
      this._handleAppStateChange
    );
    (async () => {
      await this.props.onSound()
      await this.sleep(5700)
      this.timer = setInterval(this.updateTimer, 1000);
    })();  
    
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.appStateSubscription.remove();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.until !== prevProps.until ||
      this.props.id !== prevProps.id
    ) {
      this.setState({
        lastUntil: prevState.until,
        until: Math.max(prevProps.until, 0),
      });
    }
  }

  _handleAppStateChange = (currentAppState) => {
    const { until, wentBackgroundAt } = this.state;
    if (
      currentAppState === "active" &&
      wentBackgroundAt &&
      this.props.running
    ) {
      const diff = (Date.now() - wentBackgroundAt) / 1000.0;
      this.setState({
        lastUntil: until,
        until: Math.max(0, until - diff),
      });
    }
    if (currentAppState === "background") {
      this.setState({ wentBackgroundAt: Date.now() });
    }
  };

  getTimeLeft = () => {
    const {until} = this.state;
    return {
      seconds: until,
    };
  };

  updateTimer = () => {
    // Don't fetch these values here, because their value might be changed
    // in another thread
    // const {lastUntil, until} = this.state;

    if (this.state.lastUntil === this.state.until || !this.props.running) {
      return;
    }
    if (
      this.state.until === 1 ||
      (this.state.until === 0 && this.state.lastUntil !== 1)
    ) {
      if (this.props.onFinish) {
        this.props.onFinish(true);
      }
    }

    if (this.state.until === 0) {
      this.setState({ lastUntil: 0, until: 0 });
    } else {
      this.setState({
        lastUntil: this.state.until,
        until: Math.max(0, this.state.until - 1),
      });
    }
  };

  renderCountDown = () => {
    const {seconds} = this.getTimeLeft();
    const newTime = seconds;

    return (
      <CpsButtonBig>
          <View className="w-full h-full bg-cps-brown rounded-md items-center justify-end">
              <StyledText fontSize={72} style="text-cps-yellow font-black" text={`${newTime}"`} />
          </View>
      </CpsButtonBig>
    );
  };

  render() {
    return (
      <View className={this.props.style}>
        {this.renderCountDown()}
      </View>
    );
  }
}

export default CountDown;
export { CountDown };