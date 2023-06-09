const { success } = require("../Helper/Response");
const Post = require("../Model/Post");
const User = require("../Model/User");
const Question = require("../Model/Question")

exports.getAllPosts = async (req, res, next) => {
    try {

        const posts = await Post.find();
        return res.status(200).json(success("List of all post available ", posts));

    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}

exports.createPost = async (req, res, next) => {
    try {
        const {
            title,
            discription,
            image,
            category
        } = req.body;
        const { userId } = req.params;
        const user = await User.find({ _id: userId });
        if(!user){
            return res.status(400).json({ error: true, message: "User does not exist" });
        }
        const post = await Post.create({
            authorId: user._id,
            authorProfilePicture: user.profilePic,
            authorName: user.firstName + " " + user.lastName,
            authorTagLine: user.tagLine,
            category,
            title,
            discription,
            image,
            upVote: [],
            downVote: [],
            comments: []
        })
        return res.status(200).json(success("Post is creatd successfully ", post));

    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}

exports.upVotePost = async (req, res, next) => {
    try {
        const {
            postId,
        } = req.body;
        const { userId } = req.params;
        const post = await Post.find({ _id: postId });
        if (!post) {
            return res.status(400).json({ error: true, message: "Post does not exist" });
        }
        const upvoteList = post?.upVote;
        let upVote = !post.upVote ? [{ author: userId }] : [...upvoteList, { author: userId }];
        await Post.updateOne({ _id: postId }, {
            upVote
        });

        return res.status(200).json(success("upvoted sucess ", {}));

    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}

exports.downVotePost = async (req, res, next) => {
    try {

        const {
            postId,
        } = req.body;
        const { userId } = req.params;
        const post = await Post.find({ _id: postId });
        if (!post) {
            return res.status(400).json({ error: true, message: "Post does not exist" });
        }
        const downvoteList = post.upVote;
        let downVote = !post.upVote ? [] : downvoteList.filter(downvoteList => downvoteList.author !== userId);
        await Post.updateOne({ _id: postId }, {
            downVote
        });

        return res.status(200).json(success("downvote sucess ",));

    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}

exports.commentsPost = async (req, res, next) => {
    try {

        const {
            postId,
            body
        } = req.body;
        const { userId } = req.params;
        const post = await Post.find({ _id: postId });
        if (!post) {
            return res.status(400).json({ error: true, message: "Post does not exist" });
        }
        const commentList = post.comments;
        let comments = !post.comments ? [{ author: userId, body }] : [...commentList, { author: userId, body }];
        const updatedPost = await Post.updateOne({ _id: postId }, {
            comments
        });

        return res.status(200).json(success("Comment sucess ", {}));

    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}

exports.createQuestion = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { question } = req.body;

        const user = await User.find({ _id: userId });
        await Question.create({
            authorId: userId,
            authorName: user.firstName + " " + user.lastName,
            authorTagLine: user.tagLine,
            authorProfilePicture: user.profilePic,
            question,
            answer: "",
            upVote: [],
            downVote: [],

        })

        return res.status(200).json(success("Question created sucessfully ", {}));

    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}
exports.answerTheQuestion = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { questionId, answer } = req.body;

        const user = await User.find({ _id: userId });
       await Question.updateOne({
        _id: questionId,
       },
       {
        answer,
        answerBy:userId,
        answerGiveByUserName:user.firstName + " " + user.lastName,
        answerGiveByUserProfilePic:user.profilePic,
       })

        return res.status(200).json(success("You have Answer the Question  sucessfully ", {}));

    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}

exports.getAllQuestion = async (req, res, next) => {
    try {
        
        const questions = await Question.find();


        

        return res.status(200).json(success("here are all question ", questions));

    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}