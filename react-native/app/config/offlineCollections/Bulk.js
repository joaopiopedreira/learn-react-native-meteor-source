/**
 * Created by joaopedreira on 30/01/17.
 */

import _ from 'lodash';
import { getData } from 'react-native-meteor';

export default class Bulk  {
    constructor(collectionName) {
        this.collectionName = collectionName;
    }

    update(documents) {
        let updQuery = {}
            ,oldDocument = {}
            , prop;

        if(documents && !_.isArray(documents)){
            documents = [documents];
        }

        if(this.collectionName && documents.length > 0) {
            documents.forEach((item) => {
                if(_.isObject(item)) {
                    oldDocument = getData().db[this.collectionName].findOne({_id:item._id});
                    updQuery.$set = {};
                    if(oldDocument){
                        for(prop in item){
                            if(item.hasOwnProperty(prop)){
                                if(_.isObject(item[prop])){
                                    if(JSON.stringify(oldDocument[prop]) !== JSON.stringify(item[prop])) {
                                        updQuery.$set[prop] = item[prop];
                                    }
                                } else {
                                    if(!_.isEqual(oldDocument[prop],item[prop])) {
                                        updQuery.$set[prop] = item[prop];
                                    }
                                }

                            }
                        }
                    }
                    if(!_.isEmpty(updQuery.$set)){
                        //collection.update(item._id,updQuery); // the meteor way
                        getData().db[this.collectionName].upsert(item);
                    }
                }
            });
        }
    };

    insert(documents) {
        if(this.collectionName) {
            getData().db[this.collectionName].upsert(documents);
        }
    };

    remove (ids) {
        console.log(ids);
        if (this.collectionName && ids && ids.length > 0) {
            getData().db[this.collectionName].remove({_id:{$in:ids}});
        }
    }

    removeAll() {
        if (this.collectionName) {
            getData().db[this.collectionName].remove({});
        }
    }

};
