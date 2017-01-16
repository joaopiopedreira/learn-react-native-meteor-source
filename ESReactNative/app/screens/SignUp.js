import React, { Component, PropTypes } from 'react';
import { Card } from 'react-native-elements';
import { Accounts } from 'react-native-meteor';
import Container from '../components/Container';
import Router from '../config/router';
import config from '../config/config';
import { Input, PrimaryButton, SecondaryButton } from '../components/Form';

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
      loading: false,
    };
  }

  goToSignIn = () => {
    this.props.navigator.push(Router.getRoute('signIn'));
  };

  signUp = () => {
    const { email, username, password, confirmPassword } = this.state;

    if (email.length === 0) {
      return this.props.navigator.showLocalAlert('Email is required.', config.errorStyles);
    }

    if (username.length === 0) {
      return this.props.navigator.showLocalAlert('Username is required.', config.errorStyles);
    }

    if (password.length === 0 || password !== confirmPassword) {
      return this.props.navigator.showLocalAlert('Passwords must match.', config.errorStyles);
    }

    this.setState({ loading: true });
    return Accounts.createUser({ username, email, password }, (err) => {
      if (err) {
        this.props.navigator.showLocalAlert(err.reason, config.errorStyles);
      } else {
        this.props.navigator.immediatelyResetStack([Router.getRoute('profile')]);
      }
      this.setState({ loading: false });
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
    return (
      <Container scroll>
        <Card>
          <Input
            label="Email"
            placeholder="Please enter your email..."
            value={this.state.email}
            onChangeText={this.handleChangeEmail}
            keyboardType="email-address"
          />
          <Input
            label="Username"
            placeholder="Please enter your username..."
            value={this.state.username}
            onChangeText={(text) => this.handleChangeText(text, 'username')}
          />
          <Input
            label="Password"
            placeholder="Please enter your password..."
            secureTextEntry
            value={this.state.password}
            onChangeText={(text) => this.handleChangeText(text, 'password')}
          />
          <Input
            label="Confirm Password"
            placeholder="Please enter confirm your password..."
            secureTextEntry
            value={this.state.confirmPassword}
            onChangeText={(text) => this.handleChangeText(text, 'confirmPassword')}
          />
          <PrimaryButton
            title="Sign Up"
            onPress={this.signUp}
            loading={this.state.loading}
          />
        </Card>

        <SecondaryButton
          title="Sign In"
          onPress={this.goToSignIn}
        />
      </Container>
    );
  }
}

SignUp.propTypes = {
  navigator: PropTypes.object.isRequired,
};

export default SignUp;
