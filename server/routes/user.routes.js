import {Router } from "express";
import 
{ 
    changePassword,
     forgotPassword, getLoggedInUserDetails,
     loginUser,
    logoutUser,
    registerUser,
    resetPassword,
     updateUser 
}
      from "../controllers/user.controller.js"

import { isLoggedIn } from "../middlewares/auth.middleware.js"
import upload from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/me").get(isLoggedIn,getLoggedInUserDetails);
router.route("/reset").post(forgotPassword);
router.route("/reset/:resetToken").post(resetPassword);
router.route("/change-password").post(isLoggedIn, changePassword);
router.route("/update/:id").put(isLoggedIn,upload.single("avatar"), updateUser);

export default router;