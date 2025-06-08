import { Router } from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    adminLogin,
    adminRefreshToken,
    adminLogout
} from "../controllers/user.controller.js";

import { registerUserValidator } from "../validators/registerUserValidator.js";
import { loginUserValidator } from "../validators/loginUserValidator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { adminAuthenticate } from "../middlewares/adminAuthenticate.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
    registerUserValidator,
    validate,
    registerUser
);

userRouter.route("/login").post(
    loginUserValidator,
    validate,
    loginUser
);

// secured routes
userRouter.route("/logout").post(authenticate, logoutUser);
userRouter.route("/refresh-token").post(authenticate, refreshAccessToken);

// admin routes
userRouter.route('/admin').post(adminLogin);
userRouter.route('/admin/refresh-token').post(adminAuthenticate, adminRefreshToken);
userRouter.route('/admin/logout').post(adminAuthenticate, adminLogout);

export default userRouter;