import React, { Component, PropTypes } from 'react';
import Meteor from 'react-native-meteor';
import Router from '../config/router';
import Container from '../components/Container';
import { PrimaryButton } from '../components/Form';
import { Header } from '../components/Text';

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
        <Header>
          Profile Screen
        </Header>
        <PrimaryButton
          title="Sign Out"
          onPress={this.signOut}
        />
      </Container>
    );
  }
}

export default Profile;
