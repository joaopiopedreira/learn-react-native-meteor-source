import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
} from 'react-native';
import { create } from 'react-native-platform-stylesheet';
import { List, ListItem } from 'react-native-elements';
import _ from 'lodash';

import colors from '../config/colors';
import NotFound from '../components/NotFound';
import Router from '../config/router';

const styles = create({
  container: {
    backgroundColor: colors.background,
  },
});

class NearMe extends Component {
  static route = {
    navigationBar: {
      visible: true,
      title: 'Near Me',
    },
  }

  goToLocationDetails = (location) => {
    this.props.navigator.push(Router.getRoute('locationDetails', { location }));
  };

  subTitle = (location) => {
    let subtitle = '';
    if (location.street_address) {
      subtitle = location.street_address;
    }

    if (location.access_days_time && subtitle.length) {
      subtitle = `${subtitle} - ${location.access_days_time}`;
    } else if (location.access_days_time) {
      subtitle = location.access_days_time;
    }

    return subtitle;
  };

  render() {
    const locations = _.get(this.props, 'route.params.locations', []);
    return (
      <ScrollView style={styles.container}>
        {
          locations.length === 0 ? <NotFound text="No locations found." /> :
          <List>
            {
              locations.map((l) => (
                <ListItem
                  roundAvatar
                  key={l._id}
                  title={l.station_name}
                  subtitle={this.subTitle(l)}
                  onPress={() => this.goToLocationDetails(l)}
                />
              ))
            }
          </List>
        }
      </ScrollView>
    );
  }
}

NearMe.propTypes = {
  navigator: PropTypes.object.isRequired,
};

export default NearMe;
