module.exports = {
	options: {
		debug: true
	},
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: process.env.BOT_USERNAME,
		password: process.env.BOT_KEY
	},
	channels: ["brianemilius"]
};
