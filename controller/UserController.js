import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

class UserController {
  static insertNewUser = async (req, res) => {
    const { name, email, password, cpassword } = req.body;
    const isUser = await UserModel.findOne({ email: email });
    console.log(isUser);
    if (!isUser) {
      if (name && email && password && cpassword) {
        if (password === cpassword) {
          try {
            let hashedPassword = await bcrypt.hash(password, 10);
            const userForRegistration = {
              name: name,
              email: email,
              password: hashedPassword,
              cpassword: hashedPassword,
            };
            let newUser = new UserModel(userForRegistration);
            await newUser.save();
            let token = jwt.sign(
              { userID: newUser._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "1h" }
            );

            res.json({
              status: "User Added to DataBase",
              msg: "Register Completed",
              token: token,
            });
          } catch (err) {
            res.json({
              status: "Failed to register Email Already registered..  ",
              msg: err,
            });
          }
        } else {
          res.json({
            status: "Failed to register",
            msg: "Wrong Credentials..",
          });
        }
      } else {
        res.json({
          status: "Failed to register",
          msg: "All Field Required..",
        });
      }
    } else {
      res.json({
        status: "Failed to register",
        msg: "User Already Exits..",
      });
    }
  };

  static loginUser = async (req, res) => {
    let { email, password } = req.body;

    if(email && password){

   
    let isUserExits = await UserModel.findOne({ email: email });
    console.log(isUserExits);
    if (isUserExits) {
      let isValidPass = await bcrypt.compare(password, isUserExits.password);
      if (isValidPass) {

        let token = jwt.sign(
          { userID: isUserExits._id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1h" }
        );

        res.json({
          status: " login",
          msg: "Hello buddy",
          token: token,
        });
      } else {
        res.json({
          status: "failed to login",
          msg: "Wrong Crendtials",
        });
      }
    } else {
      res.json({
        status: "failed to login",
        msg: "Wrong Crendtials",
      });
    }
  }else{
    res.json({
      status: "failed to login",
      msg: "All Field Required..",
    });
  }
  };

  static changeUserPassword = async (req, res) => {

    const userIDForUpdatation = req.userId;
    const salt = await bcrypt.genSalt(10);
    const updatedPassword = await bcrypt.hash(req.body.newPassword,salt);
    let user = await UserModel.findByIdAndUpdate(userIDForUpdatation,{$set:{password:updatedPassword}})
    res.json({
      "status":"sucess",
      "msg":"password updated",
      "user":user
    });
  };

  static sendResetLinkToEmail = async (req, res) =>{
    const {email} = req.body;
    console.log(email);
    if(email){

      try{

        const isUser = await UserModel.findOne({email:email});
        console.log(isUser);
        if(isUser){
          const secret_key = isUser._id + process.env.JWT_SECRET_KEY;
          const token = jwt.sign({userID:isUser._id},secret_key,{expiresIn:"15m"});
          const link = `http://localhost:3000/${isUser._id}/${token}`;

          let testAccount = await nodemailer.createTestAccount();
          let transporter = nodemailer.createTransport({
            service:"gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: 'sandyrajak031@gmail.com', // generated ethereal user
              pass: "hzexjhjhjpprxnhk", // hzexjhjhjpprxnhk
            },
          });

          let info = await transporter.sendMail({
            from: '"sandyrajak031@gmail.com', // sender address
            to: "sandyrajak031@gmail.com", // list of receivers
            subject: "Password Reset Link", // Subject line
            text: "Hello there click on the link to reset the your password", // plain text body
            html: `<a>${link}</a>`, // html body
          });

          console.log(link);
          res.json({
            status:"sucsess",
            msg:`link sent..`,
            link:link
          });
        }else{
          res.json({
            status:"Failed",
            msg:"Wrong Credentials..."
          });
        }
      }catch(err){
        res.json({
          status:"Failed------------>",
          err:err
        });
      }

    }else{
      res.json({
        status:"Failed",
        msg:"All field required..."
      });
    }
  }

  static resetPassword = async (req, res) =>{
    const {password, confirmPassword} = req.body;

    if(password && confirmPassword){

      if(confirmPassword === password){
        const {id,token} = req.params;
        const user = await UserModel.findById(id);

        if(user){

        const secret_key = user._id + process.env.JWT_SECRET_KEY;
        const isValidToken = jwt.verify(token, secret_key);
          console.log(isValidToken);
        if(isValidToken != null){
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password,salt);
          await UserModel.findByIdAndUpdate(id,{$set:{password:hashedPassword}});
          res.json({
            status:"Success",
            msg:"password change"
          });
        }else{
          res.json({
            status:"Failed",
            msg:"Wrong token.."
          });
        }
      }else{
        res.json({
          status:"Failed",
          msg:"Wrong Credentials.."
        });
      }
    }else{
      res.json({
        status:"Failed",
        msg:"All Field Requires.."
      });
    }
  }else{
    res.json({
      status:"Failed",
      msg:"Wrong Credentials.."
    }); 
  }
  }
}

export default UserController;

