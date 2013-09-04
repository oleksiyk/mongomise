

require('./lib').connect('mongodb://localhost:27017/sirv', {
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
})
