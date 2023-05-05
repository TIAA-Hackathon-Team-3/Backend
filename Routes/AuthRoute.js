const { register, login, verifyUser, reSendOTP, forgotPasswordUserVerify, forgotPassword, getUserProfile, userProfileUpdate } = require("../Controller/AuthController");
const verifyToken = require("../Middleware/VerifyToken");

const router = require("express").Router();


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verifyUser/:userId").post(verifyUser);
router.route("/reSendOTP/:userId").post(reSendOTP);
router.route("/forgotPasswordUserVerify").post(forgotPasswordUserVerify);
router.route("/forgotPassword/:userId").post(forgotPassword);
router.route("/getUserProfile/:userId").get(verifyToken,getUserProfile);
router.route("/userProfileUpdate/:userId").put(verifyToken,userProfileUpdate);

module.exports = router;