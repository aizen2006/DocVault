import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    role:{
        type:String,
        enum:['sender','receiver'],
        default:'user',
    },
    email:{
        type:String,
        required:true,
    },
    avatarurl:{
        type:String,
        default:"",
    },
    fullName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    records:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Record'
        }
    ],
},{ timestamps:true});

userSchema.pre("save", async function () {
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function passwordCorrect(password){
    return await bcrypt.compare(password , this.password)
};

userSchema.methods.generateAccessToken = function generateAccessToken(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

userSchema.methods.generateRefreshToken = function generateRefreshToken(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
};

export const User = mongoose.model('User',userSchema);