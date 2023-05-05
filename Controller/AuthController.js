const { OTPtemplete } = require("../Helper/EmailTemplete/OTPTemplete");
const { USER } = require("../Helper/Role_Constant");
const User = require("../Model/User");

exports.register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const isUserExist = await User.findOne({
            email
        })
        if (isUserExist) {
            return res.status(400).json({ error: true, message: `${firstName} already exist` });
        }
        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            userType: USER,
            verified: false
        });

        const generatedOTP = generateOTP(6);
        await VerificationCode.create({
            user: user._id,
            code: generatedOTP
        })

        const isEmailSent = await sendMail({email}, OTPtemplete(`Hi , ${firstName} Here is your OTP to verify your account: ` , generatedOTP), "Successfully register on Quora")
        if (isEmailSent === null) {
            return res.status(200).json(success(`${firstName} ${lastName} is register successfully but we are facing some email issue.`, { id: user._id }))
        }
        return res.status(200).json(success(`${firstName} ${lastName} is register successfully`, { id: user._id }))
    } catch (err) {
        res.status(400).json({ error: true, message: err.message });
    }
}