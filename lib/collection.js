"use strict";

var Promise = require('bluebird');
var _       = require('lodash');
var Cursor  = require('./cursor');
var Db      = require('./db');

var Collection = function (collection) {

    this.collection = collection;
}

module.exports = Collection;

Object.defineProperty(Collection.prototype, "hint", {
    enumerable: true, get: function () {
        return this.collection.hint;
    }, set: function (v) {
        this.collection.hint = v;
    }
});

Collection.prototype._byId = function (method, id, args) {
    args = Array.prototype.slice.call(args || []);
    args[0] = {_id: Db.toId(id)};

    return this[method].apply(this, args);
};

Collection.prototype.findById = function (id) {
    return this._byId('findOne', id);
};

Collection.prototype.updateById = function (id, doc) {
    return this._byId('update', id, arguments);
};

Collection.prototype.removeById = function (id) {
    return this._byId('remove', id);
};

Collection.prototype.findAll = function (query, options) {
    return this.find.apply(this, arguments).then(function (cursor) {
        return cursor.toArray();
    })
};

/**
 * Update document setting (with `$set`) only properties specified in `doc`
 *
 * @param query
 * @param doc
 */
Collection.prototype.set = function (query, doc) {
    var _set = function(obj, path, r){
        r = r || {};

        _.forOwn(obj, function (val, key) {
            var _path = key;
            if(path){
                _path = path + '.' + _path;
            }

            if(_.isObject(val)){
                _set(val, _path, r)
            } else {
                r[_path] = val;
            }
        })

        return r;
    }

    return this.update(query, {$set: _set(doc)})
};

Collection.prototype.setById = function (id, doc) {
    return this._byId('set', id, arguments);
};

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
    'stats'
].forEach(function (m) {

        Collection.prototype[m] = function () {
            var self = this;
            var deferred = Promise.defer();
            var args = Array.prototype.slice.call(arguments);

            try {
                self.collection[m].apply(self.collection, args.concat([function (err, data) {

                    if (err) {
                        deferred.reject(err);
                    } else {
                        switch (m) {
                            case 'find':
                                deferred.resolve(new Cursor(data))
                                break;
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

Collection.prototype.dropIndexes = Collection.prototype.dropAllIndexes;

