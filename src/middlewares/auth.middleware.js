import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/users.models.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request: No token provided");
        }

        console.log("Token received:", token);

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        console.log("Decoded Token:", decodedToken);

        const userId = decodedToken.id;  // Ensure you're using the correct key
        console.log("Searching for user with ID:", userId);

        const user = await User.findById(userId).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token: User not found");
        }

        console.log("User found:", user);

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);

        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, "Invalid access token: Token has expired");
        }

        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, "Invalid access token: Token is invalid");
        }

        throw new ApiError(401, error.message || "Invalid access token");
    }
});
