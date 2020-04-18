require("dotenv").config();
const tmi = require("tmi.js");
const { get } = require("axios");
const options = require("./options");

const client = new tmi.Client(options);

let timeout;

let chatters = []

client.connect()
	.then(() => client.color("SeaGreen"))
	.catch(() => process.exit(1));

client.on("message", (channel, tags, message, self) => {
	if (self) return;

	chatterCheck(channel, tags);

	if (message.toLowerCase() === "!hello") {
		client.say(channel, `@${tags.username}, heya!`);
	}

	if (message.toLowerCase() === "!joke") {
		get("https://icanhazdadjoke.com/", {
			headers: {
				"Accept": "application/json"
			}
		})
			.then(response => {
				if (!timeout || (timeout + (5 * 60 * 1000)) < Date.now()) {
					client.say(channel, response.data.joke);
					timeout = Date.now();
				}
			});
	}
});

setInterval(() => {
	client.say("#brianemilius", "Hey! If you like this stream please say \"Hi!\" in chat and give Brian a follow. Say !help for commands. You can also follow Brian on Twitter: twitter.com/BrianEmilius");
}, 10 * 60 * 1000);

function chatterCheck(channel, tags) {
	let user = chatters.map(user => user.id === tags["user-id"]);

	if (!user.length) {
		chatters.push({
			id: tags["user-id"],
			timestamps: [parseInt(tags["tmi-sent-ts"])]
		});
	} else {
		let index = chatters.findIndex(user => user.id === tags["user-id"]);
		
		//chatters[index].timestamps.push(parseInt(tags["tmi-sent-ts"]));
	}

	console.log(chatters);
}