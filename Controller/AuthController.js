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
            Role: USER,
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

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: true, message: "Invalid Credentials. Please provide all required fields" });
        }
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: true, message: "User doesn't exist" });
        }
        if(!user.verified){
            return res.status(200).json({ error: true, message: `${user.firstName} is not verified` });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: true, message: "Invalid Credentials. Ohhh ,Password is wrong" });
        }
        const token = getJwtToken({id: user._id, Role : user.Role});
        const response ={
            id:user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            Role:user.Role,
            profilePic:user.profilePic,
            verified: user.verified,
            token
        }
        return res.status(200).json(success(`${user.firstName} Login Successful`, response))

    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}


exports.verifyUser = async (req, res, next) => {
    try {
        const {userId} = req.params;
        const {code} = req.body;
        if(!userId || !code){
            return res.status(400).json({ error: true, message: "invalid" });
        }
        const verificationCode = await VerificationCode.findOne({user:userId});
        if(!verificationCode){
            return res.status(400).json({ error: true, message: "OTP has been expire" });
        }
        if(verificationCode.code !== code){
            return res.status(400).json({ error: true, message: "invalid Verification Code" });
        }
        await User.updateOne({
            _id:userId
        },{
            verified:true
        })
        return res.status(200).json(success(`User verified successfully`, {id:userId}))

    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}
