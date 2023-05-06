const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        ref: "User"
    },
    body: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
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
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        authorProfilePicture: {
            type: String,
        },
        authorName: {
            type: String,
        },
        authorTagLine: {
            type: String,
        },
        title: {
            type: String,
            unique: true,
            required: [true,"Title is requied to create post"]
        },
        discription: {
            type: String,
            max: 1000,
        },
        image: {
            type: String,
        },
        category: {
            type: String,
            required: [true,"Category is requied to create post"]
        },
        date: {
            type: Date,
            default: Date.now
        },
        upVote: [upVoteSchema] ,
        downVote:[downVoteSchema],
        comments:[CommentsSchema],
    },
    { timestamps: false }
);

module.exports = mongoose.model("Post", PostSchema);


