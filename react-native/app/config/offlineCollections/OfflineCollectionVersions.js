/**
 * Created by joaopedreira on 07/02/17.
 */

import Meteor, { getData } from 'react-native-meteor';
import { AsyncStorage } from 'react-native'

const OfflineCollectionVersions = new Meteor.Collection('offlineCollectionVersions');

OfflineCollectionVersions.store = (item) => {
    AsyncStorage.setItem(`offlineCollection:offlineCollectionVersions`, JSON.stringify(item)).then(() => {
        try {
            console.log(`OfflineCollectionVersions now has ${item && item.length} documents in AsyncStorage.`);
        }
        catch (e) {
            console.error(e.message);
        }
    }, (error) => {
        console.error(error.message);
    });
};

OfflineCollectionVersions.seed = () => {
    if(OfflineCollectionVersions.find().length === 0) { // we are offline or we are making an initial sync
        AsyncStorage.getItem(`offlineCollection:offlineCollectionVersions`).then((value) => {
            try {
                value = JSON.parse(value);
                const existingDocs = value || [];
                if (existingDocs.length > 0) {
                    getData().db['offlineCollectionVersions'].upsert(existingDocs);
                }
                console.log(`OfflineCollectionVersions seeded with ${existingDocs.length} docs from AsyncStorage.`);
            }
            catch (e) {
                console.error(e.message);
            }
        }, (error) => {
            console.log(error.message);
        });
    }
};

export default OfflineCollectionVersions;