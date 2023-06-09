const { connect, connection } = require('mongoose');

const serverConnect = process.env.MONGOD_URI || 'mongodb://localhost:27017';

connect(serverConnect, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = connection;