const serverUtils = require('../utils/servers/index');

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
		const minecraftServers = serverUtils.load(global.config.minecraft.serversLocation);
		global.servers = minecraftServers;
		return res.render('index', {servers: minecraftServers});
	}, runOnAttach: async (expressServer) => {
		// Create io from global.io
		const io = global.io;
		// On connection
		io.on('connection', (socket) => {
			// Ping all Minecraft servers
			for (let i = 0; i < global.servers.length; i++) {
				const server = global.servers[i];
				// Ping server
				let response = serverUtils.online(server.ip, server.port);
				global.logger.info(`Pinged ${server.ip}:${server.port} and got ${response}`);
				// Send response to client
				socket.emit('status', {id: server.id, online: response});
			}
		});
		// Execute socket action when the page is opened.
	}, socketAction: async (socket, req) => {
		// Ping all Minecraft servers
		for (let i = 0; i < global.servers.length; i++) {
			const server = global.servers[i];
			// Ping server
			let response = serverUtils.online(server);
			global.logger.info(`Pinged ${server.ip}:${server.port} and got ${response}`);
			// Send response to client
			socket.emit('status', {id: server.id, online: response});
		}
	}
}
