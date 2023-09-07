import jwt from "jsonwebtoken";
import UserToken from "../models/UserToken.js";

class GenerateToken{
	  async generateTokensByUser(user) {
		try {
			const payload = { _id: user._id, roles: user.roles };
			const accessToken = jwt.sign(
				payload,
				process.env.ACCESS_TOKEN_PRIVATE_KEY,
				{ expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
			);
			const refreshToken = jwt.sign(
				payload,
				process.env.REFRESH_TOKEN_PRIVATE_KEY,
				{ expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
			);
	
			const userToken = await UserToken.findOneAndRemove({ userId: user._id });
			await new UserToken({ userId: user._id, token: refreshToken }).save();
			return Promise.resolve({ accessToken, refreshToken });
		} catch (err) {
			return Promise.reject(err);
		}
	};
	async generateTokensByRefreshTokenAndPayload(payload, refreshToken){
		try {
			const doc = await UserToken.findOne({ token: refreshToken });
			if (doc){
			const existingRefreshToken = refreshToken
			const newAccessToken = jwt.sign(
			payload,
			process.env.ACCESS_TOKEN_PRIVATE_KEY, {
			expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
		  });
		   	const newRefreshToken = jwt.sign(
			{ userId: payload._id, roles: payload.roles, parentRefreshToken: existingRefreshToken },
			process.env.REFRESH_TOKEN_PRIVATE_KEY,
			{ expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
	  );
		try {
			await new UserToken({
			userId: payload._id,
			token: newRefreshToken,
			parentRefreshToken: existingRefreshToken,
			}).save();		  
			return Promise.resolve({ newAccessToken, newRefreshToken});
		} catch (error) {
			console.error("An error occurred:", error);
			return Promise.reject(error);
		}};
		}
		catch (error) {
			return Promise.reject(error);
		}
	}
}	
export default new GenerateToken();