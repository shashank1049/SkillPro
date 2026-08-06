import { Router } from "express";
import { registerUser, loginUser,logoutUser } from "../controllers/auth.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    updateAccountDetails,
    changeCurrentPassword,
    updateUserAvatar,
    updateUserCoverImage

} from "../controllers/user.controller.js";



const router = Router();

router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount: 1
    }
]), registerUser);
router.route("/login").post(loginUser);

router.route("/update-account").patch(
    verifyJWT,
    updateAccountDetails
);
router.route("/change-password").patch(
    verifyJWT,
    changeCurrentPassword
)
router.route("/avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateUserAvatar
);

router.route("/coverImage").patch(
    verifyJWT,
    upload.single("coverImage"),
    updateUserCoverImage
);

router.route("/logout").post(
    verifyJWT,
    logoutUser
);





export default router;