const { Pool } = require('pg');
const redis = require('redis');
const pool = new Pool();

// make a connection to the local instance of redis
const client = redis.createClient(6379);

module.exports.getBoats = (request, response) => {
  pool
    .query('SELECT * FROM boat ORDER BY id ASC')
    .then(res => response.status(200).json(res.rows))
    .catch(err => console.log('Error executing query', err.stack))
}

module.exports.getBoatById = (request, response) => {
  try {
    const boatId = request.params.id;

    // Check the redis store for the data first
    redis.get(boatId, async (err, boat) => {
      if (boat) {
        return response.status(200).send({
          error: false,
          message: `Boat for ${boatId} from the cache`,
          data: JSON.parse(boat)
        })
      } else {
        // When the data is not found in the cache then we can make request to the server
        pool
          .query('SELECT * FROM users WHERE id = $1', [parseInt(boatId)])
          .then(res => {
            // save the record in the cache for subsequent request 1440 - store fore 24 minutes
            redis.setex(boatId, 1440, JSON.stringify(res.rows));
            response.status(200).json(res.rows);
          })
          .catch(err => console.log('Error executing query', err.stack))
      }
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports.createBoat = (request, response) => {
  const { name, shipowner_id } = request.body;
  pool
    .query('INSERT INTO boat (name, shipowner_id) VALUES ($1, $2) RETURNING id ', [name, shipowner_id])
    .then(res => response.status(201).send(`Boat succesfully created`))
    .catch(err => console.log('Error executing query', err.stack))
}

module.exports.updateBoat = (request, response) => {
  const boatId = parseInt(request.params.id);
  const { name, shipowner_id } = request.body;
  pool
    .query('UPDATE boat SET name = $1, shipowner_id = $2 WHERE id = $3', [name, shipowner_id, boatId])
    .then(res => response.status(200).send(`Boat with ID: ${boatId} succesfully updated`))
    .catch(err => console.log('Error executing query', err.stack))
}

module.exports.deleteBoat = (request, response) => {
  const boatId = parseInt(request.params.id);
  pool
    .query('DELETE FROM boat WHERE id = $1', [boatId])
    .then(res => response.status(200).send(`Boat with ID: ${boatId} succesfully deleted`))
    .catch(err => console.log('Error executing query', err.stack))
}