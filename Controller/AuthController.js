const { OTPtemplete } = require("../Helper/EmailTemplete/OTPTemplete");
const { generateOTP } = require("../Helper/GenerateOTP");
const { USER } = require("../Helper/Role_Constant");
const User = require("../Model/User");
const VerificationCode = require("../Model/VerificationCode")
const sendMail = require("../Services/EmailServices/sendEmail")
const {success} = require("../Helper/Response.js")
const bcrypt = require("bcrypt");
const getJwtToken = require("../Helper/GetJwtToken")

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
            verified: false,
            blocked: false
        });

        const generatedOTP = generateOTP(6);
        await VerificationCode.create({
            userId: user._id,
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
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: true, message: "User doesn't exist" });
        }
        if(!user.verified){
            const generatedOTP = generateOTP(6);
            await VerificationCode.create({
                userId: user._id,
                code: generatedOTP
            })
            const isEmailSent = await sendMail({ email:user.email}, OTPtemplete(`Hi ${user.firstName} ,Here is your OTP to verify your account: ` , generatedOTP),
             "Account Verification code")
            return res.status(200).json({ error: true, message: `User is not verified` });
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
        const verificationCode = await VerificationCode.findOne({userId});
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

exports.reSendOTP = async (req, res, next) => {
    try {
        const {userId} = req.params;

        const user = await User.findOne({_id:userId})
        const generatedOTP = generateOTP(6);
        const verificationCode = await VerificationCode.findOne(
            {
                user: userId
            }
        )
        if(verificationCode){
            return res.status(400).json({ error: true, message: "OTP is already sent , Try again" });
        }
        await VerificationCode.create({
            userId: user._id,
            code: generatedOTP
        })

        const isEmailSent = await sendMail({ email:user.email}, OTPtemplete(`Hi ${user.firstName} ,Here is your OTP to verify your account: ` , generatedOTP), "Account Verification code")
        if (isEmailSent === null) {
            return res.status(200).json(success(`${user.firstName} ${user.lastName} is register successfully but we are facing some email issue.`, { id: userId }))
        }
        return res.status(200).json(success("OTP is send successfully", {id: userId}))

    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}

exports.forgotPasswordUserVerify=async(req,res,next)=>{
    try {
        const {email}=req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: true, message: "User doesn't exist" });
        }
        if(!user.verified){
            return res.status(400).json({ error: true, message: "User is not verified" });
        }
        const generatedOTP = generateOTP(6);
        const isEmailSent = await sendMail({ email:user.email}, OTPtemplete(`Hi ${user.firstName} ,Here is your OTP to change your account password: ` , generatedOTP), "Password change OTP")    
        await VerificationCode.create({
            userId: user._id,
            code: generatedOTP
        })
        if (isEmailSent === null) {
            return res.status(200).json(success("we are facing some email issue. Please try again later", { id: user._id }))
        }
        return res.status(200).json(success("OTP is send successfully",{id:user._id}));
    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}

exports.forgotPassword=async(req,res,next)=>{
    try {
        const {userId} = req.params;
        const {newPassword,rePassword}=req.body;
        if(!newPassword || !rePassword){
            return res.status(400).json({ error: true, message: "Invalid data" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(newPassword, salt);
        await User.updateOne({_id:userId},{password:hashpassword})

        return res.status(200).json(success("Password is succesfully changed",{id:userId}));

    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}

exports.getUserProfile=async(req,res,next)=>{
    try{
        const {userId} = req.params;
        const user = await User.findOne({_id:userId});
        if(!user){
            return res.status(400).json({ error: true, message: "User doesn't exist" });
        }
        if(!user.verified){
            return res.status(400).json({ error: true, message: "User is not verified" });
        }
        const response={
            id:user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            phone:user.phone,
            address:user.address,
            city:user.city,
            state:user.state,
            country:user.country,
            aboutMe:user.aboutMe,
            profilePic:user.profilePic,
            birthDate:user.birthDate
            
        }
        return res.status(200).json(success("Profile Data",response));

    }
    catch(error){
        res.status(400).json({ error: true, message: error.message });
    }
}

exports.userProfileUpdate=async(req,res,next)=>{
    try{
        const {
            firstName,
            lastName,
            phoneNumber,
            address,
            city,
            state,
            country,
            zipCode,
            birthDate,
            profilePic,
            aboutMe
        }=req.body;
        const {userId} = req.params;
        const user = await User.findOne({_id:userId});
        if (!user) {
            return res.status(400).json({ error: true, message: "User doesn't exist" });
        }
        if(!user.verified){
            return res.status(400).json({ error: true, message: "User is not verified" });
        }
        await User.updateOne({
            _id:userId
        }, {$set:{
            firstName: firstName?.length !==0 ? firstName : user.firstName,
            lastName: lastName?.length!==0 ?  lastName : user.lastName,
            phoneNumber: phoneNumber?.length!==0 ?  phoneNumber : user.phoneNumber,
            address: address?.length!==0 ?  address : user.address,
            city: city?.length!==0 ?  city : user.city,
            state: state?.length!==0 ?  state : user.state,
            country: country?.length!==0 ?  country : user.country,
            zipCode: zipCode?.length!==0 ?  zipCode : user.zipCode,
            birthDate: birthDate?.length!==0 ?  birthDate : user.birthDate,
            profilePic: profilePic?.length!==0 ?  profilePic : user.profilePic,
            aboutMe: aboutMe?.length!==0 ?  aboutMe : user.aboutMe
        }})

        return res.status(200).json(success("Profile is succesfully updated",{id:userId}));
    }
    catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}

exports.changePassword=async(req,res,next)=>{
    try {
        const {currentPassword,newPassword,confirmPassword}=req.body;
        const {userId}=req.params;
        if(!currentPassword &&!newPassword && !confirmPassword && newPassword!==confirmPassword){
            return res.status(400).json({ error: true, message: "Invalid data" });
        }
        const user = await User.find({_id:userId});
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: true, message: "Invalid Credentials. Ohhh ,Password is wrong" });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(newPassword, salt);
        await User.updateOne({_id:userId},{password:hashpassword})

        return res.status(200).json(success("Password is succesfully changed",{id:userId}));
    } catch (error) {
        
    }
}
