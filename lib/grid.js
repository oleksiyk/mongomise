"use strict";

var Promise = require('bluebird');
var mongodb = require('mongodb');

var Grid = function (db, fsName) {

    this.grid = new mongodb.Grid(db.db, fsName)
}

module.exports = Grid;

[
    'put',
    'get',
    'delete'
].forEach(function (m) {

        Grid.prototype[m] = function () {
            var self = this;
            var deferred = Promise.defer();
            var args = Array.prototype.slice.call(arguments);

            try {
                self.grid[m].apply(self.grid, args.concat([function (err, data) {

                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(data)
                    }

                }]))
            } catch (e){
                deferred.reject(e);
            }

            return deferred.promise;
        }
    })
