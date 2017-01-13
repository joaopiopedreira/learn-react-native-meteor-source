import React, { Component, PropTypes } from 'react';
import {
  Text,
  ScrollView,
} from 'react-native';
import { create } from 'react-native-platform-stylesheet';
import { Card, Button, List, ListItem } from 'react-native-elements';
import Meteor, { createContainer } from 'react-native-meteor';
import _ from 'lodash';

import colors from '../config/colors';
import { TEMP_ACTIVITY } from '../config/tempData';

const styles = create({
  container: {
    backgroundColor: colors.background,
  },
});

class LocationDetails extends Component {
  static defaultProps = {
    // activity: [],
    activity: TEMP_ACTIVITY,
  }

  attemptCheckin = () => {
    const { location } = this.props;
    let status = 'in';
    if (location.checkedInUserId) {
      status = 'out';
    }

    if (this.props.user !== null) {
      // TODO: Stuff
      Meteor.call('Locations.changeCheckin', { locationId: location._id, status }, (err) => {
        if (err) {
          // TODO: Handle error
          // eslint-disable-next-line no-console
          console.log('Locations.changeCheckin error: ', err);
        } else {
          // TODO: Optimistic update?
        }
      });
    } else {
      this.props.navigation.performAction(({ tabs }) => {
        tabs('main').jumpToTab('account');
      });
    }
  };

  render() {
    const location = this.props.location || _.get(this.props, 'route.params.location', {});
    return (
      <ScrollView style={styles.container}>
        <Card
          title={location.station_name}
        >
          <Text>{location.street_address}</Text>
          <Text>{location.access_days_time}</Text>
        </Card>
        <Button
          raised
          icon={{ name: 'check' }}
          title="Check In"
          backgroundColor={colors.primary}
          onPress={this.attemptCheckin}
          buttonStyle={{ marginVertical: 20 }}
        />
        <Card
          title="Activity"
        >
          <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0, marginTop: 0 }}>
            {/* TODO: Handle when there is no activity */}
            {
              this.props.activity.map((l) => (
                <ListItem
                  roundAvatar
                  key={l._id}
                  title={l.username}
                  leftIcon={{ name: 'check' }} // should be conditional based on type
                />
              ))
            }
          </List>
        </Card>
      </ScrollView>
    );
  }
}

LocationDetails.propTypes = {
  navigation: PropTypes.object.isRequired,
  activity: PropTypes.array,
  user: PropTypes.object,
  location: PropTypes.object,
};

const ConnectedLocationDetails = createContainer((params) => {
  const location = _.get(params, 'route.params.location', {});
  Meteor.subscribe('Locations.pub.details', { locationId: location._id });
  const activityHandle = Meteor.subscribe('Activity.pub.list', { locationId: location._id });
  return {
    user: Meteor.user(),
    location: Meteor.collection('locations').findOne({ _id: location._id }),
    activityReady: activityHandle.ready(),
    activity: Meteor.collection('activity').find({ locationId: location._id }),
  };
}, LocationDetails);

// TODO: Is there a better way to do this?
ConnectedLocationDetails.route = {
  navigationBar: {
    visible: true,
    title: 'Location Details',
  },
};

export default ConnectedLocationDetails;
