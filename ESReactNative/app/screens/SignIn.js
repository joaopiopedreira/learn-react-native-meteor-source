import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';
import { create } from 'react-native-platform-stylesheet';

// import colors from '../config/colors';
// import Router from '../config/router';

const styles = create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: colors.background,
    backgroundColor: '#e45641',
  },
});

class SignUp extends Component {
  static route = {
    navigationBar: {
      visible: true,
      title: 'Sign In',
    },
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>
          Sign In Screen
        </Text>
      </View>
    );
  }
}

export default SignUp;
