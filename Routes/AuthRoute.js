const { register, login, verifyUser } = require("../Controller/AuthController");

const router = require("express").Router();


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verifyUser/{userId}").post(verifyUser);

module.exports = router;