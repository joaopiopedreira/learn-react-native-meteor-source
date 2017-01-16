import React, { Component, PropTypes } from 'react';
import {
  Text,
} from 'react-native';
import { Card, Button, List, ListItem } from 'react-native-elements';
import Meteor, { createContainer } from 'react-native-meteor';
import _ from 'lodash';
import moment from 'moment';
import colors from '../config/colors';
import Container from '../components/Container';
import config from '../config/config';
import NotFound from '../components/NotFound';
import { Header } from '../components/Text';

const CHECKED_IN = 'in';
const CHECKED_OUT = 'out';

class LocationDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      changingStatus: false,
    };
  }

  attemptCheckin = () => {
    const { location } = this.props;
    let status = CHECKED_IN;
    if (location.checkedInUserId) {
      status = CHECKED_OUT;
    }

    if (this.props.user !== null) {
      this.setState({ changingStatus: true });
      Meteor.call('Locations.changeCheckin', { locationId: location._id, status }, (err) => {
        if (err) {
          this.props.navigator.showLocalAlert(err.reason, config.errorStyles);
        }
        this.setState({ changingStatus: false });
      });
    } else {
      this.props.navigation.performAction(({ tabs }) => {
        tabs('main').jumpToTab('account');
      });
    }
  };

  renderItems = () => {
    if (!this.props.activityReady) {
      return <Header>Loading...</Header>;
    } else if (this.props.activity.length === 0) {
      return (
        <NotFound
          text="No activity yet."
          small
        />
      );
    }

    return this.props.activity.map((a) => (
      <ListItem
        key={a._id}
        title={a.username}
        subtitle={moment(a.createdAt).format('MMM Do @ h:mma')}
        rightTitle={a.type === CHECKED_IN ? 'Checked In' : 'Checked Out'}
      />
    ));
  };

  render() {
    const location = this.props.location || _.get(this.props, 'route.params.location', {});
    const checkedIn = location.checkedInUserId === _.get(this.props, 'user._id', '');

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
          icon={checkedIn ? { name: 'close' } : { name: 'check' }}
          title={checkedIn ? 'Check Out' : 'Check In'}
          backgroundColor={checkedIn ? colors.red : colors.primary}
          onPress={this.attemptCheckin}
          buttonStyle={{ marginVertical: 20 }}
          loading={this.state.changingStatus}
        />
        <Card
          title="Activity"
        >
          <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0, marginTop: 0 }}>
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
  const location = _.get(params, 'route.params.location', {});

  Meteor.subscribe('Locations.pub.details', { locationId: location._id });
  const activityHandle = Meteor.subscribe('Activity.pub.list', { locationId: location._id });

  return {
    user: Meteor.user(),
    location: Meteor.collection('locations').findOne({ _id: location._id }),
    activityReady: activityHandle.ready(),
    activity: Meteor.collection('activity').find({ locationId: location._id }, { sort: { createdAt: -1 } }),
  };
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
