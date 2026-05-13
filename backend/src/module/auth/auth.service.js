import { log } from "console";
import { sendResetPasswordEmail } from "../../common/config/email.js";
import { generateAccessToken, generateRefreshToken, generateResetToken, verifyRefreshToken } from "../../common/utils/jwt.utils.js";
import ApiError from '../../common/utils/api-error.js';
import User from"./auth.model.js";
import crypto from "crypto"

const hashToken = (token)=> crypto.createHash("sha256").update(token).digest("hex");

const register= async ({name, email,password,role})=>{
    const existing = await User.findOne({email});
    if(existing){
        throw ApiError.conflict("Email already exists");
    }
    const {rawToken, hashedToken} = generateResetToken();

    const user = await User.create({
        name,
        email,
        password,
        role,
        isVerified: true,   // bypass email verification
        verificationToken: null,
        // verificationToken: hashedToken,
        
    });

    //send email to the user TODO
    // try {
    //     await sendVerificationEmail(email, rawToken);
    // } catch (err) {
    //     console.error("Failed to send verification email:", err.message);
    // }

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.verificationToken;

    console.log("Register Service passed");
    return userObj;
}

const login = async ({email, password})=>{
    const user = await User.findOne({email}).select("+password");;
    if(!user) throw ApiError.unauthorized("Invalid email or password");

    const isMatch = await user.comparePassword(password);
    if(!isMatch) throw ApiError.unauthorized("Email or Password is invalid");

    if(!user.isVerified){
        throw ApiError.forbidden("Please verify your email before logging in");
    }

    const accessToken= generateAccessToken({id:user._id, role:user.role});
    const refreshToken= generateRefreshToken({id:user._id});

    user.refreshToken= hashToken(refreshToken);
    await user.save();
    console.log("login Service passed");


    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.verificationToken;

    return {user:userObj, accessToken, refreshToken};
};

const refresh = async(token)=>{
    if(!token) throw ApiError.unauthorized("Refresh Token missing");

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select("+refreshToken");

    if(!user) throw ApiError.unauthorized("User no longer exists");
    if(user.refreshToken != hashToken(token)) throw ApiError.unauthorized("Invalid refresh token. Please login again");

    const accessToken = generateAccessToken({id:user._id, role:user.role});

    return {accessToken};
};

const logout = async (userId)=>{
    await User.findByIdAndUpdate(userId, {refreshToken:null});
}

const verifyEmail = async(token)=>{
    const trimmed= String(token).trim();
    if(!trimmed) throw ApiError.badRequest("Invalid or Expired verification token");

    const hashedInput = hashToken(trimmed);
    let user = await User.findOne({verificationToken:hashedInput}).select("+verificationToken");
    if(!user){
        user = await User.findOne({verificationToken:trimmed}).select("+verificationToken");
    }
    if(!user) throw ApiError.badRequest("Invalid or expired verification token");

    await User.findByIdAndUpdate(user._id, {
        $set:{isVerified:true},
        $unset:{verificationToken:1},
    });

    return user;
}

const forgotPassword = async(email)=>{
    const user = await User.findOne({email});
    if(!user) throw ApiError.notFound("No account with this email");

    const {rawToken, hashedToken} = generateResetToken();

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = Date.now()+15*60*1000;//15m
    await user.save();

    try{
        await sendResetPasswordEmail(email, rawToken);
    }catch(err){
        console.error("Failed to set reset email:", err.message);
    }

    console.log("Reset Token:", rawToken);

    
}

const resetPassword= async(token, newPassword)=>{
    const hashedToken=hashToken(token);

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpiry: {$gt: Date.now()},
    }).select("+resetPasswordToken +resetPasswordExpiry");

    if(!user) throw ApiError.badRequest("Invalid or expired reset token");

    user.password=newPassword;
    user.resetPasswordToken= undefined;
    user.resetPasswordExpiry= undefined;

    await user.save();
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");
  console.log("UserId:", userId);
  return user;
};

export {
    register,
    login,
    refresh,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    getMe

}  
