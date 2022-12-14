const Axios = require('axios');

module.exports = {
	name: 'index', path: '/dashboard/:id', enabled: true, method: 'get', ratelimit: {
		// The maximum number of requests that can be made in the time window
		max: 100, // The time window in milliseconds
		window: 1
	}, handler: async (req, res) => {
		// Get list of servers
		// Placeholder for now
		const servers = [{
			id: 1, name: 'Server 1', port: 30600
		}, {
			id: 2, name: 'Server 2', port: 30601
		}, {
			id: 3, name: 'Server 3', port: 30602
		}, {
			id: 4, name: 'Server 4', port: 30603
		}, {
			id: 5, name: 'Server 5', port: 30604
		}];

		// Make a request to the status API
		const server = servers.find(server => server.id === parseInt(req.params.id));
		const status = await Axios.get(`https://api.mcsrvstat.us/2/${global.config.server.fullyQualifiedDomainName}:${server.port}`);

		// Render the dashboard
		console.log(status.data);
		return res.render('dashboard', {server: servers[req.params.id - 1], status: status.data});
	}
}