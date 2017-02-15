import React, {PropTypes} from 'react';
import {View, Text} from 'react-native';
import {
    NavigationProvider,
    StackNavigation,
    TabNavigation,
    TabNavigationItem as TabItem,
} from '@exponent/ex-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Meteor, {createContainer} from 'react-native-meteor';
import Router from './config/router';
import colors from './config/colors';
import config from './config/config';
import Locations from './config/offlineCollections/Locations';
import Activity from './config/offlineCollections/Activity';
import OfflineCollectionVersions from './config/offlineCollections/OfflineCollectionVersions';



Meteor.connect(config.SERVER_URL);


const renderIcon = (isSelected, name, title) => {
    const color = isSelected ? colors.primary : colors.iconSubtle;
    return (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Icon
                name={name}
                color={color}
                size={28}
            />
            <Text
                style={{color}}
            >
                {title}
            </Text>
        </View>
    );
};

const App = ({user}) => {
    const accountRoute = user ? Router.getRoute('profile') : Router.getRoute('signUp');
    return (
        <NavigationProvider router={Router}>
            <TabNavigation
                id="main"
                navigatorUID="main"
                initialTab="home"
            >
                <TabItem
                    id="home"
                    renderIcon={(isSelected) => renderIcon(isSelected, 'home', 'Home')}
                >
                    <StackNavigation
                        id="home"
                        navigatorUID="home"
                        initialRoute={Router.getRoute('findNearMe')}
                    />
                </TabItem>
                <TabItem
                    id="account"
                    renderIcon={(isSelected) => renderIcon(isSelected, 'account-circle', 'Account')}
                >
                    <StackNavigation
                        id="account"
                        navigatorUID="account"
                        initialRoute={accountRoute}
                    />
                </TabItem>
            </TabNavigation>
        </NavigationProvider>
    );
};

App.propTypes = {
    user: PropTypes.object,
};


let changedEventIds = [];

export default createContainer(() => {

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
        if (Meteor.user()) {
            //console.log(`We've got a user. Email is ${Meteor.user().emails[0].address}`);

            Meteor.subscribe('offlineCollectionVersions');

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

            Meteor.ddp.on('added', (payload) => {
                //console.log('Doc added', payload);

                // Sync the Locations collection
                if (payload && payload.collection === 'offlineCollectionVersions') {
                    if (payload.fields && payload.fields.collection === 'locations') {
                        !Locations.syncing && Locations.sync({
                            query: query,
                            options: options,
                            syncCallback: (locations) => {
                                console.log('synced Locations in index.js');
                                console.log(`Number of locations: ${locations && locations.length}`);
                            }
                        });
                    }
                }

                // Sync the Activity collection
                if (payload && payload.collection === 'offlineCollectionVersions') {
                    if (payload.fields && payload.fields.collection === 'activity') {
                        !Activity.syncing && Activity.sync({
                            query: {},
                            syncCallback: (activity) => {
                                console.log('synced Activity in index.js');
                                console.log(`Number of activities: ${activity && activity.length}`);
                            }
                        });
                    }
                }
            });

            Meteor.ddp.on('changed', (payload) => {
                //console.log('Doc changed', payload);

                const locationsOfflineVersionId = OfflineCollectionVersions.findOne({collection:'locations'})._id;
                const activityOfflineVersionId = OfflineCollectionVersions.findOne({collection:'activity'})._id;

                // Sync the Locations collection
                if (payload && payload.collection === 'offlineCollectionVersions') {
                    const newLocationsOfflineVersion = payload.fields && (payload.id === locationsOfflineVersionId) && payload.fields.offlineVersion;
                    const oldLocationsOfflineVersion = OfflineCollectionVersions.findOne(locationsOfflineVersionId).offlineVersion;
                    const newActivityOfflineVersion = payload.fields && (payload.id === activityOfflineVersionId) && payload.fields.offlineVersion;
                    const oldActivityOfflineVersion = OfflineCollectionVersions.findOne(activityOfflineVersionId).offlineVersion;



                    // Sync the Locations collection
                    if (newLocationsOfflineVersion && newLocationsOfflineVersion !== oldLocationsOfflineVersion && changedEventIds.indexOf(newLocationsOfflineVersion) === -1) {
                        //console.log(`newLocationsOfflineVersion: ${newLocationsOfflineVersion}; oldLocationsOfflineVersion: ${oldLocationsOfflineVersion}`);

                        // TODO: prevent the same 'changed' event to trigger a sync. See react-native-meteor internals
                        changedEventIds.push(newLocationsOfflineVersion);

                        !Locations.syncing && Locations.sync({
                            query: query,
                            options: options,
                            syncCallback: (locations) => {
                                console.log('synced Locations in index.js');
                                console.log(`Number of locations: ${locations && locations.length}`);
                            }
                        });
                    }

                    // Sync the Activity collection
                    if (newActivityOfflineVersion && newActivityOfflineVersion !== oldActivityOfflineVersion && changedEventIds.indexOf(newActivityOfflineVersion) === -1) {
                        //console.log(`newActivityOfflineVersion: ${newActivityOfflineVersion}; oldActivityOfflineVersion: ${oldActivityOfflineVersion}`);

                        // TODO: prevent the same 'changed' event to trigger a sync. See react-native-meteor internals
                        changedEventIds.push(newActivityOfflineVersion);

                        !Activity.syncing && Activity.sync({
                            query: {},
                            syncCallback: (activity) => {
                                console.log('synced Activity in index.js');
                                console.log(`Number of activities: ${activity && activity.length}`);
                            }
                        });
                    }

                }
            });

        }
    };


    return {
        user: Meteor.user(),
    };
}, App);
