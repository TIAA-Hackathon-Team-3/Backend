const User = require("../Model/User");
const { success } = require("../Helper/Response.js")

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json(success("", users));
    } catch (err) {
        res.status(400).json({ error: true, message: err.message });
    }
}

exports.blockUser = async (req, res, next) => {
    try {
        const { blockUserId } = req.params;
        // const users = await User.find(_id:blockUserId);
        await User.updateOne({ _id: blockUserId }, {
            $set: {
                blocked: true
            }
        })
        return res.status(200).json(success("", users));
    } catch (err) {
        res.status(400).json({ error: true, message: err.message });
    }
}
exports.unblockUser = async (req, res, next) => {
    try {
        const { blockUserId } = req.params;
        // const users = await User.find(_id:blockUserId);
        await User.updateOne({ _id: blockUserId }, {
            $set: {
                blocked: false
            }
        })
        return res.status(200).json(success("", users));
    } catch (err) {
        res.status(400).json({ error: true, message: err.message });
    }
}