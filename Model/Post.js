const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
    title: String,
    body: String,
    date: Date
});

const upVoteSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        ref: "User"
    },
});

const downVoteSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        ref: "User"
    },
});

const PostSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        authorProfilePicture: {
            type: String,
        },
        authorName: {
            type: String,
            required: true
        },
        authorTagLine: {
            type: String,
        },
        title: {
            type: String,
            unique: true,
            required: true
        },
        discription: {
            type: String,
            max: 1000,
        },
        image: {
            type: String,
        },

        date: {
            type: Date,
            default: Date.now
        },
        upvote: {
            type: upVoteSchema,
            default: [],
        },
        downVote:{
            type: downVoteSchema,
            default: [],
        },
        comments: {
            type: CommentsSchema,
            default: [],
        },
    },
    { timestamps: false }
);

module.exports = mongoose.model("Post", PostSchema);


