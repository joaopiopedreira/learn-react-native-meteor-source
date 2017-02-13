/**
 * Created by joaopedreira on 30/01/17.
 */

import Meteor, { ReactiveDict, Tracker, Collection, getData, call } from 'react-native-meteor';
import { AsyncStorage } from 'react-native';
import Bulk from './Bulk';
import Random from './randomid';
import _ from 'lodash';
import OfflineCollectionVersions from './OfflineCollectionVersions';

/**
 * Extends the 'react-native-meteor' to add offline logic
 */
export default class OfflineCollection extends Collection {
    constructor(name, options = {}) {
        super(name, options);
        this.name = name;
        this.options = options;
        this.existingDocs = [];
        this.syncing = false;
        this._readyFlag = new ReactiveDict();
        this._readyFlag.set('ready', false);
        this._syncFlag = new ReactiveDict();
        this._syncFlag.set('synced', false);
        this.bulk = new Bulk(name);
        /**
         * Overrides the 'react-native-meteor' update method. This is like a collection hook - the purpose here
         * is to add (or update) the __offlineVersion field before every update and the collection version is updated.
         * @param id
         * @param modifier
         * @param options
         * @param callback
         */
        this.update = (id, modifier, options = {}, callback = () => {}) => {

            if (modifier.$set) {
                _.extend(modifier.$set, {
                    __offlineVersion: Random.id()
                });
            } else {
                _.extend(modifier, {
                    $set: {
                        __offlineVersion: Random.id()
                    },
                });
            }

            // Normal Collection update
            super.update(id, modifier, options, callback);

            // Update the offlineCollectionVersions versions collection
            this.updateServerVersions((err) => {
                if(err) {
                    console.error('error updating server versions',err);
                } else {
                    console.log('server versions updated!');
                }
            })
        };

        /**
         * Overrides the 'react-native-meteor' insert method. Make sure that the __offlineVersion field is in the collection
         * and the collection version is updated.
         * @param item
         * @param callback
         */
        this.insert = (item, callback = () => {}) => {
            _.extend(item, {
                __offlineVersion: Random.id()
            });
            super.insert( item, callback );

            // Update the offlineCollectionVersions versions collection
            this.updateServerVersions((err) => {
                if(err) {
                    console.error('error updating server versions',err);
                } else {
                    console.log('server versions updated!');
                }
            })
        };

        /**
         * Overrides the 'react-native-meteor' remove method. Make sure that the collection version is updated.
         * @param id
         * @param callback
         */
        this.remove = (id, callback = ()=>{}) => {

            super.remove( id, callback );

            // Update the offlineCollectionVersions versions collection
            this.updateServerVersions((err) => {
                if(err) {
                    console.error('error updating server versions');
                } else {
                    console.log('server versions updated!');
                }
            })

        }

    }

    /**
     * Store collection items in AsyncStorage
     * @param item
     */
    store(item) {
        AsyncStorage.setItem(`offlineCollection:${this.name}`, JSON.stringify(item)).then(() => {
            try {
                console.log(`Offline Collection "${this.name}" now has ${item && item.length} documents stored locally.`);
            }
            catch (e) {
                console.error(e.message);
            }
        }, (error) => {
            console.log(error.message);
        });
    }

    /**
     * Seeds a collection with AsyncStorage values
     */
    seed() {
        AsyncStorage.getItem(`offlineCollection:${this.name}`).then((value) => {
            try {
                value = JSON.parse(value);
                this.existingDocs = value || [];
                if (this.existingDocs.length > 0) {
                    this.bulk.insert(this.existingDocs);
                }
                this._readyFlag.set('ready', true);
                console.log(`Offline Collection ${this.name} seeded with ${this.existingDocs.length} docs from AsyncStorage.`);
            }
            catch (e) {
                console.error(e.message);
            }
        }, (error) => {
            console.log(error.message);
        });
    }

