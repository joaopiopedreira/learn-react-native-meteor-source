import React, { Component, PropTypes } from 'react';
import { List, ListItem } from 'react-native-elements';
import _ from 'lodash';
import NotFound from '../components/NotFound';
import Router from '../config/router';
import Container from '../components/Container';

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
      <Container scroll>
        {
          locations.length === 0 ? <NotFound text="No locations found." /> :
          <List>
            {
              locations.map((l) => (
                <ListItem
                  key={l._id}
                  title={l.station_name}
                  subtitle={this.subTitle(l)}
                  onPress={() => this.goToLocationDetails(l)}
                />
              ))
            }
          </List>
        }
      </Container>
    );
  }
}

NearMe.propTypes = {
  navigator: PropTypes.object.isRequired,
};

export default NearMe;
