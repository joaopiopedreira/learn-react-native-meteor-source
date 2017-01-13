import React, { Component, PropTypes } from 'react';
import {
  Text,
} from 'react-native';
import { Button } from 'react-native-elements';
import Meteor from 'react-native-meteor';

import Router from '../config/router';
import Container from '../components/Container';

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
      <Container>
        <Text>
          Profile Screen
        </Text>
        <Button
          large
          title="Sign Out"
          buttonStyle={{ marginVertical: 20 }}
          onPress={this.signOut}
        />
      </Container>
    );
  }
}

export default Profile;
