const express = require('express');
const cors = require('cors');
var uuid = require('uuid-random');
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json());

const redis = require('redis');

const redisClient = redis.createClient({
    host: "myredis",
    port: 6379
    //retry_strategy: () => 1000
});

redisClient.on('connect', () => {
    console.log("Connected to redis server.")
});

const { Pool } = require('pg');

const pgClient = new Pool({
    user: "postgres",
    password: "123witam",
    database: "postgres",
    host: "mypostgres",
    port: "5432"
});

pgClient.on('error', () => {
    console.log("Postgress not connected");
});

pgClient.on('connect', () => {
    console.log("Postgress connected");
});

pgClient
.query('CREATE TABLE IF NOT EXISTS boats (id VARCHAR(255), type VARCHAR(255), size VARCHAR(255), fullname VARCHAR(255))')
.catch((err) => {
    console.log(err);
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Boats - welcome message")
});

const PORT = 5000;
app.listen(PORT, ()=> {
    console.log(`Api listetning on port ${PORT}`);
});

app.get('/boats/:type', (req, res) => {
    try {
      const boatType = req.params.type;
    
      // Redis
      redisClient.get(boatType, async (err, type) => {
        if (type) {
          return res.status(200).send({
            error: false,
            message: `${boatType} detected`,
            data: JSON.parse(type)
          })
        } else {
			// No data in redis
            console.log(`${boatType} Looking for boat type in postgres`)
            pgClient.query('SELECT * FROM boats WHERE type = $1', [boatType], (error, results) => {
                if (error) {
                  throw error
                }
                redisClient.setex(boatType, 1440, JSON.stringify(results.rows));
                res.status(200).json(results.rows)
              })
    
        }
      }) 
    } catch (error) {
        console.log(error)
    }
});

app.post('/boats', (request, response) => {
    try {
        console.log(request.body)
        const {type, size, fullname} = request.body
        const id = uuid();
      
        pgClient.query('INSERT INTO boats (id, type, size, fullname) VALUES ($1, $2, $3, $4)', [id, type, size, fullname], (error, results) => {
          if (error) {
            throw error
          }
          response.status(201).send(`Added boat ${id}`)
        })
    } catch (error) {
        console.log(error)
    }
});

const AddBoatEntry = (request, response) => {
    const {type, size, fullname} = request.body
    const id = uuid();
  
    pgClient.query('INSERT INTO boats (id, type, size, fullname) VALUES ($1, $2, $3, $4)', [id, type, size, fullname], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Added new boat entry`)
    })
}

const getByName = (request, response) => {
    const name = parseInt(request.params.fullname)
  
    pgClient.query('SELECT * FROM boats', (error, results) => {
      if (error) {
        throw error
      }
      return results.rows
    })
}



