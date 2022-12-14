const fs = require('fs');
const path = require('path');

// Seed data
let data = {
	users: [],
	servers: []
}

// Write data to file
fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 2));