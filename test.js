// Script to generate a stream of 1000 random characters and write them to a file
const fs = require('fs');
const path = require('path');

function randomChar (bounds) {
	// Bounds is an array of arrays of two numbers (example: [[0, 9], [65, 90], [97, 122]])
	// The first number is the lower bound and the second number is the upper bound
	// The function will return a random character between the lower and upper bounds
	// The bounds array is shuffled and then iterated through until a character is found
	// If no character is found, the function will return an empty string
	// Shuffle the bounds array
	bounds = bounds.sort(() => Math.random() - 0.5);
	// Iterate through the bounds array
	for (let i = 0; i < bounds.length; i++) {
		// Get the lower and upper bounds
		let lower = bounds[i][0];
		let upper = bounds[i][1];
		// Get a random number between the lower and upper bounds
		let num = Math.floor(Math.random() * (upper - lower + 1)) + lower;
		// Convert the number to a character
		let char = String.fromCharCode(num);
		// Check if the character is valid
		if (char) {
			// Return the character
			return char;
		}
	}
}

// Lowercase letters: 97-122
// Letters: 65-90, 97-122
// Letters + Numbers: 48-57, 65-90, 97-122
// Letters + Numbers + Symbols: 32-126
// Letters + Numbers + Symbols + Extended: 32-12600
// Everything: 0-65535
// Escape characters: 0-31
// Escape characters + lowercase letters: 0-31, 97-122

function randomString (length) {
		let str = '';
		for (let i = 0; i < length; i++) {
			// Bounds: \r character
				str += randomChar([[13, 13]]);
		}
		return str;
}

fs.writeFileSync(path.join(__dirname, 'test.txt'), randomString(1000));