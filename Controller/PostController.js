const { success } = require("../Helper/Response");
const Post = require("../Model/Post");
const User = require("../Model/User");
const { post } = require("../Routes/AuthRoute");

exports.getAllPosts=async(req,res,next)=>{
    try {
        
        const posts = await Post.find();
        return res.status(200).json(success("List of all post available ",posts));

    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}

exports.createPost=async(req,res,next)=>{
    try {
        const {
            title,
            discription,
            image,
            category
        } = req.body;
        const {userId} = req.params;
        const user = await User.find({_id:userId});
        const post = await Post.create({
            authorId: user._id,
            authorProfilePicture: user.profilePic,
            authorName: user.firstName + " " +user.lastName,
            authorTagLine: user.tagLine,
            category,
            title,
            discription,
            image,
            upVote:[],
            downVote:[],
            comments:[]
        })
        return res.status(200).json(success("Post is creatd successfully ",post));

    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}

exports.upVotePost=async(req,res,next)=>{
    try {
        const {
            postId,
        } = req.body;
        const {userId} = req.params;
        const post = await Post.find({_id:PostId});
        if(!post){
            return res.status(400).json({ error: true, message: "Post does not exist" });
        }
        const upvoteList = post.upVote;
        const updatedPost = await Post.updateOne({_id:postId},{
            upVote : [...upvoteList,{author:userId}]
        });

        return res.status(200).json(success("upvoted sucess ",updatedPost));

    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}

exports.downVotePost=async(req,res,next)=>{
    try {
        
        const {
            postId,
        } = req.body;
        const {userId} = req.params;
        const post = await Post.find({_id:PostId});
        if(!post){
            return res.status(400).json({ error: true, message: "Post does not exist" });
        }
        const upvoteList = post.upVote;
        const updatedPost = await Post.updateOne({_id:postId},{
            upVote : [upvoteList.filter((item)=>item.author != userId)]
        });

        return res.status(200).json(success("downvote sucess ",updatedPost));

    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}

exports.commentsPost=async(req,res,next)=>{
    try {
        
        const {
            postId,
            body
        } = req.body;
        const {userId} = req.params;
        const post = await Post.find({_id:PostId});
        if(!post){
            return res.status(400).json({ error: true, message: "Post does not exist" });
        }
        const commentList = post.comments;
        const updatedPost = await Post.updateOne({_id:postId},{
            comments : [...commentList,{body,author:userId}]
        });

        return res.status(200).json(success("Comment sucess ",updatedPost));

    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}