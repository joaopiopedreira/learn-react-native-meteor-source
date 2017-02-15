/**
 * Created by joaopedreira on 07/02/17.
 */

import { Meteor } from 'meteor/meteor';
import OfflineCollectionVersions from '../offlineCollectionVersions';

Meteor.publish('offlineCollectionVersions', function getOfflineCollectionVersions() {
    //console.log(OfflineCollectionVersions.find().fetch());
    return OfflineCollectionVersions.find();
});

Meteor.publish('users', function getUsersForOffline(userId) {
    return Meteor.users.find(userId);
});