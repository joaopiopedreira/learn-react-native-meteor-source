import React, { Component, PropTypes } from 'react';
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
    backgroundColor: '#44b3c2',
  },
});

class LocationDetails extends Component {
  static route = {
    navigationBar: {
      visible: true,
      title: 'Location Details',
    },
  }

  attemptCheckin = () => {
    const LOGGED_IN = false;
    if (LOGGED_IN) {
      // TODO: Stuff
    } else {
      this.props.navigation.performAction(({ tabs }) => {
        tabs('main').jumpToTab('account');
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text onPress={this.attemptCheckin}>
          Check In
        </Text>
      </View>
    );
  }
}

LocationDetails.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default LocationDetails;
