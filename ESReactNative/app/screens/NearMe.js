import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
} from 'react-native';
import { create } from 'react-native-platform-stylesheet';

// import colors from '../config/colors';
import NotFound from '../components/NotFound';
import Router from '../config/router';

const styles = create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: colors.background,
    backgroundColor: '#f1a94e',
  },
});

class NearMe extends Component {
  static route = {
    navigationBar: {
      visible: true,
      title: 'Near Me',
    },
  }

  goToLocationDetails = () => {
    this.props.navigator.push(Router.getRoute('locationDetails'));
  };

  render() {
    return (
      <View style={styles.container}>
        <Text onPress={this.goToLocationDetails}>
          To Location Detail
        </Text>
        <NotFound text="No locations found." />
      </View>
    );
  }
}

NearMe.propTypes = {
  navigator: PropTypes.object.isRequired,
};

export default NearMe;
