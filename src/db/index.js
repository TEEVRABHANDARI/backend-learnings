import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () =>{
    try{
        //haan se sabh variable mein bhi aa sakta hai
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB connected! DBHost: ${connectionInstance.connection.host}`) //agar galat se ho jaye connect tho pata lag jaye
    }
    catch(error){
        console.log("MongoDB connection FAILED",error);
        process.exit(1)
    }
}

export default connectDB;