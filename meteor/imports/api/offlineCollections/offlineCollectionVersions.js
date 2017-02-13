/**
 * Created by joaopedreira on 06/02/17.
 */

import { Mongo } from 'meteor/mongo';

const OfflineCollectionVersions = new Mongo.Collection('offlineCollectionVersions');

OfflineCollectionVersions.allow({
    insert: () => true,
    update: () => true,
    remove: () => true,
});

export default OfflineCollectionVersions;

