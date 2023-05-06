const { register, login, verifyUser, reSendOTP, forgotPasswordUserVerify, forgotPassword, getUserProfile, userProfileUpdate, changePassword } = require("../Controller/AuthController");
const { getAllPosts, createPost, upVotePost, downVotePost, commentsPost } = require("../Controller/PostController");
const verifyToken = require("../Middleware/VerifyToken");

const router = require("express").Router();


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verifyUser/:userId").post(verifyUser);
router.route("/reSendOTP/:userId").get(reSendOTP);
router.route("/forgotPasswordUserVerify").post(forgotPasswordUserVerify);
router.route("/forgotPassword/:userId").post(forgotPassword);


router.route("/getUserProfile/:userId").get(verifyToken,getUserProfile);
router.route("/userProfileUpdate/:userId").put(verifyToken,userProfileUpdate);
router.route("/getAllPosts").get(verifyToken,getAllPosts);
router.route("/createPost/:userId").post(verifyToken,createPost);

router.route("/upVotePost/:userId").post(verifyToken,upVotePost);
router.route("/downVotePost/:userId").post(verifyToken,downVotePost);
router.route("/commentsPost/:userId").post(verifyToken,commentsPost);

router.route("/changePassword/:userId").post(verifyToken,changePassword);


module.exports = router;