const server = require('../../utils/servers/index.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "create",
  path: "/create/",
  enabled: true,
  method: "post",
  ratelimit: {
    // The maximum number of requests that can be made in the time window
    max: 100,
    // The time window in milliseconds
    window: 1,
  },
  handler: async (req, res) => {
    // Get server name, server port, server type, server version, and server ram allocation from the request body
    serverName = req.body.serverName;
    serverPort = req.body.serverPort;
    serverType = req.body.serverType;
    serverVersion = req.body.serverVersion;
    serverRam = req.body.serverRam;

    // Print each variable to the console
    console.log(serverName);
    console.log(serverPort);
    console.log(serverType);
    console.log(serverVersion);
    console.log(serverRam);

    // Validate the server name (should only contain letters and hyphens)
    if (!/^[a-zA-Z-]+$/.test(serverName)) {
      return res.render("create", { error: "Invalid server name (only letters and hyphens allowed)" });
    }

    // Validate the server port (should be a number between 1 and 65535)
    if (isNaN(serverPort) || serverPort < 1 || serverPort > 65535) {
      return res.render("create", { error: "Invalid server port (must be a number between 1 and 65535)" });
    }

    // Validate the server type (should be either "paper" or "vanilla")
    if (serverType !== "paper" && serverType !== "vanilla") {
      return res.render("create", { error: "Invalid server type (must be either paper or vanilla)" });
    }

    // Validate the server version (should be either "latest" or a valid Minecraft version)
    if (serverVersion !== "latest" && !/^[0-9]+\.[0-9]+\.[0-9]+$/.test(serverVersion)) {
      return res.render("create", { error: "Invalid server version (must be either latest or a valid Minecraft version)" });
    }

    // Check if server name and port are already in use
    if (global.servers.find((s) => s.name === serverName || s.port === serverPort)) {
      return res.render("create", { error: "Server name or port already in use" });
    }

    // Create a new server
    await server.create(serverName, serverPort, serverType, serverVersion, serverRam);

    // Redirect to the home page
    res.redirect("/");
  },
};
