//import { Mongo } from 'meteor/mongo';
import OfflineMongo from '../../api/offlineCollections/collectionTransformer';
import OfflineCollectionVersions from '../../api/offlineCollections/offlineCollectionVersions';
import { Random } from 'meteor/random';
const collectionName = 'activity';

OfflineCollectionVersions.remove({collection:collectionName});
OfflineCollectionVersions.insert({
    collection:collectionName,
    offlineVersion: Random.id()
});

export const Activity = new OfflineMongo(collectionName);

Activity.allow({
    insert: () => true,
    update: () => true,
    remove: () => true,
});
