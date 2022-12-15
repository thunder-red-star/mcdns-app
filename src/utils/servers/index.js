const fs = require('fs');
const path = require('path');
const motdParser = require('../parse/motd');
const propertiesParser = require('../parse/properties');

module.exports = {
	load: (dir) => {
		// Load all the minecraft servers in the directory provided (these are folders)
		const readdir = fs.readdirSync(dir);
		// Get only the folders
		const folders = readdir.filter(f => fs.lstatSync(path.join(dir, f)).isDirectory());
		// Initialize the servers array
		const servers = [];
		// Loop through the folders
		for (const folder of folders) {
			// Try to load server.properties to get the server info
			try {
				// Get the server properties
				const properties = fs.readFileSync(path.join(dir, folder, 'server.properties'), 'utf8');
				// Parse the properties
				const parsedProperties = propertiesParser.parse(properties);
				// Get the server info
				const server = {
					name: parsedProperties['level-name'],
					port: parsedProperties['server-port'],
					id: servers.length + 1,
					properties: parsedProperties,
				}
				// Add the server to the servers array
				servers.push(server);
			} catch (err) {
				// If file not found error, continue
				if (err.code === 'ENOENT') {
					continue;
				} else {
					global.logger.error("Error while loading server properties: " + err);
					global.logger.raw(err.stack);
					continue;
				}
			}
		}
		// Return the servers
		return servers;
	}
}