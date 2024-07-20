import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { User } from "../models/users.models";

//res na use ho tho _ 

export const verifyJWT = asyncHandler(async(req,_,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.
        replace("Bearer ","") //ho sakta hai vo kidhar aur se aa raha ho
    // agar hai token tho usse replace karo aur katam tata
    // if not tho na bhai not possible

        if(!token){
        throw new ApiError(401,"Unathorization request")
        }

        const decodedToken = jwt.verify
        (token,process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id) // THINK AANE MEIN TIME LEGA SO AWAIT
        .select("-password -refreshToken") // kaise lege id ?

    //user nhi hai tho 
        if(!user){
        throw new ApiError(401,"Invalid Access Token")
        }

    //req mein naya object add karte hai
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid access token")
        
    }

    //middle w
})

//next ka kaam hai :
// mera hogagya ab jidhar marzi jaao
//jwt has authorization : <brearer>token