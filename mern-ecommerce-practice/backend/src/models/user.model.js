import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String,
        },
        cartData: {
            type: Object,
            default: {},
        }
    },
    {
        minimize: false,
        timestamps: true,
    }
);

// Pre-save middleware to hash the password
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next(); // Only hash if password is modified

    this.password = await bcrypt.hash(this.password, 10); // Hash with a salt of 10 rounds
    next();
});

// Method to verify the password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// Generate Access Token
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.models.User || mongoose.model('User',userSchema);
