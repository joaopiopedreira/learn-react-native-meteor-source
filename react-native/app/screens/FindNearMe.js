import React, { Component, PropTypes } from 'react';
import Meteor from 'react-native-meteor';
import Router from '../config/router';
import config from '../config/config';
import LocateMeButton from '../components/LocateMeButton';
import Container from '../components/Container';
import { Header } from '../components/Text';

class FindNearMe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  handleGeolocationSuccess = (position) => {
    const params = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    this.setState({ loading: true });
    Meteor.call('Locations.getNearestLocations', params, (err, locations) => {
      if (err) {
        this.props.navigator.showLocalAlert(err.reason, config.errorStyles);
      } else {
        this.props.navigator.push(Router.getRoute('nearMe', { locations }));
      }
      this.setState({ loading: false });
    });
  };

  handleGeolocationError = (error) => {
    this.props.navigator.showLocalAlert(error.message, config.errorStyles);
  };

  goToNearMe = () => {
    navigator.geolocation.getCurrentPosition(
      this.handleGeolocationSuccess,
      this.handleGeolocationError,
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };

  render() {
    return (
      <Container>
        <LocateMeButton
          onPress={this.goToNearMe}
          loading={this.state.loading}
        />
        <Header>
          Find Nearest Charging Stations
        </Header>
      </Container>
    );
  }
}

FindNearMe.propTypes = {
  navigator: PropTypes.object.isRequired,
};

export default FindNearMe;
