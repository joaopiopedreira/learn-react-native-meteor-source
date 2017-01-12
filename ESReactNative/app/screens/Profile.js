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

class Profile extends Component {
  static route = {
    navigationBar: {
      visible: true,
      title: 'Profile',
    },
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>
          Profile Screen
        </Text>
      </View>
    );
  }
}

export default Profile;
