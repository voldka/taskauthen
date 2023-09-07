import express from "express";
import { config } from "dotenv";
import cookieParser from 'cookie-parser';
import dbConnect from "./dbConnect.js";
import authRoutes from "./routes/auth.js";
import testRoutes from './routes/test.js';
import refreshTokenRoutes from "./routes/refreshToken.js";
config();

const app = express()
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/auth", refreshTokenRoutes);
app.use("",testRoutes)

dbConnect();    
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})