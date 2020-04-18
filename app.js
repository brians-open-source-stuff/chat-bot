require("dotenv").config();
const tmi = require("tmi.js");

const client = new tmi.Client({
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
});

client.connect().then(() => client.color("SeaGreen")).catch(() => process.exit(1));
client.on("message", (channel, tags, message, self) => {
	if (self) return;

	if (message.toLowerCase() === "!hello") {
		client.say(channel, `@${tags.username}, heya!`);
	}

	if (message.toLowerCase() === "!help") {
		client.whisper(tags.username, "Here are the commands you can use:\n[!hello] I will greet you right back.");
	}
});

setInterval(() => {
	client.say("#brianemilius", "Hey! If you like this stream please say \"Hi!\" in chat and give Brian a follow. Say !help for commands. You can also follow Brian on Twitter: twitter.com/BrianEmilius");
}, 5 * 60 * 1000);