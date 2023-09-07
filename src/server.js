import express from "express";
import { config } from "dotenv";
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.js";
import testRoutes from './routes/test.js';
import mongoose from "mongoose";
import refreshTokenRoutes from "./routes/refreshToken.js";
import connectDB from'./connectMongo.js'
config();

const app = express()
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/auth", refreshTokenRoutes);
app.use("",testRoutes)


connectDB()
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})