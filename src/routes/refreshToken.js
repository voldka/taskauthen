import { Router } from "express";
import mongoose  from "mongoose";
import UserToken from "../models/UserToken.js";
import jwt from "jsonwebtoken";
import verifyRefreshToken from "../utils/verifyRefreshToken.js";
import { refreshTokenBodyValidation } from "../utils/validationSchema.js";
import generateTokens from '../utils/generateTokens.js';
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import authRefreshToken from '../middleware/authRefreshToken.js'

const router = Router();
router.post("/refresh-token",auth, async (req, res) => {
	try {
		let resuser =await User.findOne({_id:req.user._id})
		let resusertoken =await UserToken.findOne({userId : req.user._id})
		res.status(200).json({
			success : true,
            code: 0,
            data : {
                id: resuser._id,
                email : resuser.email,
                role: resuser.roles,
                token: resusertoken.token
            }
		});
		}catch (error) {
			console.log(error)
			res.status(500).json('system eror')
		}
	})
router.post("/logout",auth, async (req, res) => {
	try {
		const tokenDetails = req.user
		if(tokenDetails){
			const currentTimestamp = Math.floor(Date.now() / 1000); // Thời gian hiện tại dưới dạng timestamp (giây)
			const userToken = await UserToken.deleteMany({ userId: tokenDetails._id})
			if(userToken){
				res.status(200).json({
					success: true,
					code : 200,
					message: "ok"});
			}
		}else{
			res.status(500).json({ error: true, message: "Internal Server Error" });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

export default router;