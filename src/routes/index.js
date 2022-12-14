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
		// Placeholder for now
		const servers = [{
			id: 1,
			name: 'Server 1',
		},
		{
			id: 2,
			name: 'Server 2',
		},
		{
			id: 3,
			name: 'Server 3',
		},
		{
			id: 4,
			name: 'Server 4',
		},
		{
			id: 5,
			name: 'Server 5',
		}
		];
		return res.render('index', {servers});
	}
}