"use strict";

/* global mongomise, libPath, describe, it, before */

var db;

describe('Db', function() {

    before(function() {
        return mongomise.connect('mongodb://localhost:27017/mongomise-test')
            .then(function(_db) {
                db = _db;
            })
    });

    [
        'close',
        'open',
        'collection',
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
        it('#' + m + '() exists', function() {
            db.should.respondTo(m)
        })
    });

    it('#toId() should convert string to ObjectID', function() {
        var strId = '52868b74c34c9b0000000003'
        var id = db.toId(strId)

        id.should.be.an.instanceof(mongomise.ObjectID)
        id.toString().should.be.equal(strId)
    })

    it('#createCollection() returns Collection object', function() {
        return db.createCollection('test1').then(function(test1Collection) {
            test1Collection.should.be.a('object');
            test1Collection.should.be.an.instanceof(require(libPath + '/collection'))
        })
    })

    it('#collection() returns Collection object', function() {
        return db.collection('test1').then(function(test1Collection) {
            test1Collection.should.be.a('object');
            test1Collection.should.be.an.instanceof(require(libPath + '/collection'))
        })
    })

    it('#collections() returns Array[Collection]', function() {
        return db.collections().then(function(collections) {
            collections.should.be.an('Array')
            collections[0].should.be.an.instanceof(require(libPath + '/collection'))
        })
    })

})
