const { exec } = require('child_process');

module.exports = function serverStart(dir) {
	// Start the Minecraft server
	exec(`bash ${dir}/launch.sh &`, (err, stdout, stderr) => {
		if (err) {
			console.error(err);
			return;
		}
		console.log(stdout);
	});
}
