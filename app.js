const express = require('express');

const bodyParser = require('body-parser');

const publicRoutes = require('./routes/public_routes');
const protectedRoutes = require('./routes/protected_routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

publicRoutes(app);
protectedRoutes(app);

module.exports = app;