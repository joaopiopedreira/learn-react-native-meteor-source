#UPDATE: Use with OfflineCollections

This project illustrates how to use OfflineCollections: an offline wrapper 
to use with React-Native/Meteor projects.

OfflineCollections will make use of AsyncStorage to store your data for offline use.

###Overview

It works in the following way:

- When you use the app for the first time, it pulls from the server the latest data available from the collections you've enabled for offline use.

- When the data arrives to the app, it's stored in AsyncStorage and the respective collections are hydrated (i.e. loaded into memory).
The field `__offlineVersion` is added to each offline collection record to keep track of its version.

- A master collection `OfflineCollectionVersions` with metadata about all offline collections is kept for sync purposes. This collection has a schema like the following:
```
{
    collection: OfflineCollectionA: 
    offlineVersion: "some random id"
}
{
    collection: OfflineCollectionB: 
    offlineVersion: "some random id"
}
```
This is the only collection to which we subscribe normally 
(we run a DDP observer in this collection for the `changed` event). A change
in this collection is the trigger for the synchronization process 
(in the case of this example, the sign in process will also trigger 
a synchronization).

- Every `update`, `insert` or `delete` in a given offline collection change the `offlineVersion`
field in `OfflineCollectionVersions` for the corresponding collection. Every `update` instruction
will also change the `__offlineVersion` of the changed record.

- Upon synchronization (the `sync()` method in the `OfflineCollection` class),
the client sends the server an array containing the `_id` and the `__offlineVersion`
fields of the records it keeps in each collection. Something like this:
```
[
    {
        _id: "some rancom id",
        __offlineVersion: "some rancom id"
    },
    {
        _id: "some rancom id",
        __offlineVersion: "some rancom id"
    },
    (...)    
]
```
This is done via methods (see meteor method 
`offlineGetChanges` in `meteor/imports/api/offlineCollections/offlineMethods/offlineMethods.js`). 
This is a relatively cheap call we're making to the server (an array with
2 id objects per record). The server then diffs the data and replies with instructions
on what to change in the client: "ok client, given what you have right now, 
you should 1) add these records, 2) remove those and 3) udpate these".
A response from the server will look like this:
```
{
    newDocs: [/* array with new docs the client should have */],
    updatedDocs: [/* array with updated docs the client should modify */],
    removedDocs: [/* array with id's the client should remove */]
}
```
The client then receives this server response and performs the client diff.
This is done at the `Bulk` class (`react-native/app/config/offlineCollections/Bulk.js`).

###What am I doing in this example

An offline-first app must be very aggressive when is comes to fetching and 
storing the data. The network may go down in the next minute and we might not
have the chance to do it then. So, what I do is to fetch and store the server
data as soon as I can. I'm doing this after a successful login:




# Original Readme from Spencer Carli

The complete example app to go along with [Learn React Native + Meteor](http://handlebarlabs.teachable.com/p/react-native-meteor). A detailed overview and getting started guide is available in the course.

## Getting Started

- [Install Meteor](https://www.meteor.com/install)
- [Install React Native](https://facebook.github.io/react-native/docs/getting-started.html#content) and its dependencies

### Meteor

- `cd meteor`
- `meteor npm install`
- `meteor`

### iOS Simulator

- `cd react-native`
- `react-native run-ios`

### Android Simulator/Emulator

* Make sure the simulator/emulator is already running

- `cd react-native`
- Change `localhost` to your machine's IP address in `react-native/app/config/config.js`
- `react-native run-android`

### iOS Device

- `cd react-native`
- Connect your device via USB
- Change `localhost` to your machine's IP address in `react-native/app/config/config.js`
- `adb reverse tcp:8081 tcp:8081`
- `react-native run-ios`

### Android Device

- `cd react-native`
- Connect your device via USB
- Change `localhost` to your machine's IP address in `react-native/app/config/config.js`
- `adb reverse tcp:8081 tcp:8081`
- `react-native run-android`
