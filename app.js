require("dotenv").config();
const tmi = require("tmi.js");
const options = require("./options");

const client = new tmi.Client(options);

client.connect().then(() => client.color("SeaGreen")).catch(() => process.exit(1));
client.on("message", (channel, tags, message, self) => {
	if (self) return;

	if (message.toLowerCase() === "!hello") {
		client.say(channel, `@${tags.username}, heya!`);
	}
});

setInterval(() => {
	client.say("#brianemilius", "Hey! If you like this stream please say \"Hi!\" in chat and give Brian a follow. Say !help for commands. You can also follow Brian on Twitter: twitter.com/BrianEmilius");
}, 5 * 60 * 1000);