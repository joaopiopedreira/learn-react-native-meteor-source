import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
} from 'react-native';
import { create } from 'react-native-platform-stylesheet';
import { List, ListItem } from 'react-native-elements';

import colors from '../config/colors';
import NotFound from '../components/NotFound';
import Router from '../config/router';
import { TEMP_LOCATIONS } from '../config/tempData';

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
    return (
      <ScrollView style={styles.container}>
        {
          this.props.locations.length === 0 ? <NotFound text="No locations found." /> :
          <List>
            {
              this.props.locations.map((l) => (
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
  locations: PropTypes.array,
};

NearMe.defaultProps = {
  // locations: [],
  locations: TEMP_LOCATIONS,
};

export default NearMe;
