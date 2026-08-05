import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import mongoose from "mongoose";
import express from "express";
import { DB_NAME} from "../constants.js";

const connectDB = async () => {
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB connected successfully !! DB HOST: ${connectionInstance.connection.host}`);
    } catch(err){
        console.log(err);
    }
}

export default connectDB;