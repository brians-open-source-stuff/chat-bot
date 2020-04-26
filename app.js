require("dotenv").config();
const tmi = require("tmi.js");
const { get } = require("axios");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const options = require("./options");

const tmiClient = new tmi.Client(options);

app.use(express.static("public"));

server.listen(4444);
io.on("connection", ioClient => handleSocketConnection(ioClient));

let timeout;

let chatters = [];

tmiClient.connect()
	.then(() => tmiClient.color("SeaGreen"))
	.catch(() => process.exit(1));

tmiClient.on("message", (channel, tags, message, self) => {
	if (self) return;

	chatterCheck(channel, tags);

	io.emit("message", { user: tags.username, message });

	if (message.toLowerCase() === "!hello") {
		tmiClient.say(channel, `@${tags.username}, heya!`);
	}

	if (message.toLowerCase() === "!joke") {
		get("https://icanhazdadjoke.com/", {
			headers: {
				"Accept": "application/json"
			}
		})
			.then(response => {
				if (!timeout || (timeout + (5 * 60 * 1000)) < Date.now()) {
					tmiClient.say(channel, response.data.joke);
					timeout = Date.now();
				}
			});
	}
});

setInterval(() => {
	tmiClient.say("#brianemilius", "Hey! If you like this stream please say \"Hi!\" in chat and give Brian a follow. Say !help for commands. You can also follow Brian on Twitter: twitter.com/BrianEmilius");
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
		// TODO: Spam filter
		//chatters[index].timestamps.push(parseInt(tags["tmi-sent-ts"]));
	}

	console.log(chatters);
}

function handleSocketConnection(ioClient) {
	console.log("A user joined!");
}
