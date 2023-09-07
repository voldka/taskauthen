import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateTokens from "../utils/generateTokens.js";
import {
	signUpBodyValidation,
	logInBodyValidation,
} from "../utils/validationSchema.js";
const router = Router();

router.post("/register", async (req, res) => {
	try {
		console.log(req.body)
		const { error } = signUpBodyValidation(req.body);
		if (error)
			return res
				.status(400)
				.json({ error: true, message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(400)
				.json({ error: true, message: "User with given email already exist" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);
		let resuser = await new User({email: req.body.email, fullName: req.body.fullName, password: hashPassword })
		await User.create({email: req.body.email, fullName: req.body.fullName, password: hashPassword })
		res.status(200).json({
			success : true,
            code: 0,
            message: "tạo người dùng thành công",
            data : {
                id: resuser._id,
                email : resuser.email,
                fullName: resuser.fullName,
                role: resuser.roles
            }})
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});
router.post("/login", async (req, res) => {
	try {
		const { error } = logInBodyValidation(req.body);
		if (error)
			return res
				.status(400)
				.json({ error: true, message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res
				.status(401)
				.json({ error: true, message: "Invalid email or password" });

		const verifiedPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!verifiedPassword)
			return res
				.status(401)
				.json({ error: true, message: "Invalid email or password" });
		const { accessToken, refreshToken } = await generateTokens.generateTokensByUser(user);
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
            secure: true
		});
		res.cookie('accessToken', accessToken, {
			httpOnly: false, 
		});
		res.status(200).json({
			success : true,
            code: 0,
            message: "đăng nhập thành công",
            data : {
                id: user._id,
                email : user.email,
                role: user.roles,
                token: accessToken
            }
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});
export default router;
