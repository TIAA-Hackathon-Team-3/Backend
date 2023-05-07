const mongoose = require("mongoose");


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
const QuestionSchema = new mongoose.Schema(
    {
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        answerById: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        answerGiveByUserName:{
            type: String,
        },
        answerGiveByUserProfilePic:{
            type: String,
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
        question: {
            type: String,
            unique: true,
            required: [true,"Title is requied to create post"]
        },
        answer: {
            type: String,
            max: 1000,
        },        
        date: {
            type: Date,
            default: Date.now
        },
        upVote: [upVoteSchema] ,
        downVote:[downVoteSchema],
    },
    { timestamps: false }
);

module.exports = mongoose.model("Question", QuestionSchema);


