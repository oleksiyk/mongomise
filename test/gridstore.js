"use strict";

/* global mongomise, describe, it, before, after */

var Q      = require('q');
// var _   = require('lodash');
var fs     = require('fs');
var path   = require('path');
var crypto = require('crypto');

var testfile = {
    path: path.dirname(__filename) + '/test-data/image.jpg',
    length: 130566,
    md5: '0b864c06dc35f4fe73afcede3310d8bd'
}

var db, id = new mongomise.ObjectID(), gridStore;

var fileMD5 = function(filename) {
    var deferred = Q.defer();
    var shasum = crypto.createHash('md5');
    var s = fs.ReadStream(filename);
    s.on('data', function(d) {
        shasum.update(d);
    });
    s.on('end', function() {
        var d = shasum.digest('hex');
        deferred.resolve(d)
    });
    return deferred.promise;
}

describe('GridStore', function () {

    before(function() {
        return mongomise.connect('mongodb://localhost:27017/mongomise-test')
            .then(function(_db) {
                db = _db;
            })
    })

    it('GridStore constructor returns GridStore object', function() {
        gridStore = new mongomise.GridStore(db, id, 'test-file', 'w', {
            metadata: {
                test: 'value'
            }
        })

        gridStore.should.be.a('object').and.is.an.instanceof(mongomise.GridStore)
    });

    [
        'open',
        'writeFile',
        'close',
        'chunkCollection',
        'unlink',
        'collection',
        'readlines',
        'rewind',
        'read',
        'tell',
        'seek',
        'eof',
        'getc',
        'puts',
        'stream',
        'write'
    ].forEach(function (m) {
        it('#' + m + '()', function() {
            gridStore.should.respondTo(m)
        })
    });

    [
        'chunkSize',
        'writable',
        'readable',
        'filename',
        'mode',
        'options',
        'root',
        'position',
        'fileId'
    ].forEach(function(p) {
        it('#' + p, function() {
            gridStore.should.have.property(p)
        })
    })

    describe('Filesystem operations', function() {
        var tmpFile = require('os').tmpdir() + '/mongomise-test-' + Date.now();

        after(function() {
            if(fs.existsSync(tmpFile)){
                fs.unlinkSync(tmpFile)
            }
        })

        it('#fromFile() should write file from filesystem to GridFS', function() {
            return gridStore.fromFile(testfile.path).then(function(_gs) {
                _gs.should.be.deep.equal(gridStore)
            })
        })

        it('GridFS file should have correct properties', function() {
            return gridStore.collection().then(function(collection) {
                return collection.findById(id).then(function(file) {
                    file.should.be.a('object');
                    file.should.have.property('md5', testfile.md5);
                    file.should.have.property('length', testfile.length);
                })
            })
        })

        it('#toFile() should write file from GridFS to filesystem', function() {
            var gs = new mongomise.GridStore(db, id, 'r');
            return gs.toFile(tmpFile).then(function() {
                return fs.existsSync(tmpFile).should.be.true;
            })
        })

        it('Written file should be equal to original', function() {
            fs.statSync(tmpFile).size.should.be.equal(testfile.length)
            return fileMD5(tmpFile).then(function(md5) {
                return md5.should.equal(testfile.md5)
            })

        })
    })

})
