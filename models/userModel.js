import mongoose from "mongoose";
import validator, { validate } from "email-validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: function () {
      return validator.validate(this.email);
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    
  },
  cpassword: {
    type: String,
    required: true,
    trim: true,
  },
});

// Pre Hook

userSchema.pre("save", function () {
  if (this.password === this.cpassword) {
    this.cpassword = undefined;
  }
});

const UserModel = new mongoose.model("UserModel",userSchema);

export default UserModel;