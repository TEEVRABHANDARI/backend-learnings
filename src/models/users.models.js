import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new Schema( //mongoose is not a constructor //dont write new mongoose
    {
        username:{
            type:String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true, //searching mein lane ke liye index true karna hai
        },
        email:{
            type:String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname:{
            type:String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        avatar:{
            type:String, // taking from cloud
            required: true,
        },
        coverImage:{
            type:String,
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video",
                required: true,
            }
        ],
        password:{
            type:String,
            required: [true,'Password is required']
        },
        refreshToken:{
            type:String,
            default: null
        }
    },{
        timestamps:true
    }
    
) // no need of timestamps

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    //bcrypt can also compare password, as it can take a string from user
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function () {
    try {
        const accessToken = jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        return accessToken;
    } catch (error) {
        console.error("Error generating access token:", error);
        return null;
    }
};

userSchema.methods.generateRefreshToken = function () {
    try {
        const refreshToken = jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        return refreshToken;
    } catch (error) {
        console.error("Error generating refresh token:", error);
        return null;
    }
};
//JWT is a bearer token hai , jiske pass ye token hai usko data bhej denge

export const User = mongoose.model("User", userSchema)