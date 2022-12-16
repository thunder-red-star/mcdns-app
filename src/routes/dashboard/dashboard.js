const Axios = require('axios');
const RCON = require('../../utils/rcon/index');
const serverStart = require('../../utils/serverStart');
const motdParser = require('../../utils/parse/motd');
const path = require('path');
module.exports = {
	name: 'index', path: '/dashboard/:id', enabled: true, method: 'get', ratelimit: {
		// The maximum number of requests that can be made in the time window
		max: 100, // The time window in milliseconds
		window: 1
	}, handler: async (req, res) => {
		let minecraftServers = global.servers;
		// Make a request to the status API
		const server = servers.find(server => server.id === parseInt(req.params.id));
		const motd = motdParser.parse(server.properties['motd']);

		let online = false;
		// Try to RCON into the server to see if it's online
		try {
			const rcon = new RCON(server.ip, server.port, server.rconPassword);
			await rcon.connect();
			await rcon.destroy();
			online = true;
		} catch (e) {
			online = false;
		}
		
		// Render template
		return res.render('dashboard', {server: minecraftServers[req.params.id - 1], motd: motd, online: online});
	}, socketAction: async (socket, req) => {
		// Connect to RCON server
		global.logger.info("Someone connected to the RCON server");
		let rcon = new RCON();

		socket.on('rcon', async (data) => {
			let serverId = data.id;
			// Find server by id
			const server = servers.find(server => server.id === parseInt(serverId));
			// Server IP = global.config.server.fullyQualifiedDomainName + ":" + server.port
			let serverIP = '127.0.0.1';
			try{
				rcon.connect(serverIP, server.properties['rcon.port'], server.properties['rcon.password']).then(() => {
					socket.emit('rcon', 'Connected to RCON server');
				}).catch((err) => {
					socket.emit('rcon', err.stack);
				});
			} catch (e) {
				socket.emit('rcon', e.stack);
			}
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
		socket.on('serverStart', (data) => {
			// Find server by id
			const server = servers.find(server => server.id === parseInt(data.id));
			// Find directory where server is located
			const directory = path.join(global.config.server.directory, server.properties['level-name']);
			// Start server
			serverStart(directory);
		});
		socket.on('serverStop', (data) => {
			// Find server by id
			const server = servers.find(server => server.id === parseInt(data.id));
			// RCON command to stop server
			rcon.send('stop').then((response) => {
				socket.emit('rcon', response);
			}).catch((err) => {
				socket.emit('rcon', err.stack);
			});
		});
		socket.on('serverRestart', (data) => {
			// Find server by id
			const server = servers.find(server => server.id === parseInt(data.id));
			// Find directory where server is located
			// RCON command to stop server
			rcon.send('stop').then((response) => {
				socket.emit('rcon', response);
				// Restart server
				serverStart(directory);
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
	}
}
