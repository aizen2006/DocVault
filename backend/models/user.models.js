import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['sender', 'receiver'],
        required: [true, 'Role is required and must be either "sender" or "receiver"'],
    },
    email: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "",
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    },
    records: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Record'
        }
    ],
}, { timestamps: true });

// Indexes for better query performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ role: 1 });

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function passwordCorrect(password) {
    return await bcrypt.compare(password, this.password)
};

userSchema.methods.generateAccessToken = function generateAccessToken() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

userSchema.methods.generateRefreshToken = function generateRefreshToken() {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
};

export const User = mongoose.model('User', userSchema);