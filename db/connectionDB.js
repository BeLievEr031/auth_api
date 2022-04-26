import mongoose from "mongoose";

const connectDB = async (DATABASE_URL) =>{
    try{
        await mongoose.connect(DATABASE_URL);
        console.log("Connected to the db");
    }catch(err){
        console.log(err);
    }
}

export default connectDB;