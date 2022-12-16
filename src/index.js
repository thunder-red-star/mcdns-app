const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const Logger = require('./utils/logger/index');
const logger = new Logger(path.join(__dirname, 'logs'));
const servers = require('./utils/servers/index');
// Create the Express server
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const auth = require('./middleware/auth');
const bodyParserCatch = require('./middleware/bodyParserCatch');

const globalConfig = require('./config/global.json');

// Hacky way to make logger available to all files
global.logger = logger;
global.config = globalConfig;

// Local dependencies
const getRoutes = require('./utils/getRoutes');
const attachRoutes = require('./server/attachRoutes');
const ioHandler = require('./server/ioHandler');

// Enable middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParserCatch);
app.use(auth);

// Load servers and set global.servers
let minecraftServers = servers.load(global.config.minecraft.serversLocation);
global.servers = minecraftServers;


// Create the Socket.io server
global.io = io;

let routes = getRoutes();
attachRoutes(app, routes);

io.on('connection', (socket) => {
	  socket.on('declare', (data) => {
			// Socket declares its intent (e.g. "dashboard", "index", etc.)
			socket.declared = data;
			// Now we want to use socketAction to handle any new emits
			ioHandler(socket, routes);
		});
});

// Start the server
const port = global.config.server.port || 3001;
http.listen(port, () => {
	logger.info(`Server started on port ${port}`);
});
