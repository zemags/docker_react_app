const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const { connectDb } = require("./helpers/db");
const { host, port, db, authApiUrl } = require("./configuration");
const app = express();
const postSchema = new mongoose.Schema({
	name: String
});
const Post = mongoose.model("Post", postSchema);

const startServer = () => {
	app.listen(port, () => {
		console.log(`Started api service on: ${port}`);
		console.log(`On host: ${host}`);
		console.log(`Our db: ${db}`);

		const silence = new Post({ name: "Silence" });
		silence.save(function(err, savedSilence){
			if (err) return console.error(err);
			console.log('savedSilence with volumes', savedSilence);
		});

		console.log(silence.name);
	});
};

app.get("/test", (req, res) => {
	res.send("Our api server is working correctly");
});

app.get("/api/testapidata", (req, res) => {
	res.json({
		testwithapi: true
	});
});

app.get("/testwithcurrentuser", (req, res) => {
	axios.get(authApiUrl + '/currentUser').then(response => {
		res.json({
			testwithcurrentuser: true,
			currentUserFromAuth: response.data
		});
	});
});

connectDb()
	.on("error", console.log)
	.on("disconnect", connectDb)
	.once("open", startServer);

