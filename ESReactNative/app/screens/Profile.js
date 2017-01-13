import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
} from 'react-native';
import { create } from 'react-native-platform-stylesheet';
import { Button } from 'react-native-elements';
import Meteor from 'react-native-meteor';

import Router from '../config/router';
import colors from '../config/colors';

const styles = create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

class Profile extends Component {
  static route = {
    navigationBar: {
      visible: true,
      title: 'Profile',
    },
  }

  static propTypes = {
    navigator: PropTypes.object.isRequired,
  }

  signOut = () => {
    Meteor.logout();
    this.props.navigator.immediatelyResetStack([Router.getRoute('signUp')]);
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>
          Profile Screen
        </Text>
        <Button
          large
          title="Sign Out"
          buttonStyle={{ marginVertical: 20 }}
          onPress={this.signOut}
        />
      </View>
    );
  }
}

export default Profile;
