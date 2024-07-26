import { Router} from "express";
import { loginUser, registerUser,logoutUser, refreshAccessToken } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
   
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]), 
    registerUser
)

//because information le rahe hai POST
router.route("/login").post(loginUser)


//secured routes
router.route("/logout").post(verifyJWT,logoutUser) //isliye hum next likhte hai
//middleware : jate huye mujhse milte jana

router.route("/refresh-token").post(refreshAccessToken)
export default router