const express = require('express');
const cors = require('cors')
const app = express();

app.use(cors());
app.use(express.json())

const redis = require('redis');

const redisClient = redis.createClient({
	host: "myredis",
	port: 6379
	//retry_strategy: () => 1000
})

redisClient.on('connect', () => {
	console.log("Connected to redis server");
});

redisClient.get('BoatType', function(err, reply) {
    if (reply) {
		console.log(reply);
	} else {
		redisClient.set("BoatType", "submarine", function(er, repl) {
			console.log(repl);
		});
	}
});

const { Pool } = require('pg');

const pgClient = new Pool({
	user: "postgres", //zmienic
	password: "witam",
	database: "postgres",
	host: "mypostgres",
	port: "5432",
});

pgClient.on('error', () => {
	console.log("Postgres not connected");
});

pgClient.query("CREATE TABLE IF NOT EXISTS VALUE (INT)")


app.get("/", (req, res) => {
	res.send("Hello World!");
});

const PORT = 5000;
app.listen(PORT, () => {
	console.log(`API Listening on port ${PORT}`);
});
