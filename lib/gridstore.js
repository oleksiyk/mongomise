"use strict";

var Q          = require('q');
var mongodb    = require('mongodb');
var Collection = require('./collection');
var fs         = require('fs');

var GridStore = function (db, id, filename, mode, options) {
    this.gridStore = new mongodb.GridStore(db.db, id, filename, mode, options)
}

/**
 * Write GridFS file to filesystem
 *
 * @param  {String} filePath Path to file on filesystem to write to
 */
GridStore.prototype.toFile = function(filePath) {
    var self = this;
    var deferred = Q.defer();
    var fd;
    var chunkNumber = 0;
    var numberOfChunks;

    var readWrite = function() {
        if(chunkNumber > numberOfChunks){
            return deferred.resolve(self)
        }

        self.gridStore._nthChunk(chunkNumber, function(err, chunk) {
            if(err){
                return deferred.reject(err)
            }

            var buf = chunk.readSlice(chunk.length());

            if(buf !== null){
                fs.write(fd, buf, 0, buf.length, null, function(err) {
                    if(err){
                        return deferred.reject(err)
                    }
                    chunkNumber += 1;
                    readWrite();
                })
            } else {
                deferred.resolve(self)
            }
        })
    }

    deferred.promise.finally(function() {
        fs.close(fd)
    })

    var openFile = function() {
        numberOfChunks = Math.ceil(self.gridStore.length/self.gridStore.chunkSize);
        fs.open(filePath, 'w', function(err, _fd) {
            if(err) {
                return deferred.reject(err)
            }
            fd = _fd;
            readWrite();
        })
    }

    // check if GridStore object is already opened
    if(typeof(self.gridStore.length) === 'undefined'){
        self.open(function(err) {
            if(err) {
                return deferred.reject(err)
            }
            openFile()
        })
    } else {
        openFile()
    }

    return deferred.promise;

}

module.exports = GridStore;

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

        GridStore.prototype[m] = function () {
            var self = this;
            var deferred = Q.defer();
            var args = Array.prototype.slice.call(arguments);

            try {
                self.gridStore[m].apply(self.gridStore, args.concat([
                    function(err, data) {

                        if (err) {
                            deferred.reject(err);
                        } else {
                            switch (m) {
                                case 'open':
                                case 'writeFile':
                                case 'unlink':
                                case 'rewind':
                                case 'seek':
                                case 'write':
                                    deferred.resolve(self);
                                    break;
                                case 'chunkCollection':
                                case 'collection':
                                    deferred.resolve(new Collection(data));
                                    break;
                                default:
                                    deferred.resolve(data)
                            }
                        }

                    }
                ]))
            } catch (e) {
                deferred.reject(e);
            }

            return deferred.promise;
        }
    });

GridStore.prototype.fromFile = GridStore.prototype.writeFile;

/**
 * Static properties
 */
[
    'DEFAULT_ROOT_COLLECTION',
    'DEFAULT_CONTENT_TYPE',
    'IO_SEEK_SET',
    'IO_SEEK_CUR',
    'IO_SEEK_END'
].forEach(function (p) {
    GridStore[p] = mongodb.GridStore[p]
});


/**
 * R/W properties
 */
 [
     'chunkSize',
     'writable',
     'readable',

     // some internal properties of mongodb.GridStore
     'filename',
     'mode',
     'options',
     'root',
     'position',
     'fileId',
     'metadata',
     'aliases'
 ].forEach(function (p) {
    Object.defineProperty(GridStore.prototype, p, {
        enumerable: true,
        get: function() {
            return this.gridStore[p];
        },
        set: function(value) {
            this.gridStore[p] = value;
        }
    });
 });

 /**
  * Readonly properties
  */
 [
    'md5',
    'length',
    'uploadDate',
    'contentType'
 ].forEach(function (p) {
    Object.defineProperty(GridStore.prototype, p, {
        enumerable: true,
        get: function() {
            return this.gridStore[p];
        }
    });
 });

// make .size an alias to .length
Object.defineProperty(GridStore.prototype, 'size', {
    enumerable: true,
    get: function() {
        return this.gridStore.length;
    }
});

// make ._id an alias to .fileId
Object.defineProperty(GridStore.prototype, '_id', {
    enumerable: true,
    get: function() {
        return this.gridStore.fileId;
    }
});

/**
 * Static methods
 */
[
    'exist',
    'list',
    'read',
    'readLines',
    'unlink'
].forEach(function (sm) {
    GridStore[sm] = function () {
        var deferred = Q.defer();
        var args = Array.prototype.slice.call(arguments);

        try {
            mongodb.GridStore[sm].apply(null, args.concat([
                function(err, data) {

                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(data)
                    }

                }
            ]))
        } catch (e) {
            deferred.reject(e);
        }

        return deferred.promise;
    }
});

