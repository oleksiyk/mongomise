"use strict";

var Db      = require('./db')
var mongodb = require('mongodb');
var Q       = require('q');

exports.version = mongodb.version;

exports.Db = Db;

// Add BSON Classes
exports.Binary    = mongodb.Binary;
exports.Code      = mongodb.Code;
exports.DBRef     = mongodb.DBRef;
exports.Double    = mongodb.Double;
exports.Long      = mongodb.Long;
exports.MinKey    = mongodb.MinKey;
exports.MaxKey    = mongodb.MaxKey;
exports.ObjectID  = mongodb.ObjectID;
exports.Symbol    = mongodb.Symbol;
exports.Timestamp = mongodb.Timestamp;

// GridFS
exports.Grid      = require('./grid')
exports.GridStore = require('./gridstore')

exports.connect = function (url, options) {
    var deferred = Q.defer();

    mongodb.MongoClient.connect(url, options, function (err, db) {
        if(err || !db){
            deferred.reject(err);
        } else {
            deferred.resolve(new Db(db))
        }
    })

    return deferred.promise;
}

exports.toObjectID = exports.toId = function (id) {
    return Db.toObjectID(id);
}

