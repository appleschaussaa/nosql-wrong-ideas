const { Schema, model } = require('mongoose');
const Reaction = require('./Reaction');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [Reaction],
    },
    {
        toJSON: {
            virtuals: {
                reactionCount: {
                    get() {
                        return `${[this.reactions.length]}`;
                    },
                },
            },
        },
    },
);

const Thoughts = model('thought', thoughtSchema)

module.exports = Thoughts;