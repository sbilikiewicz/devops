
const express = require("express")

const app = express()

app.get('/hello', (req, res) => {
    res.send("Hello world from express server")
});

const PORT = 9090;
app.listen(PORT, () => {
    console.log(`API Listening on port ${PORT}`)
});