const { register, login, verifyUser, reSendOTP, forgotPasswordUserVerify } = require("../Controller/AuthController");

const router = require("express").Router();


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verifyUser/{userId}").post(verifyUser);
router.route("/reSendOTP/{userId}").post(reSendOTP)
router.route("/forgotPasswordUserVerify").post(forgotPasswordUserVerify)

module.exports = router;