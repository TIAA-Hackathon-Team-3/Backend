const { getAllUsers, unblockUser, blockUser } = require("../Controller/AdminController");
const { register, login, verifyUser, reSendOTP, forgotPasswordUserVerify, forgotPassword, getUserProfile, userProfileUpdate, changePassword } = require("../Controller/AuthController");
const { getAllPosts, createPost, upVotePost, downVotePost, commentsPost, createQuestion, answerTheQuestion, getAllQuestion } = require("../Controller/PostController");
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
router.route("/createQuestion/:userId").post(verifyToken,createQuestion)
router.route("/answerTheQuestion/:userId").post(verifyToken,answerTheQuestion)
router.route("/getAllQuestion").get(verifyToken,getAllQuestion)

router.route("/changePassword/:userId").post(verifyToken,changePassword);

router.route("/getAllUsers").get(verifyToken,getAllUsers);
router.route("/blockUser/:blockUserId").get(verifyToken,blockUser);
router.route("/unblockUser/:blockUserId").get(verifyToken,unblockUser);


module.exports = router;