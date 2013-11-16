"use strict";

var Q = require('q');
var Collection = require('./collection');
var Admin = require('./admin');
var ObjectID = require('mongodb').ObjectID;

var Db = function(db){
    this.db = db;
}

module.exports = Db;

Db.prototype.db = function (dbName) {
    return new Db(this.db.db(dbName))
};

Db.prototype.toObjectID = Db.prototype.toId = exports.toObjectID = exports.toId = function (id) {
    if (id instanceof ObjectID) {
        return id;
    }

    if (!id || id.length !== 24) {
        return id;
    }
    return ObjectID.createFromHexString(id);
};


[
    'close',
    'open',
    'collection',
    'collections',
    'createCollection',
    'admin',
    'collectionNames',
    'eval',
    'dereference',
    'logout',
    'authenticate',
    'addUser',
    'removeUser',
    'command',
    'dropCollection',
    'renameCollection',
    'lastError',
    'previousErrors',
    'resetErrorHistory',
    'createIndex',
    'ensureIndex',
    'dropIndex',
    'reIndex',
    'indexInformation',
    'dropDatabase',
    'stats'
].forEach(function (m) {

        Db.prototype[m] = function () {
            var self = this;
            var deferred = Q.defer();
            var args = Array.prototype.slice.call(arguments);

            try {
                self.db[m].apply(self.db, args.concat([function (err, data) {

                    if (err) {
                        deferred.reject(err);
                    } else {
                        switch (m){
                            case 'open':
                                deferred.resolve(self);
                                break;
                            case 'collection':
                                deferred.resolve(new Collection(data));
                                break;
                            case 'createCollection':
                                deferred.resolve(new Collection(data));
                                break;
                            case 'collections':
                                var collections = data.map(function (collection) {
                                    return new Collection(collection)
                                })
                                deferred.resolve(collections);
                                break;
                            case 'admin':
                                deferred.resolve(new Admin(data));
                                break;
                            default:
                                deferred.resolve(data)
                        }
                    }

                }]))
            } catch (e){
                deferred.reject(e);
            }

            return deferred.promise;
        }
    })