    /**
     * Syncs data with the server. Sends the server an array with the collecion id's and __offlineVersion's. The server
     * returns the diff (what the client should have added, removed or changed). Then this CRUD operations are performed
     * in the client to have the collection up to date.
     * @param options.query - the query to pass to the meteor method when data is fetched from the server
     * @param options.hydrate - if true, the collection is immediately hydrated (put in memory). If false, it's simply fetched and copied to AsyncStorage.
     * @param options.options - the query options to pass to the meteor method when data is fetched from the server
     * @param options.syncCallback - a callback to catch when the data syncing is done
     */
    sync(options) {
        let params = {};

        if (_.isEmpty(options)) {
            return;
        }

        AsyncStorage.getAllKeys((err, keys) => console.log(`AsyncStorage keys: ${keys}`));

        this.seed();

        console.log(options);

        options.options = options.options || {};

        if (this.syncing) {
            throw new Meteor.Error('already_syncing', 'Cannot sync whilst already syncing');
        }

        let jobsComplete = {
                remove: false,
                insert: false,
                update: false
            },
            completionDep = new Tracker.Dependency(),
            results = {},
            currentIds = [];

        this._syncFlag.set('synced', false);

        Tracker.autorun((outerComp) => {

            console.log(`in 1st Tracker: ${!this.syncing}`);

            if (!this.syncing) {

                this.syncing = true;

                currentIds = this.find({}, {
                    reactive: false,
                    fields: {
                        _id: 1,
                        __offlineVersion: 1
                    }
                });

                params.existing = currentIds;
                params.name = this.name;
                params.query = options.query;
                params.options = options.options || {};

                let offlineCacheWillRefresh = false;
                if (!Meteor.status().connected) {
                    completionDep.changed();
                    jobsComplete.remove = true;
                    jobsComplete.insert = true;
                    jobsComplete.update = true;

                } else {
                    offlineCacheWillRefresh = true;
                    Meteor.call('offlineGetChanges', params, (err, res) => {
                        if (err) {
                            console.error(err.reason);
                        }

                        if (res && res.removedDocs) {
                            console.log(`in removeDocs: ${res.removedDocs.length} records`);
                            this.bulk.remove(res.removedDocs);
                            results.removed = res.removedDocs;
                            jobsComplete.remove = true;
                        }

                        if (res && res.newDocs) {
                            console.log(`in newDocs: ${res.newDocs.length} records`);
                            results.inserted = res.newDocs;
                            this.bulk.insert(res.newDocs);
                            jobsComplete.insert = true;
                        }

                        if (res && res.updatedDocs) {
                            console.log(`in updatedDocs: ${res.updatedDocs.length} records`);
                            results.updated = res.updatedDocs;
                            this.bulk.update(res.updatedDocs);
                            jobsComplete.update = true;
                        }

                        completionDep.changed();

                    });
                }


                Tracker.autorun((innerComp) => {

                    completionDep.depend();

                    if (jobsComplete.remove && jobsComplete.insert && jobsComplete.update) {

                        innerComp.stop();
                        outerComp.stop();
                        this._syncFlag.set('synced', true);
                        this.syncing = false;
                        this._readyFlag.set('ready', true);

                        const syncedCollection = this.find();
                        console.log(syncedCollection.length);

                        try {
                            // Store the collection only if we were online and got results from the server
                            offlineCacheWillRefresh && this.store(syncedCollection);
                            // Immediately clear the collection from memory (but not from AsyncStorage,
                            // so that it can be hydrated at any moment we choose.
                            !options.hydrate && this.clear(false);
                            console.log(`Offline Collection "${this.name}" now has ${syncedCollection.length} documents stored locally.`);
                            options.syncCallback && options.syncCallback.call(null, syncedCollection);

                        }
                        catch(e) {
                            console.error(e.message);
                        }

                    }
                });
            }
        });
    }

    updateServerVersions(callback = () => {}) {
        const offlineCollectionVersions = OfflineCollectionVersions.findOne({collection: this.name});
        const offlineCollectionVersionsId = offlineCollectionVersions && offlineCollectionVersions._id;
        let modifier = {};
        modifier.$set = {offlineVersion: Random.id()};

        console.log('in updateServerVersions');
        console.log(offlineCollectionVersionsId, modifier);

        getData().waitDdpConnected(()=>{
            call(`/offlineCollectionVersions/update`, {_id:offlineCollectionVersionsId}, modifier, (err) => {
                if(err) {
                    return callback(err);
                }
                callback(null, offlineCollectionVersionsId);
            });
        });
    }

    /**
     * Empties the meteor collection and removes it from AsyncStorage.
     * @param removeLocalCopy - Boolean. If set to true, removes the collection from AsyncStorage
     */
    clear(removeLocalCopy) {
        this.bulk.removeAll();
        removeLocalCopy && AsyncStorage.removeItem(`offlineCollection:${this.name}`);
        this._syncFlag.set('synced', true);
    }

    /**
     * Reactive method to signal that the collection is ready (like collection.ready() in meteor).
     * @returns {*}
     */
    ready() {
        return this._readyFlag.get('ready');
    }

    /**
     * Reactive method to signal that the collection is synced.
     * @returns {*}
     */
    synced() {
        return this._syncFlag.get('synced');
    }

}