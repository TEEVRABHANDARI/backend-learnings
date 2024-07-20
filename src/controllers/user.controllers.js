import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens = async(userId)=>
{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken() // methods hai ye

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken,refreshToken}
    }
    catch(error){
        throw new ApiError(500,"Something went wrong")
    }
}
const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body;
    // console.log("email:", email);

    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are compulsory");
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    // we wanted to send no cover Image so we can get no error

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
        throw new ApiError(500, "Error uploading avatar to Cloudinary");
    }

    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Server error while registering user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});

const loginUser = asyncHandler(async(req,res)=>{
    //username/email match karna chaiye
    // database ke token ko compare karo 
    //if same then allow/ make new one
    // bas hogaya
    //login

    //req.body se data lao
    //username / email hai ki nhi user find
    //password check
    // check and refresh token
    // send cookies how ?

    const {email,username,password} = req.body
    if(!(username || email)){
        throw new ApiError(400,"username or email required")
    }

    const user = await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiError(404, "User doesnt exist")
    }

    //mongoDB wale U-- wale hai 
    //models wale lowercase hai
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(isPasswordValid){
        throw new ApiError(401,"Password incorrect")
    }

    // jab bhi access token/ refresh token ek saath bange
    const{accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)

    //send data in cookie
   const loggedInUser = await User.findById(user._id).select
   ("-password -refreshToken")

   const options={
    httpOnly: true,
    secure: true
   }

   return res.status(200)
   .cookie("accessToken", accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
    new ApiResponse(
        200,{
            user: loggedInUser,accessToken,refreshToken
        },
        "user logged in successfully"
    )
   )
})


const logoutUser = asyncHandler(async(req,res)=>{
    //algo
    //clear cookies
    //refresh token ok reset karna hoga
    //
    //User.findById nhi hai access
    //middleware baanna padega khud ka

    //ab hamare pass access hai sabka user se
    await User.findByIdAndUpdate(
        re.user._id,{
            $set:{ // ab logout ho raha tha
                refreshToken: undefined,
            }
        },
        {
            new: true //new updated value
        }
    )

    const options={
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logged Out"))
})
export {
    registerUser,
    loginUser,
    logoutUser
};
