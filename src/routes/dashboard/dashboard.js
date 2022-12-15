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
		
		// Render template
		return res.render('dashboard', {server: minecraftServers[req.params.id - 1], status: status.data});
	}, runOnAttach: async (expressServer) => {
		// Create io from global.io
		const io = global.io;
		// On connection
		io.on('connection', (socket) => {
			// Connect to RCON server
			global.logger.info("Someone connected to the RCON server");
			let rcon = new RCON();
			
			socket.on('rcon', async (data) => {
				serverId = data.serverId;
				// Find server by id
				const server = servers.find(server => server.id === parseInt(serverId));
				// Server IP = global.config.server.fullyQualifiedDomainName + ":" + server.port
				serverIP = global.config.server.fullyQualifiedDomainName + ":" + server.properties['server-port'];
				rcon.connect(server.properties['rcon.port'], server.properties['rcon.password']).then(() => {
				    socket.emit('rcon', 'Connected to RCON server');
				}).catch((err) => {
				    socket.emit('rcon', err.stack);
				});
			});
			// On command
			socket.on('command', (command) => {
				// Send command to RCON server
				rcon.send(command.command).then((response) => {
					socket.emit('rcon', response);
				}).catch((err) => {
					socket.emit('rcon', err.stack);
				});
			});
			// On disconnect
			socket.on('disconnect', () => {
				// Disconnect from RCON server
				rcon.destroy();
				global.logger.info("Someone disconnected from the RCON server");
			});
		});
	}
}
