const { register } = require("../Controller/AuthController");

const router = require("express").Router();


router.route("/register").post(register);

module.exports = router;