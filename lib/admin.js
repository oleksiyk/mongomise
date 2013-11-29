"use strict";

var Promise = require('bluebird');

var Admin = function (admin) {
    this.admin = admin;
}

module.exports = Admin;


[
    'buildInfo',
    'serverStatus',
    'profilingLevel',
    'ping',
    'authenticate',
    'logout',
    'addUser',
    'removeUser',
    'setProfilingLevel',
    'profilingInfo',
    'command',
    'validateCollection',
    'listDatabases',
    'replSetGetStatus'
].forEach(function (m) {
        Admin.prototype[m] = function () {
            var self = this;
            var deferred = Promise.defer();
            var args = Array.prototype.slice.call(arguments);

            try {
                self.admin[m].apply(self.admin, args.concat([function (err, data) {

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
