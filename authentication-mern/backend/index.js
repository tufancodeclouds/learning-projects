import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

app.get("/", (req, res) => {
    res.send("Server is running");
})

mongoose.connect("url")
.then(() => {
    console.log("db connected successfully");
    
})

app.listen(3000, () => {
    console.log("server is running 3000");
})

