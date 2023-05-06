const Post = require("../Model/Post");
const { post } = require("../Routes/AuthRoute");

exports.getAllPosts=async(req,res,next)=>{
    try {
        
        const posts = await Post.find();
        return res.status(200).json(success("List of all post available ",posts));

    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}