import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import { create } from 'react-native-platform-stylesheet';

import colors from '../config/colors';
import NotFound from '../components/NotFound';

const styles = create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

class FindNearMe extends Component {
  static route = {
    navigationBar: {
      visible: true,
      title: 'Near Me',
    },
  }

  render() {
    return (
      <View style={styles.container}>
        <NotFound text="No locations found." />
      </View>
    );
  }
}

export default FindNearMe;
