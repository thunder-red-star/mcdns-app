module.exports = {
	name: 'index',
	path: '/',
	enabled: true,
	method: 'get',
	ratelimit: {
		// The maximum number of requests that can be made in the time window
		max: 100,
		// The time window in milliseconds
		window: 1
	},
	handler: async (req, res) => {
		// Get list of servers
		// Placeholder for now
		return res.render('index', {servers: global.servers});
	}
}