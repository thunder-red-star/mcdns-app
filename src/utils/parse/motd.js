// MOTD parser for Java Edition

let colorCodes = {
	'0': 'text-black',
	'1': 'text-blue-700',
	'2': 'text-green-700',
	'3': 'text-cyan-700',
	'4': 'text-red-700',
	'5': 'text-purple-700',
	'6': 'text-yellow-700',
	'7': 'text-gray-700',
	'8': 'text-gray-500',
	'9': 'text-blue-500',
	a: 'text-green-500',
	b: 'text-cyan-500',
	c: 'text-red-500',
	d: 'text-purple-500',
	e: 'text-yellow-500',
	f: 'text-white'
};

let formatCodes = {
	k: 'text-transparent',
	l: 'font-bold',
	m: 'line-through',
	n: 'underline',
	o: 'italic'
};

let motdParse = {
	parse: (motd) => {
		/*
		 * Parse the MOTD from server.properties to HTML that can be displayed in the browser
		 *
		 * @param {string} motd - The MOTD from server.properties
		 * @returns {string} - The parsed MOTD
		 */
		// The parsed MOTD
		let parsedMotd = '';
		let color = null;
		let readingCode = false;
		let formats = [];
		let classes = [];
		let tempMotd = motd;
		// Convert \u00A7 to §
		motd = motd.replace(/\\u00A7/g, '§');
		// Split by §
		motd = motd.split('§');
		// First character of motd
		let first = tempMotd.split('')[0];
		// Loop through the MOTD
		for (let i = 0; i < motd.length; i++) {
			// Check if the first character is a color or format code
			if (motd[i].length > 0 && (colorCodes[motd[i][0]] || formatCodes[motd[i][0]]) && first === '§') {
				// Get the code
				const code = motd[i][0];
				// Check if the code is a color code
				if (colorCodes[code]) {
					// Check if there is a color
					if (color) {
						// Add the color class to the classes array
						classes.push(color);
					}
					// Set the color
					color = colorCodes[code];
				}
				// Check if the code is a format code
				if (formatCodes[code]) {
					// Add the format to the formats array
					formats.push(formatCodes[code]);
				}
				// Remove the code from the MOTD
				motd[i] = motd[i].slice(1);
			}
			if (motd[i][0] === 'r') {
				// Reset the color and formats
				color = null;
				formats = [];
				// Remove the code from the MOTD
				motd[i] = motd[i].slice(1);
			}
			// Check if the MOTD is empty
			if (motd[i].length === 0) {
				continue;
			}
			// Check if there is a color
			if (color) {
				// Add the color class to the classes array
				classes.push(color);
			}
			// Check if there are any formats
			if (formats.length > 0) {
				// Add the formats to the classes array
				classes = classes.concat(formats);
			}
			// Add the MOTD to the parsed MOTD
			parsedMotd += `<span class="${classes.join(' ')}">${motd[i]}</span>`;
			// Reset the color and formats
			color = null;
			formats = [];
			// Reset the classes array
			classes = [];
		}
		// Replace newlines with <br>
		parsedMotd = parsedMotd.replace(/\\n/g, '<br>');
		// Return the parsed MOTD
		return parsedMotd;
	}
};

module.exports = motdParse;

console.log(motdParse.parse('\u00A7o\u00A74hello\u00A7r\\n\u00A7l\u00A7btest'));
