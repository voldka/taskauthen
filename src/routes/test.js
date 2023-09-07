import { Router } from "express";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";

const router = Router();

router.post("/test", auth, roleCheck, (req, res) => {
	res.status(403).json({ 
		message: "gút chóp",
		code: 200,
		success: true
	});
});

export default router;