import React, {Component, PropTypes} from 'react';
import Meteor, { createContainer } from 'react-native-meteor';
import Router from '../config/router';
import config from '../config/config';
import LocateMeButton from '../components/LocateMeButton';
import Container from '../components/Container';
import {Header} from '../components/Text';
import Locations from '../config/offlineCollections/Locations';


class FindNearMe extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
        };
    }

    data = () => {

        return {
            connectionStatus: Meteor.status().status
        }
    };

    handleGeolocationSuccess = (position) => {
        const params = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        };

        this.setState({ loading: true });
        const query = {
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [params.longitude, params.latitude],
                    },
                    $minDistance: 0,
                },
            },
        };

        const options = {
            limit: 10,
            fields: {
                _id: 1,
                station_name: 1,
                street_address: 1,
                access_days_time: 1,
                groups_with_access_code: 1,
                checkedInUserId: 1
            },
        };

        try {
            const locations = Locations.find(query, options);
            this.props.navigator.push(Router.getRoute('nearMe', { locations }));

        }
        catch(e) {
            this.props.navigator.showLocalAlert(err.message, config.errorStyles);
        }
        finally {
            this.setState({ loading: false });
        }


        // Meteor.call('Locations.getNearestLocations', params, (err, locations) => {
        //   if (err) {
        //     this.props.navigator.showLocalAlert(err.reason, config.errorStyles);
        //   } else {
        //     this.props.navigator.push(Router.getRoute('nearMe', { locations }));
        //   }
        //   this.setState({ loading: false });
        // });
    };

    handleGeolocationError = (error) => {
        this.props.navigator.showLocalAlert(error.message, config.errorStyles);
    };

    goToNearMe = () => {
        navigator.geolocation.getCurrentPosition(
            this.handleGeolocationSuccess,
            this.handleGeolocationError,
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
        );
    };

    render() {
        const connected = `Connection status: ${this.data().connectionStatus}`;

        return (
            <Container>
                <Header>
                    {connected}
                </Header>
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

//export default FindNearMe;

const ConnectedLocationDetails = createContainer((params) => {

    return {}
}, FindNearMe);

export default ConnectedLocationDetails;