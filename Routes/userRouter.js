import express from "express";
import UserController from "../controller/UserController.js";
import checkAuthUser from "../middleware/checkAuthUser.js";
const userRouter = express.Router();


// Router level middleware to check user is authorize or not
userRouter.use("/changepassword",checkAuthUser);

//{ Registration route --> public routes
userRouter.post("/register", UserController.insertNewUser);
// Login route
userRouter.post("/login", UserController.loginUser);
// Forget OR Reset Password Link
userRouter.post("/send-reset-password-email", UserController.sendResetLinkToEmail);
// Reset Password
userRouter.post("/reset-password/:id/:token", UserController.resetPassword);

// }

// change password
userRouter.post("/changepassword", UserController.changeUserPassword);

export default userRouter;
