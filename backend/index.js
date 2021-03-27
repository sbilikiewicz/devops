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

redisClient.exists("BoatType", function(err, reply) {
	if (reply === 1) {
		console.log("Key exists");
	} else {
		console.log("Key doesn't exist");
		redisClient.set("BoatType", "submarine", function(err, reply) {
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

pgClient.connect(err => {
    if (err) throw err;
    else {
        queryDatabase();
    }
});

function queryDatabase() {
    const query = `
        DROP TABLE IF EXISTS inventory;
        CREATE TABLE inventory (id serial PRIMARY KEY, type VARCHAR(50), name VARCHAR(50));
        INSERT INTO inventory (type, name) VALUES ('BoatType', 'submarine');
    `;

    pgClient
        .query(query)
        .then(() => {
            console.log('Table created successfully!');
            pgClient.end(console.log('Closed client connection'));
        })
        .catch(err => console.log(err))
        .then(() => {
            console.log('Finished execution, exiting now');
            process.exit();
        });
}

app.get("/", (req, res) => {
	res.send("Hello World!");
});

const PORT = 5000;
app.listen(PORT, () => {
	console.log(`API Listening on port ${PORT}`);
});
