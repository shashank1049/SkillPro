import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import mongoose from "mongoose";
import { DB_NAME} from "../constants.js";

const connectDB = async () => {
    try{
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not configured");
        }

        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB connected successfully !! DB HOST: ${connectionInstance.connection.host}`);
    } catch(err){
        console.error("MongoDB connection error:", err.message);
        throw err;
    }
}

export default connectDB;
