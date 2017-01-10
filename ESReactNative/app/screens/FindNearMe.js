import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
} from 'react-native';
import { create } from 'react-native-platform-stylesheet';
import Router from '../config/router';
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
    color: colors.defaultText,
  },
});

class FindNearMe extends Component {
  goToNearMe = () => {
    this.props.navigator.push(Router.getRoute('nearMe'));
  };

  render() {
    return (
      <View style={styles.container}>
        <LocateMeButton
          onPress={this.goToNearMe}
        />
        <Text style={styles.welcome}>
          Find Nearest Charging Stations
        </Text>
      </View>
    );
  }
}

FindNearMe.propTypes = {
  navigator: PropTypes.object.isRequired,
};

export default FindNearMe;
