import mongoose from "mongoose";
import bcrypt from "bcrypt"
import Joi from "joi";

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minLength:2,
        maxLength:50,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:[true, "Password is required"],
        minLength:8,
        select:false
    },
    role:{
        type:String,
        enum:["customer","seller","admin","support"],
        default:"customer",
    },
    isVerified:{
        type:Boolean,
        default:false,
    },

    verificationToken:{type:String,select:false,},
    refreshToken:{type:String,select:false,},
    resetPasswordToken:{type:String,select:false,},
    resetPasswordExpiry:{type:Date,select:false,},
},{timestamps: true})

userSchema.pre("save", async function(){
    if(!this.isModified("password")) return ;

    this.password= await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidatePassword){
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);