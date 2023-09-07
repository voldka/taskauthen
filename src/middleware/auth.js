import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
	try {
		const authHeader = req.headers['authorization'];
		let token;
		if (authHeader.startsWith("Bearer ")){
			token = authHeader.substring(7, authHeader.length);
		   } 
		if (!token)
			return res.status(403).json({ 
				message: "Không đủ quyền truy cập",
				code: -1000,
				success: false
			})
		const tokenDetails = jwt.verify(
			token,
			process.env.ACCESS_TOKEN_PRIVATE_KEY
		);
		const currentTimestamp = Math.floor(Date.now() / 1000); // Thời gian hiện tại dưới dạng timestamp (giây)
		if (tokenDetails.exp && tokenDetails.exp >= currentTimestamp) {
			req.user = tokenDetails;
			next();
		} else {
			res
				.status(401)
				.json({ error: true, message: "Access Denied: Access token has expired." });
		}
	} catch (err) {
		console.log(err);
		res.status(403).json({ 
			message: "Không đủ quyền truy cập",
			code: -1000,
			success: false
		})
	}
};

export default auth;