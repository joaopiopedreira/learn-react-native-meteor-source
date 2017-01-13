import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';
import { create } from 'react-native-platform-stylesheet';
import { FormLabel, FormInput, Button, Card } from 'react-native-elements';
import Meteor from 'react-native-meteor';
import Router from '../config/router';
import colors from '../config/colors';

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
      title: 'Sign In',
    },
  }

  static propTypes = {
    navigator: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      emailOrUsername: '',
      password: '',
    };
  }

  signIn = () => {
    const { emailOrUsername, password } = this.state;
    if (emailOrUsername.length === 0) {
      // TODO: Show error
      return;
    }

    if (password.length === 0) {
      // TODO: Show error
      return;
    }

    // TODO: Set a loading state
    Meteor.loginWithPassword(emailOrUsername, password, (err) => {
      if (err) {
        // TODO: Handle error
      } else {
        this.props.navigator.immediatelyResetStack([Router.getRoute('profile')]);
      }
    });
  };

  handleTextChange = (text, field) => {
    const update = {};
    update[field] = text;
    this.setState(update);
  };

  render() {
    // TODO: Handle a loading state
    return (
      <View style={styles.container}>
        <Card>
          <FormLabel>Email or Username</FormLabel>
          <FormInput
            placeholder="Please enter your email or username..."
            onChangeText={(text) => this.handleTextChange(text, 'emailOrUsername')}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <FormLabel>Password</FormLabel>
          <FormInput
            placeholder="Please enter your password..."
            secureTextEntry
            onChangeText={(text) => this.handleTextChange(text, 'password')}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Button
            large
            title="Sign In"
            buttonStyle={{ marginVertical: 20 }}
            onPress={this.signIn}
          />
        </Card>
      </View>
    );
  }
}

export default SignUp;
