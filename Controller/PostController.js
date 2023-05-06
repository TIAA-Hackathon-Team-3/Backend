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
        })
        return res.status(200).json(success("Post is creatd successfully ",post));

    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}