import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { create } from 'react-native-platform-stylesheet';
import { FormLabel, FormInput, Button, Card } from 'react-native-elements';

import colors from '../config/colors';
import Router from '../config/router';

const styles = create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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

  signUp = () => {
    this.props.navigator.immediatelyResetStack([Router.getRoute('profile')]);
  };

  render() {
    return (
      <View style={styles.container}>
        <Card>
          <FormLabel>Email</FormLabel>
          <FormInput
            placeholder="Please enter your email..."
          />
          <FormLabel>Username</FormLabel>
          <FormInput
            placeholder="Please enter your username..."
          />
          <FormLabel>Password</FormLabel>
          <FormInput
            placeholder="Please enter your password..."
            secureTextEntry
          />
          <FormLabel>Confirm Password</FormLabel>
          <FormInput
            placeholder="Please enter confirm your password..."
            secureTextEntry
          />
          <Button
            large
            title="Sign Up"
            buttonStyle={{ marginTop: 20 }}
            onPress={this.signUp}
          />
        </Card>
        <TouchableOpacity
          onPress={this.goToSignIn}
          style={{ marginTop: 20 }}
        >
          <Text
            style={{ alignSelf: 'center' }}
          >
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

SignUp.propTypes = {
  navigator: PropTypes.object.isRequired,
};

export default SignUp;
