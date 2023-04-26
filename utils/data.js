const usernameStored = [
    'hiker50mi',
    'narddog',
    'bigtuna'
];

const emailStored = [
    'yeahright@email.com',
    'spamaccount@yahoo.com',
    'professionalprimary@gmail.com'
];

const thoughtsPost = [
    'how do people think the world is flat?',
    'there are more planes in the ocean than submarines in the sky...',
    'today is a good day'
];

const randomArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomUser = () => {
  const username = randomArray(usernameStored);
  const email = randomArray(emailStored);
  return { username, email };
};

const randomThought = (int) => {
  const results = [];
  for (let i = 0; i < int; i++) {
      const thoughtText = randomArray(thoughtsPost);
      results.push({ thoughtText });
  }
  return results;
};

  module.exports = { randomUser, randomThought };

