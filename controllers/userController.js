const { User, Thoughts } = require('../models');

const userTotal = async () =>
    User.aggregate()
        .count('userCount')
        .then((numberOfUsers) => numberOfUsers);
        // User.countDocuments({}).then((numberOfUsers) => numberOfUsers);

const userThoughts = async (thoughtId) =>
    Thoughts.aggregate([
        {
            $match: { 
                _id: ObjectId(thoughtId)
            },
        },
        {
            $unwind: '$thought',
        },
        {
            $group: {
                _id: ObjectId(thoughtId),
                friendsCount: { $max: '$user.thought' } 
            },
        },
    ]);
    
const friends = async (userId) =>
    User.aggregate([
        {
            $match: { 
                _id: ObjectId(userId)
            },
        },
        {
            $unwind: '$user',
        },
        {
            $group: {
                _id: ObjectId(userId),
                friendsCount: { $max: '$user.friends' } 
            },
        },
    ]);

module.exports = {
    getUsers(req, res) {
        User.find()
        .then(async (users) => {
            const userObj = {
                users,
                userTotal: await userTotal(),
            };
            return res.json(userObj);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },
    getOneUser(req,res) {
        User.findOne({ _id: req.params.username })
        .select('-__v')
        .then(async (user) =>
            !user
                ? res.status(404).json({ message: 'No user found with that ID' })
                : res.json({
                    user,
                    thoughts: await userThoughts(req.params.userId),
                    friends: await friends(req.params.userId),
                })
        )
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },
    createUser(req, res) {
        User.create(req.body)
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((user) => 
            !user
                ? res.status(404).json({ message: 'Cannot find a user with this Id' })
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'not able to find that user' })
                    : Thoughts.deleteMany({ _id: { $in: user.thoughts }})
            )
            .then(() => res.json({ message: 'This user and all posted thoughts have been deleted' }))
            .catch((err) => res.status(500).json(err));
    },
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'Could not find user by Id' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'Could not find user by Id' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
};

