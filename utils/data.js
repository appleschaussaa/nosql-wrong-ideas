const connection = require('../config/connection');
const { Thoughts, Users } = require('../models');
const { randomUser, randomThought } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('now connected');
    await Thoughts.deleteMany({});
    await Users.deleteMany({});
    const users = [];
    for (let i = 0; i < 20; i++) {
        const thoughts = randomThought(3);
    }
})