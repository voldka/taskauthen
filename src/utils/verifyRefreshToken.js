import UserToken from "../models/UserToken.js";
import jwt from "jsonwebtoken";

const verifyRefreshToken =  async (refreshToken) => {
	const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;
	try {
		const doc = await UserToken.findOne({ token: refreshToken });
		if (!doc) {
			throw new Error('Invalid refresh token');
		  }
		const tokenDetails = await jwt.verify(refreshToken, privateKey);
		return new Promise((resolve, reject) => {
			resolve({
				tokenDetails,
				error: false,
				message: "Valid refresh token",
			})
		})
	} catch (error) {
		throw new Error('Invalid refresh token');
	}
}
// 	return new Promise((resolve, reject) => {
// 		UserToken.findOne({ token: refreshToken }, (err, doc) => {
// 			if (!doc)
// 				return reject({ error: true, message: "Invalid refresh token" });

// 			jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
// 				if (err)
// 					return reject({ error: true, message: "Invalid refresh token" });
// 				resolve({
// 					tokenDetails,
// 					error: false,
// 					message: "Valid refresh token",
// 				});
// 			});
// 		});
// 	});
// };

export default verifyRefreshToken;