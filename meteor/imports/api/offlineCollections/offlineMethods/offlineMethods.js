/**
 * Created by joaopedreira on 30/01/17.
 */

import { Meteor } from 'meteor/meteor';
import { collections } from '../collectionTransformer';
import { _ } from 'meteor/underscore'
import { check, Match } from 'meteor/check';


Meteor.methods({

    /**
     * Make diff client/server data and return the differences
     * @param.existing - represents the data in the client. This is an array of objects containing the _id and __offlineVersion fields.
     * ( example: [{_id: 123, __offlineVersion: 456}] )
     * @param.name - the collection name
     * @param.query - the Mongo query to apply to the collection
     * @param.options - the Mongo query options
     * @returns {{newDocs: Array, updatedDocs: Array, removedDocs: Array}}
     */
    offlineGetChanges: function(params) {
        console.log(params);
        check(params, {
            existing: Array,
            name: String,
            query: Object,
            options: Match.Optional(Object)
        });

        this.unblock();

        let currentIds = {};
        let results = {
            newDocs: [],
            updatedDocs: [],
            removedDocs: []
        };

        // Separate the existing array into 2: one with _id and another with __offlineVersion
        let existingIds = _.pluck(params.existing,'_id');
        let existingVersions = _.pluck(params.existing,'__offlineVersion');

        // Get new docs
        results.newDocs = collections[params.name]._collection.find(_.extend(params.query || {}, {
            _id: {
                $nin: existingIds
            }
        }), params.options || {}).fetch();

        // Get updated docs
        results.updatedDocs = collections[params.name]._collection.find(_.extend(params.query || {}, {
            _id: {
                $in: existingIds
            },
            __offlineVersion: {
                $nin: existingVersions
            }
        }), params.options || {}).fetch();

        // Get removed docs
        collections[params.name]._collection.find(params.query || {}, {
            fields: {
                _id: true
            }
        }).forEach(function (doc) {
            currentIds[doc._id] = true;
        });

        results.removed = existingIds.filter(function (docId) {
            return !(docId in currentIds);
        });

        return results;
    }

});
