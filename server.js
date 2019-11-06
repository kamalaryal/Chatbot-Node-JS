const http = require('http');
const dotenv = require('dotenv').config();

//import app from app.js
const app = require('./app');

const port = process.env.PORT || 5001;

const server = http.createServer(app);

server.listen(port, '0.0.0.0', () => {
    console.log('Server running at port :'+ port);
});