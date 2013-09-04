"use strict";

var Q = require('q');

var Cursor = function (cursor) {
    this.cursor = cursor;
}

module.exports = Cursor;

Cursor.prototype.rewind = function () {
    this.cursor.rewind();
    return this;
};

Cursor.prototype.each = function (callback) {
    this.cursor.each(callback)
};

Cursor.prototype.stream = function (options) {
    return this.cursor.stream(options)
};

Cursor.prototype.isClosed = function(){
    return this.cursor.isClosed();
};

[
    'toArray',
    'count',
    'sort',
    'limit',
    'setReadPreference',
    'skip',
    'batchSize',
    'nextObject',
    'explain',
    'close'
].forEach(function (m) {
        Cursor.prototype[m] = function () {
            var self = this;
            var deferred = Q.defer();
            var args = Array.prototype.slice.call(arguments);

            try {
                self.cursor[m].apply(self.cursor, args.concat([function (err, data) {

                    if (err) {
                        deferred.reject(err);
                    } else {
                        switch (m) {
                            default:
                                deferred.resolve(data)
                        }
                    }

                }]))
            } catch (e) {
                deferred.reject(e);
            }

            return deferred.promise;
        }
    })