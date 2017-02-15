import React, {Component, PropTypes} from 'react';
import {
    Text,
} from 'react-native';
import {Card, Button, List, ListItem} from 'react-native-elements';
import Meteor, {createContainer} from 'react-native-meteor';
import _ from 'lodash';
import moment from 'moment';
import colors from '../config/colors';
import Container from '../components/Container';
import NotFound from '../components/NotFound';
import {Header} from '../components/Text';
import Activity from '../config/offlineCollections/Activity';
import Locations from '../config/offlineCollections/Locations';
import config from '../config/config';


const CHECKED_IN = 'in';
const CHECKED_OUT = 'out';

class LocationDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            changingStatus: false,
        };
    }

    data = () => {
        const locationId = this.props.route.params.location._id;
        const location = Locations.findOne(locationId);
        const activities = Activity.find({ locationId: locationId }, {sort: {createdAt: -1}});
        const user = Meteor.user();

        return {
            user: user,
            activitiesReady: Activity.ready(),
            locationsReady: Locations.ready(),
            location: location,
            locationId: locationId,
            activityCount: activities.length,
            userId: user._id,
            activities: activities
        }
    };

    changeCheckin = (location, status) => {
        const locationId = location._id;

        if (!this.data().user) {
            const error = 'Must be logged in to change checkin status.';
            this.props.navigator.showLocalAlert(error, config.errorStyles);
            return;
        }

        if (status === 'in' && location.checkedInUserId === this.data().userId) {
            const error = `You're already checked in at this location.`;
            this.props.navigator.showLocalAlert(error, config.errorStyles);
            return;
        }

        if (status === 'in' && location.checkedInUserId) {
            const error = 'Someone is already checked in at this location.';
            this.props.navigator.showLocalAlert(error, config.errorStyles);
            return;
        }

        if (status === 'out' && location.checkedInUserId !== this.data().userId) {
            const error = `You're not checked into this location.`;
            this.props.navigator.showLocalAlert(error, config.errorStyles);
            return;
        }

        const existingCheckin = Locations.findOne({ checkedInUserId: this.data().userId });
        if (status === 'in' && existingCheckin) {
            const error = `You're already checked in at a different location.`;
            this.props.navigator.showLocalAlert(error, config.errorStyles);
            return;
        }

        if (status === 'in') {
            Locations.update(locationId, {
                $set: {
                    checkedInUserId: this.data().user._id
                },
            });
        } else {
            Locations.update(locationId, {
                $set: {
                    checkedInUserId: ''
                },
            });
        }

        Activity.insert({
            createdAt: new Date(),
            username: this.data().user.username,
            userId: this.data().user._id,
            type: status,
            locationId,
        });

    };

    attemptCheckin = () => {
        const location = this.data().location;
        let status = CHECKED_IN;
        if (location.checkedInUserId) {
            status = CHECKED_OUT;
        }

        if (this.data().user !== null) {
            this.setState({changingStatus: true});

            this.changeCheckin(location,status);
            this.setState({changingStatus: false});

            // Meteor.call('Locations.changeCheckin', {locationId: location._id, status}, (err) => {
            //     if (err) {
            //         this.props.navigator.showLocalAlert(err.reason, config.errorStyles);
            //     }
            //     this.setState({changingStatus: false});
            // });
        } else {
            this.props.navigation.performAction(({tabs}) => {
                tabs('main').jumpToTab('account');
            });
        }
    };

    renderItems = () => {
        if (!this.data().activitiesReady) {
            return <Header>Loading...</Header>;
        } else {
            if (this.data().activities.length === 0) {
                return (
                    <NotFound
                        text="No activity yet."
                        small
                    />
                );
            }
        }

        return this.data().activities.map((a) => (
            <ListItem
                key={a._id}
                title={a.username}
                subtitle={moment(a.createdAt).format('MMM Do @ h:mma')}
                rightTitle={a.type === CHECKED_IN ? 'Checked In' : 'Checked Out'}
            />
        ));
    };

    render() {
        const location = this.data().location || _.get(this.props, 'route.params.location', {});
        const checkedIn = location.checkedInUserId === this.data().userId; //_.get(this.props, 'user._id', '');

        return (
            <Container scroll>
                <Card
                    title={location.station_name}
                >
                    <Text>{location.street_address}</Text>
                    <Text>{location.access_days_time}</Text>
                </Card>
                <Button
                    raised
                    icon={checkedIn ? {name: 'close'} : {name: 'check'}}
                    title={checkedIn ? 'Check Out' : 'Check In'}
                    backgroundColor={checkedIn ? colors.red : colors.primary}
                    onPress={this.attemptCheckin}
                    buttonStyle={{marginVertical: 20}}
                    loading={this.state.changingStatus}
                />
                <Card
                    title="Activity"
                >
                    <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0, marginTop: 0}}>
                        {this.renderItems()}
                    </List>
                </Card>
            </Container>
        );
    }
}

LocationDetails.propTypes = {
    navigation: PropTypes.object.isRequired,
    activity: PropTypes.array,
    user: PropTypes.object,
    location: PropTypes.object,
    navigator: PropTypes.object,
    activityReady: PropTypes.bool,
};

LocationDetails.defaultProps = {
    activity: [],
};

const ConnectedLocationDetails = createContainer((params) => {

    return {};
}, LocationDetails);

// Is there a better way to do this? If we put it on the initial component then
// ex-navigation doesn't pick it up
ConnectedLocationDetails.route = {
    navigationBar: {
        visible: true,
        title: 'Location Details',
    },
};

export default ConnectedLocationDetails;
