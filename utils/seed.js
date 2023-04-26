const { Thoughts, User } = require('../models');
const { randomUser, randomThought } = require('./data');
const connection = require('../config/connection');

// Seed the User collection
// Seed the User collection
const seedUsers = async () => {
  try {
    // Clear existing data
    await User.deleteMany();

    // Generate and save random users
    const users = [];
    for (let i = 0; i < 3; i++) {
      let username, email;
      do {
        // Generate unique username
        const user = randomUser();
        username = user.username;
        email = user.email;
      } while (await User.findOne({ $or: [{ username }, { email }] })); // Check if username already exists
      const user = new User({ username, email });
      await user.save();
      users.push(user);
    }

    console.log('Users seeded successfully:', users);
  } catch (err) {
    console.error('Error seeding users:', err);
  }
};

// Seed the Thought collection
const seedThoughts = async () => {
  try {
    // Clear existing data
    await Thoughts.deleteMany();

    // Generate and save random thoughts for each user
    const users = await User.find();
    const thoughts = [];
    for (const user of users) {
      const randomThoughts = randomThought(3);
      for (const thought of randomThoughts) {
        const newThought = new Thoughts({
          thoughtText: thought.thoughtText,
          username: user.username,
        });
        await newThought.save();
        thoughts.push(newThought);
        user.thoughts.push(newThought);
        await user.save();
      }
    }

    console.log('Thoughts seeded successfully:', thoughts);
  } catch (err) {
    console.error('Error seeding thoughts:', err);
  }
};

// Connect to MongoDB using the exported connection object
connection.once('open', () => {
  console.log('Connected to MongoDB');
  (async () => {
    await seedUsers();
    await seedThoughts();
    connection.close();
  })();
});