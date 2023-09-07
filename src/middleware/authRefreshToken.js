import jwt from "jsonwebtoken";

const authRefreshToken = async (req, res, next) => {
	try {
		const authHeader = req.headers['authorization'];
		let token;
		if (authHeader.startsWith("Bearer ")){
			token = authHeader.substring(7, authHeader.length);
		   } 
		if (!token)
			return res.status(403).json({ 
				message: "không có token",
				code: -1000,
				success: false
			});;
		const tokenDetails = jwt.verify(
			token,
			process.env.REFRESH_TOKEN_PRIVATE_KEY
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
		res
			.status(403)
			.json({ error: true, message: "Access Denied: Invalid token" });
	}
};

export default authRefreshToken;