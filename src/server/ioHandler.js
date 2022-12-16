module.exports = function (socket, req, routesObject) {
	// Get the route
	const route = routesObject[req.url];
	// If the route exists
	if (route) {
		// If the route has a socketAction
		if (route.socketAction) {
			// Execute the socketAction
			route.socketAction(socket, req);
		}
	}
}