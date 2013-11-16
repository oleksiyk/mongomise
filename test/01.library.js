"use strict";

/* global mongomise, describe, it */

var db;

describe('Mongomise library', function () {

    describe('#connect()', function() {

        it('should have connect() method', function() {
            mongomise.should.respondTo('connect')
        })

        it('should have toId and toObjectID methods', function() {
            mongomise.should.respondTo('toId')
            mongomise.should.respondTo('toObjectID')
        });

        [
            'version',
            'Db',
            'Binary',
            'Code',
            'DBRef',
            'Double',
            'Long',
            'MinKey',
            'MaxKey',
            'ObjectID',
            'Symbol',
            'Timestamp',
            'Grid',
            'GridStore'
        ].forEach(function(p) {
            it('Exports #' + p, function() {
                mongomise.should.have.property(p)
            })
        });

        it('Can connect to mongodb', function() {
            return mongomise.connect('mongodb://localhost:27017/mongomise-test')
                .then(function(_db) {
                    db = _db;
                })
        })

        it('returns a Db object', function() {
            db.should.be.a('object')
            db.should.be.an.instanceof(mongomise.Db)
        });

    })

})
