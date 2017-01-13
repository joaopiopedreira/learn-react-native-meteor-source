import { Meteor } from 'meteor/meteor';
import { Locations } from '../locations';

// TODO: Only return the necessary fields
Meteor.publish('Locations.pub.details', function getLocationDetails({ locationId }) {
  return Locations.find({ _id: locationId });
});
