const fs = require("fs");
const path = require("path");
const motdParser = require("../parse/motd");
const propertiesParser = require("../parse/properties");
const minecraftServerUtil = require("minecraft-server-util");
const Axios = require("axios");

module.exports = {
  load: (dir) => {
    // Load all the minecraft servers in the directory provided (these are folders)
    const readdir = fs.readdirSync(dir);
    // Get only the folders
    const folders = readdir.filter((f) =>
      fs.lstatSync(path.join(dir, f)).isDirectory()
    );
    // Initialize the servers array
    const servers = [];
    // Loop through the folders
    for (const folder of folders) {
      // Try to load server.properties to get the server info
      try {
        // Get the server properties
        const properties = fs.readFileSync(
          path.join(dir, folder, "server.properties"),
          "utf8"
        );
        // Parse the properties
        const parsedProperties = propertiesParser.parse(properties);
        let ip;
        if (
          parsedProperties["server-ip"] === "" ||
          parsedProperties["server-ip"] === undefined
        ) {
          ip = "127.0.0.1";
        } else {
          ip = parsedProperties["server-ip"];
        }
        // Get the server info
        const server = {
          name: parsedProperties["level-name"],
          port: parsedProperties["server-port"],
          ip: ip,
          id: servers.length + 1,
          properties: parsedProperties,
        };
        // Add the server to the servers array
        servers.push(server);
      } catch (err) {
        // If file not found error, continue
        if (err.code === "ENOENT") {
        } else {
          global.logger.error("Error while loading server properties: " + err);
          global.logger.raw(err.stack);
        }
      }
    }
    // Return the servers
    return servers;
  },

  online: async (server) => {
    // Ping the server to see if it's online
    try {
      // Try to get a response within 3 seconds
      const response = await minecraftServerUtil.status(
        server.ip,
        parseInt(server.port),
        { timeout: 3000 }
      );
      return true;
    } catch (err) {
      return false;
    }
  },

  create: async (serverName, serverPort, serverType, serverVersion, ramAlloc) => {
    // Types: vanilla, paper
    // Create directory: global.config.minecraft.serversDirectory + / + serverName
    const serverDirectory = path.join(global.config.minecraft.serversDirectory, serverName);
    // Create the directory
    fs.mkdirSync(serverDirectory);
    // Create server.properties by loading server.properties from the template directory and replacing the values
    const templateProperties = fs.readFileSync('server.properties', 'utf8');
    const parsedProperties = propertiesParser.parse(templateProperties);
    parsedProperties['server-port'] = serverPort;
    parsedProperties['level-name'] = serverName;
    parsedProperties['rcon.port'] = serverPort + 10000;
    parsedProperties['rcon.password'] = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newProperties = propertiesParser.dump(parsedProperties);
    fs.writeFileSync(path.join(serverDirectory, 'server.properties'), newProperties);
    // Create eula.txt
    fs.writeFileSync(path.join(serverDirectory, 'eula.txt'), 'eula=true');
    // Copy launch.sh to the server directory
    fs.copyFileSync('launch.sh', path.join(serverDirectory, 'launch.sh'));
    // Write a file called ramsize with the ram allocation
    fs.writeFileSync(path.join(serverDirectory, 'ramsize'), ramAlloc);
    
    // Now this is the hard part: depending on the server type, download the server jar.
    if (serverType === 'vanilla') {
      // Download the server jar
      const response = await Axios.get(`https://launchermeta.mojang.com/mc/game/version_manifest.json`);
      const versions = response.data.versions;
      const version = versions.find(v => v.id === serverVersion);
      const serverUrl = version.url;
      const serverResponse = await Axios.get(serverUrl);
      const serverDownloadUrl = serverResponse.data.downloads.server.url;
      const serverJar = await Axios.get(serverDownloadUrl, { responseType: 'stream' });
      serverJar.data.pipe(fs.createWriteStream(path.join(serverDirectory, 'server.jar')));
      // Wait for the download to finish
      await new Promise(resolve => {
	serverJar.data.on('end', () => {
	  resolve();
	});
      });
    } else if (serverType === 'paper') {
      // Download the server jar
      const builds = await Axios.get(`https://api.papermc.io/v2/projects/paper/versions/${serverVersion}/builds`);
      // Choose the latest build
      const build = builds.data[builds.data.length - 1];
      const serverDownloadUrl = `https://papermc.io/api/v2/projects/paper/versions/${serverVersion}/builds/${build}/downloads/paper-${serverVersion}-${build}.jar`;
      const serverJar = await Axios.get(serverDownloadUrl, { responseType: 'stream' });
      serverJar.data.pipe(fs.createWriteStream(path.join(serverDirectory, 'server.jar')));
      // Wait for the download to finish
      await new Promise(resolve => {
        serverJar.data.on('end', () => {
	  resolve();
	});
      });
    } else {
      // Unsupported server type
      global.logger.error(`Unsupported server type: ${serverType}`);
    }
  }
};
