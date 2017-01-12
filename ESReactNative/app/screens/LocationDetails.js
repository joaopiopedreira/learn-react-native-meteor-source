import React, { Component, PropTypes } from 'react';
import {
  Text,
  ScrollView,
} from 'react-native';
import { create } from 'react-native-platform-stylesheet';
import { Card, Button, List, ListItem } from 'react-native-elements';

import colors from '../config/colors';
// import Router from '../config/router';
import { TEMP_ACTIVITY } from '../config/tempData';

const styles = create({
  container: {
    backgroundColor: colors.background,
  },
});

class LocationDetails extends Component {
  static route = {
    navigationBar: {
      visible: true,
      title: 'Location Details',
    },
  }

  static defaultProps = {
    // activity: [],
    activity: TEMP_ACTIVITY,
  }

  attemptCheckin = () => {
    const LOGGED_IN = false;
    if (LOGGED_IN) {
      // TODO: Stuff
    } else {
      this.props.navigation.performAction(({ tabs }) => {
        tabs('main').jumpToTab('account');
      });
    }
  };

  render() {
    const { location } = this.props.route.params;
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
  route: PropTypes.object,
  activity: PropTypes.array,
};

export default LocationDetails;
