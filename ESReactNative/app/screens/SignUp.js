import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
} from 'react-native';
import { create } from 'react-native-platform-stylesheet';

// import colors from '../config/colors';
import Router from '../config/router';

const styles = create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: colors.background,
    backgroundColor: '#7b8d8e',
  },
});

class SignUp extends Component {
  static route = {
    navigationBar: {
      visible: true,
      title: 'Sign Up',
    },
  }

  goToSignIn = () => {
    this.props.navigator.push(Router.getRoute('signIn'));
  };

  render() {
    return (
      <View style={styles.container}>
        <Text onPress={this.goToSignIn}>
          To Sign In
        </Text>
      </View>
    );
  }
}

SignUp.propTypes = {
  navigator: PropTypes.object.isRequired,
};

export default SignUp;
