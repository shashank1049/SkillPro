
import dotenv from "dotenv";
import express from "express";
import {app} from "./app.js";
import connectDB from "./db/index.js";
import { DB_NAME } from "./constants.js";

dotenv.config({
    path: "./.env"
});

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is listening on port ${process.env.PORT || 8000}`);
    }); 
})
.catch(err => {
    console.log("Error connecting to MongoDB:", err);
});
