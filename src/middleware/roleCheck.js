const roleCheck = (req, res, next)  => {
	try {
		let roles= [];
		roles.push("user");
		if (req.user.roles.includes(...roles)) {
			next();
		} else {
			res.status(403).json({ 
				message: "Không đủ quyền truy cập",
				code: 300,
				success: false
			});
		}
	} catch (error) {
		console.log(error)
	}
};


export default roleCheck;