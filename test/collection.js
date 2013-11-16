"use strict";

/* global mongomise, describe, it, before */

var db, collection;

describe('Collection', function() {

    before(function() {
        return mongomise.connect('mongodb://localhost:27017/mongomise-test')
            .then(function(_db) {
                db = _db;
                return db.createCollection('test1').then(function(_collection) {
                    collection = _collection
                })
            })
    });

    [
        'insert',
        'remove',
        'rename',
        'save',
        'update',
        'distinct',
        'count',
        'drop',
        'findAndModify',
        'findAndRemove',
        'find',
        'findOne',
        'createIndex',
        'ensureIndex',
        'indexInformation',
        'dropIndex',
        'dropAllIndexes',
        'reIndex',
        'mapReduce',
        'group',
        'options',
        'isCapped',
        'indexExists',
        'geoNear',
        'geoHaystackSearch',
        'indexes',
        'aggregate',
        'stats',

        'dropIndexes',

        'findById',
        'updateById',
        'removeById',
        'findAll',
        'set',
        'setById'
    ].forEach(function (m) {
        it('#' + m + '() exists', function() {
            collection.should.respondTo(m)
        })
    });

})
