const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please provide a FirstName"],
    },
    lastName: {
        type: String,
        required: [true, "Please provide a LastName"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please provide a Email"],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
    },
    phoneNumber: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[0-9]{10}/.test(v);
            },
            message: 'phoneNumber is not a valid 10 digit number!'
        }
    },
    address:{
        type: String,
    },
    city:{
        type: String,
    },
    state:{
        type: String,
    },
    country:{
        type: String,
    },
    zipCode:{
        type: String,
    },
    birthDate:{
        type: Date,
    },
    password: {
        type: String,
        required: [true, "Please provide a Password"]
    },
    profilePic: {
        type: String
    },
    tagLine:{
        type: String,
    },
    aboutMe:{
        type: String,
    },
    Role: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        required: true,
    },
    post:{
        type: Array,
    },
    block:{
        type: Boolean,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
})
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const model = mongoose.model("User", UserSchema);

module.exports = model;