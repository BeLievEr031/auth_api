import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
const checkAuthUser = async (req, res, next) => {
  const { newPassword, confirmPassword } = req.body;

  if (newPassword && confirmPassword) {
    if (newPassword === confirmPassword) {
      try {
        // accessing header from request
        const { authorization } = req.headers;
        console.log(req.headers);
        if (authorization && authorization.startsWith("Bearer")) {
          let token = authorization.split(" ")[1];
          let { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);
          let dbUser = await UserModel.findById(userID);

          req.userId = dbUser._id;
          next();
        } else {
          res.json({
            status: "failed to change password",
            msg: "invalid Token",
          });
        }
      } catch (err) {
        res.json({
          status: "failed to change password",
          msg: "invalid Token",
        });
      }
    } else {
      res.json({
        status: "failed to change password",
        msg: "Wrong Credentials...",
      });
    }
  } else {
    res.json({
      status: "failed to change password",
      msg: "All fields Requires..",
    });
  }
};

export default checkAuthUser;


// {
//     "newPassword":"412",
//     "confirmPassword":"412"
// }
// 
// 
// 
