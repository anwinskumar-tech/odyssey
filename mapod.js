const express = require('express');
const app = express();
const port = 6000;

// This tells our server to understand JSON data
app.use(express.json());

// This tells the server to serve your HTML/CSS files from the current folder
app.use(express.static('.'));

// This is our temporary "database" list
let foundDevices = [
    { id: 1, name: "Dell XPS 15", location: "Central Library", time: "10 mins ago" },
    { id: 2, name: "iPhone 13 Pro", location: "Engineering Block", time: "1 hour ago" }
];

// Route to GET (fetch) the list of devices
app.get('/devices', (req, res) => {
    res.json(foundDevices);
});

app.listen(port, () => {
    console.log(`FindBack server updated and listening at http://localhost:${port}`);
});