/**
 * Created by joaopedreira on 30/01/17.
 */

import { Mongo } from 'meteor/mongo';

let collections = {};

export default function OfflineMongo(name, options) {

    const newCollection = new Mongo.Collection(name, options);

    collections[name] = newCollection;

    return newCollection;
}


export { collections };



