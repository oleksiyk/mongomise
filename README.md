# Mongomise

Mongomise (Mongo + Promise) is a Promised version of [node-mongodb-native](https://github.com/mongodb/node-mongodb-native) client library for MongoDB. It turns all public methods of Db, Collection, Cursor and Admin objects into functions returning [Bluebird](https://github.com/petkaantonov/bluebird) promises.

It also add some convenient methods such as

```
collection.findAll(query) // does find(query).toArray()
collection.findById(id)
collection.updateById(id, document, options)
collection.removeById(id)

db.toId('522610078d84313722000001') // convert string ID to ObjectID
```

### Installation

```
npm install mongomise
```

### Usage

```javascript
require('mongomise').connect('mongodb://localhost:27017/test', {
    server: {
        poolSize: 5,
        auto_reconnect: true
    }
}).then(function (db){
    return db.collection('users')
}).then(function(usersCollection){
    return usersCollection.findAll()
}).then(function (users) {
    console.log(users)
}).fail(function(err){
    console.error(err);
})
```

### GridFS

#### Save file from filesystem to GridFS
```javascript
// db is instance of database connection
// id is ObjectID (optional)

// create GridStore object
gridStore = new mongomise.GridStore(db, id, 'test-file', 'w', {
    content_type: 'image/png',
    metadata: {
        test: 'value'
    }
})

// populate it with file from filesystem
gridStore.fromFile(filePath)
    .then(function(){ ... })
    .fail(function(err){ console.error(err) })

```

#### Save file from GridFS to filesystem
```javascript
// open GridStore for reading
var gridStore = new mongomise.GridStore(db, id, 'r');

// save it to file on filesystem
gridStore.toFile(filePath)
    .then(function() { ... })
    .fail(function(err){ console.error(err) })
```

### Status
Early beta, unstable.

## Authors

* Oleksiy Krivoshey [https://github.com/oleksiyk](https://github.com/oleksiyk)

# License (MIT)

Copyright (c) 2013 Oleksiy Krivoshey.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

