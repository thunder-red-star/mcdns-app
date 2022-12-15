const Axios = require('axios');

module.exports = {
	name: 'index', path: '/dashboard/:id', enabled: true, method: 'get', ratelimit: {
		// The maximum number of requests that can be made in the time window
		max: 100, // The time window in milliseconds
		window: 1
	}, handler: async (req, res) => {
		let minecraftServers = global.servers;
		// Make a request to the status API
		const server = servers.find(server => server.id === parseInt(req.params.id));
		const status = await Axios.get(`https://api.mcsrvstat.us/2/${global.config.server.fullyQualifiedDomainName}:${server.port}`);
		// Render the dashboard
		console.log(status.data);
		return res.render('dashboard', {server: minecraftServers[req.params.id - 1], status: status.data});
	}
}