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
            type:String
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

userSchema.methods.generateAccessToken = function(){
    jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
    
}
userSchema.methods.generateRefreshToken= function(){
    jwt.sign(
        {
            _id:this._id,
            // email:this.email,
            // username:this.username,
            // fullname:this.fullname
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
//JWT is a bearer token hai , jiske pass ye token hai usko data bhej denge

export const User = mongoose.model("User", userSchema)