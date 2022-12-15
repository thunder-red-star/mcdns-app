const Axios = require('axios');
const RCON = require('../../utils/rcon/index');

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

		// Create io from global.io
		const io = global.io;
		// On connection
		io.on('connection', (socket) => {
			// Connect to RCON server
			let rcon = new RCON();
			rcon.connect(server.ip, server.properties['rcon.port'], server.properties['rcon.password']).then(() => {
				socket.emit('rcon', 'Connected to RCON server');
			}).catch((err) => {
				socket.emit('rcon', err.stack);
			});
			// On command
			socket.on('command', (command) => {
				// Send command to RCON server
				rcon.send(command).then((response) => {
					socket.emit('rcon', response);
				}).catch((err) => {
					socket.emit('rcon', err.stack);
				});
			});
			// On disconnect
			socket.on('disconnect', () => {
				// Disconnect from RCON server
				rcon.end();
			});
		});

		return res.render('dashboard', {server: minecraftServers[req.params.id - 1], status: status.data});
	}
}