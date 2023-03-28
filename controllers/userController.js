const { User, Thoughts } = require('../models');

const userTotal = async () =>
    User.aggregate()
        .count('userCount')
        .then((numberOfUsers) => numberOfUsers);

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
                friendsCount: { $max: 'user.thought'} 
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
                friendsCount: { $max: 'user.friends'} 
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
    createUser(res, req) {
        User.create(req.body)
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    updateUser(res, req) {
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
    deleteUser(res, req) {
        User.findOneAndRemove({ _id: req.param.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'not able to find that user' })
                    : Thoughts.deleteMany({ _id: { $in: user.thoughts }})
            )
            .then(() => res.json({ message: 'This user and all posted thoughts have been deleted' }))
            .catch((err) => res.status(500).json(err));
    },
    addFriend(res, req) {
        console.log('You have added a new friend');
        console.log(req.body);
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.body }},
            { runValidators: true, new: true }
        )
            .then((user) => 
                !user
                    ? res.status(404).json({ message: 'Could not find this user' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    deleteFriend(res, req) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: { friendsId: req.params.friendsId }}},
            { runValidators: true, new: true }
        )
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'Could not find this user' })
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
};

