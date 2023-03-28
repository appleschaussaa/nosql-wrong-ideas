const username = [
    'hiker50mi',
    'narddog',
    'bigtuna'
];

const email = [
    'yeahright@email.com',
    'spamaccount@yahoo.com',
    'professionalprimary@gmail.com'
];

const thoughts = [
    'how do people think the world is flat?',
    'there are more planes in the ocean than submarines in the sky...',
    'today is a good day'
];

const randomArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomUser = () => `${randomArray(username)} ${randomArray(email)}`;

const randomThought = (int) => {
    const results = [];
    for (let i = 0; i < int; i++) {
      results.push({
        thoughtText: randomArray(thoughts),
      });
    }
    return results;
  };

  module.exports = { randomUser, randomThought };

