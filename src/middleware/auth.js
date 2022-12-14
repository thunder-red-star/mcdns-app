const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
	// Path check
	if (req.path === '/login') {
		return next();
	}
	// Check if the cookie exists
	if (!req.cookies || !req.cookies.token) {
		return res.redirect('/login');
	}
	// Get the token
	const token = req.cookies.token;
	// Verify the token
	try {
		const decoded = jwt.verify(token, global.config.jwt.secret);
		// Continue
		return next();
	} catch (err) {
		global.logger.error(err);
		// Redirect to the login page
		return res.redirect('/login');
	}
};