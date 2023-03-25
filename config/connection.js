const { connect, connection } = require('mongoose');

const serverConnect = process.env.MONGOD_URI || 'mongodb://127.0.0.1/socialDB';

connect(serverConnect, {
    useNewUrlParse: true,
    useUnifiedTopology: true,
});

module.exports = connection;