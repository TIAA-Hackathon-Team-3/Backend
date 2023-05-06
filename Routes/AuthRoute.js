const { register, login, verifyUser, reSendOTP, forgotPasswordUserVerify, forgotPassword, getUserProfile, userProfileUpdate } = require("../Controller/AuthController");
const { getAllPosts } = require("../Controller/PostController");
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
router.route("/getAllPosts").get(verifyToken,getAllPosts)

module.exports = router;