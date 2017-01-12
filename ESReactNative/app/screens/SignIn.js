import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';
import { create } from 'react-native-platform-stylesheet';
import { FormLabel, FormInput, Button, Card } from 'react-native-elements';
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

  signIn = () => {
    this.props.navigator.immediatelyResetStack([Router.getRoute('profile')]);
  };

  render() {
    return (
      <View style={styles.container}>
        <Card>
          <FormLabel>Email or Username</FormLabel>
          <FormInput
            placeholder="Please enter your email or username..."
          />
          <FormLabel>Password</FormLabel>
          <FormInput
            placeholder="Please enter your password..."
            secureTextEntry
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
