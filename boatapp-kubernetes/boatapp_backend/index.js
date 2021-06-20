const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const boat = require('./boat-queries');
const { Pool } = require('pg');
const pool = new Pool();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 8081;
let retries = 5;

// create db tables

const dbConnect = () => {
    pool.connect((err, client, release) => {
        if (err) {
            retries -= 1;
            if(retries) {
                setTimeout(dbConnect, 3000);
            }
        } else {
            client.query('CREATE TABLE IF NOT EXISTS boat (ID SERIAL PRIMARY KEY, name varchar(60), owner varchar(60), type varchar(60))').catch((err) => {
                console.log('failed to create boat table');
            })
            release()
            retries = 0;
        }
        });
}

dbConnect();





app.post('/boats', boat.createBoat);
app.get('/boats', boat.getBoats);
app.get('/boats/:id', boat.getBoatById);
app.put('/boats/:id', boat.updateBoat);
app.delete('/boats/:id', boat.deleteBoat);

// start server
app.listen(port, () => {
    console.log('Server started on port ' +port);
});




