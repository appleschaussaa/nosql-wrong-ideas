const { User, Thoughts } = require('../models');

module.exports = {
    getThoughts(req, res) {
        Thoughts.find()
            .then((thought) => res.join(thought))
            .catch((err) => res.status(500).json(err));
    },
    getSingleThought(req, res) {
        Thoughts.findOne({ _id: req.params.thoughtsId })
            .select('-_v')
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'Could not find thought using that Id' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    createThought(req, res) {
        Thoughts.create(req.body)
            .then((thought) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $addToSet: { thoughts: thought._id}},
                    { new: true }
                );
            })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'Created thought but could not find user by that Id' })
                    : res.json('Thought was created')
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    updateThought(req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((thought) => 
            !thought
                ? res.status(404).json({ message: 'Cannot find a thought with this Id' })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    deleteThought(req, res) {
        Thoughts.findOneAndRemove({ _id: req.params.thoughtId })
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'Could not find this thought by Id' })
                : User.findOneAndUpdate(
                    { _id: req.params.userId },
                    { $pull: { thoughts: { thoughtId: req.params.thoughtsId }}},
                    { new: true }
                )
        )
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'not able to find that thought' })
                : res.json({ message: 'Deleted thought'})
        )
        .catch((err) => res.status(500).json(err));
    },
    addReaction(req, res) {
        console.log('You are adding a reaction');
        console.log(req.body);
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtsId },
            { $addToSet: { reactions: req.body }},
            { runValidators: true, new: true }            
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'Could not find this thought by Id' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    deleteReaction(req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtsId },
            { $pull: { reactions: { reactionId: req.params.reactionId }}},
            { runValidators: true, new: true }            
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'Could not find this thought by Id' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
};