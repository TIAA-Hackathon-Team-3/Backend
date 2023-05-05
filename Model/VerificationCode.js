const mongoose = require('mongoose')

const VerificationCodeSchema = new mongoose.Schema({
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
    code:{
        type: String,
        requied: true
    },
    verifyed:{
        type: Boolean,
        requied: true
    },
    CreatedAt: {
        type: Date,
        expires: '2m',
        default: Date.now
    },
})

const model = mongoose.model("VerificationCode", VerificationCodeSchema);

module.exports = model;