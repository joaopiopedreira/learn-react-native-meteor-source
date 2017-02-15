/**
 * Created by joaopedreira on 15/02/2017.
 */

import Meteor, { getData } from 'react-native-meteor';
import { AsyncStorage } from 'react-native'

const OfflineUser = new Meteor.Collection('users');

OfflineUser.user = () => {
    if(Meteor.user()) {
        return Meteor.user();
    } else {
        return OfflineUser.find()[0];
    }
};

OfflineUser.store = (item) => {
    AsyncStorage.setItem(`offlineCollection:offlineUser`, JSON.stringify(item)).then(() => {
        try {
            console.log(`OfflineUser now has ${item && item.length} documents in AsyncStorage.`);
        }
        catch (e) {
            console.error(e.message);
        }
    }, (error) => {
        console.error(error.message);
    });
};

OfflineUser.seed = () => {
    if(OfflineUser.find().length === 0) { // we are offline or we are making an initial sync
        AsyncStorage.getItem(`offlineCollection:offlineUser`).then((value) => {
            try {
                value = JSON.parse(value);
                const existingDocs = value || [];
                if (existingDocs.length > 0) {
                    getData().db['users'].upsert(existingDocs);
                }
                console.log(`OfflineUser seeded with ${existingDocs.length} docs from AsyncStorage.`);
            }
            catch (e) {
                console.error(e.message);
            }
        }, (error) => {
            console.log(error.message);
        });
    }
};

export default OfflineUser;