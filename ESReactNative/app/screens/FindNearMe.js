import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { create } from 'react-native-platform-stylesheet';
import colors from '../config/colors';
import LocateMeButton from '../components/LocateMeButton';

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

const App = () => {
  return (
    <View style={styles.container}>
      <LocateMeButton />
      <Text style={styles.welcome}>
        Find Nearest Charging Stations
      </Text>
    </View>
  );
};

export default App;
