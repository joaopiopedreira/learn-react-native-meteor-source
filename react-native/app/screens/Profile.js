import React, {Component, PropTypes} from 'react';
import Meteor, {createContainer} from 'react-native-meteor';
import Router from '../config/router';
import Container from '../components/Container';
import {PrimaryButton} from '../components/Form';
import {Header} from '../components/Text';
import Locations from '../config/offlineCollections/Locations';
import Activity from '../config/offlineCollections/Activity';
import moment from 'moment';
import { AsyncStorage } from 'react-native'

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

    constructor(props) {
        super(props);

        this.state = {
            locationsSyncTime: 0,
            activitiesSyncTime: 0,
        };
    }


    data = () => {
        const locations = Locations.find();
        const activities = Activity.find();

        return {
            locationsCount: locations.length,
            activityCount: activities.length
        }
    };

    signOut = () => {
        Locations.clear(true);
        Activity.clear(true);
        Meteor.logout();
        AsyncStorage.removeItem('offlineCollection:offlineUser');
        AsyncStorage.removeItem('offlineCollection:offlineCollectionVersions');
        this.props.navigator.immediatelyResetStack([Router.getRoute('signUp')]);
    };

    sync = () => {

        const initialTime = moment();

        const handleGeolocationSuccess = (position) => {
            const params = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };

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

            subscribe(query);
        };

        const handleGeolocationError = (error) => {
            this.props.navigator.showLocalAlert(error.message, config.errorStyles);
        };

        navigator.geolocation.getCurrentPosition(
            handleGeolocationSuccess,
            handleGeolocationError,
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
        );

        const subscribe = (query) => {

            const options = {
                //limit: 100,
                fields: {
                    _id: 1,
                    station_name: 1,
                    street_address: 1,
                    access_days_time: 1,
                    groups_with_access_code: 1,
                    location: 1,
                    checkedInUserId: 1,
                    __offlineVersion: 1
                }
            };

            !Locations.syncing && Locations.sync({
                query: query,
                options: options,
                syncCallback: (locations) => {
                    console.log('synced Locations in Profile.js');
                    console.log(`Number of locations: ${locations && locations.length}`);
                    this.state.locationsSyncTime = moment(moment.duration(moment().diff(initialTime)).get('seconds'));
                }
            });

            !Activity.syncing && Activity.sync({
                query: {},
                syncCallback: (activity) => {
                    console.log('synced Activity in Profile.js');
                    console.log(`Number of activities: ${activity && activity.length}`);
                    this.state.activitiesSyncTime = moment(moment.duration(moment().diff(initialTime)).get('seconds'));
                }
            });
        };

    };

    render() {
        const locationsInMemoryStr = `Locations in memory: ${this.data().locationsCount} (Last sync time: ${this.state.locationsSyncTime} secs)`;
        const activityInMemoryStr = `Activity in memory: ${this.data().activityCount} (Last sync Time: ${this.state.activitiesSyncTime} secs)`;


        return (
            <Container>
                <Header>
                    Profile Screen
                </Header>
                <Header style={{marginHorizontal:20}}>
                    {locationsInMemoryStr}
                </Header>
                <Header style={{marginHorizontal:20}}>
                    {activityInMemoryStr}
                </Header>
                <PrimaryButton
                    title="Sync"
                    onPress={this.sync}
                />
                <PrimaryButton
                    title="Sign Out"
                    onPress={this.signOut}
                />
            </Container>
        );
    }
}

//export default Profile;

const ConnectedLocationDetails = createContainer((params) => {

    return {}
}, Profile);

export default ConnectedLocationDetails;