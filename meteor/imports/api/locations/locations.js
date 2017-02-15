import OfflineMongo from '../../api/offlineCollections/collectionTransformer';
import OfflineCollectionVersions from '../../api/offlineCollections/offlineCollectionVersions';
import { Random } from 'meteor/random';
const collectionName = 'locations';

if(!OfflineCollectionVersions.findOne({collection:collectionName})) {
    OfflineCollectionVersions.insert({
        collection:collectionName,
        offlineVersion: Random.id()
    });
}

export const Locations = new OfflineMongo(collectionName);

Locations.rawCollection().createIndex({ location: '2dsphere' });

Locations.allow({
    insert: () => false,
    update: () => true,
    remove: () => false,
});
