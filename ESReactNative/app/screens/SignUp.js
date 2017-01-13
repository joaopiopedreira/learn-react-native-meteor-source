import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { create } from 'react-native-platform-stylesheet';
import { FormLabel, FormInput, Button, Card } from 'react-native-elements';
import { Accounts } from 'react-native-meteor';

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

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    };
  }

  goToSignIn = () => {
    this.props.navigator.push(Router.getRoute('signIn'));
  };

  signUp = () => {
    const { email, username, password, confirmPassword } = this.state;
    if (email.length === 0) {
      // TODO: Show error
      return;
    }

    if (username.length === 0) {
      // TODO: Show error
      return;
    }

    if (password.length === 0 || password !== confirmPassword) {
      // TODO: Show error
      return;
    }

    // TODO: Set a loading state
    Accounts.createUser({ username, email, password }, (err) => {
      if (err) {
        // TODO: Handle error
      } else {
        this.props.navigator.immediatelyResetStack([Router.getRoute('profile')]);
      }
    });
  };

  handleChangeEmail = (email) => {
    const { username } = this.state;
    const update = { email };
    const inferredUsername = email.split('@')[0];
    if (username === inferredUsername.slice(0, inferredUsername.length - 1)) {
      update.username = inferredUsername;
    }
    this.setState(update);
  };

  handleChangeText = (text, field) => {
    const update = {};
    update[field] = text;
    this.setState(update);
  };

  render() {
    // TODO: Handle loading state
    return (
      <View style={styles.container}>
        <Card>
          <FormLabel>Email</FormLabel>
          <FormInput
            placeholder="Please enter your email..."
            value={this.state.email}
            onChangeText={this.handleChangeEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <FormLabel>Username</FormLabel>
          <FormInput
            placeholder="Please enter your username..."
            value={this.state.username}
            onChangeText={(text) => this.handleChangeText(text, 'username')}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <FormLabel>Password</FormLabel>
          <FormInput
            placeholder="Please enter your password..."
            secureTextEntry
            value={this.state.password}
            onChangeText={(text) => this.handleChangeText(text, 'password')}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <FormLabel>Confirm Password</FormLabel>
          <FormInput
            placeholder="Please enter confirm your password..."
            secureTextEntry
            value={this.state.confirmPassword}
            onChangeText={(text) => this.handleChangeText(text, 'confirmPassword')}
            autoCapitalize="none"
            autoCorrect={false}
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
