require('dotenv').config();
//const password = process.env.MONGO_PASSWORD;

const express = require('express');

const bodyParser = require('body-parser');

const routes = require('./routes/routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);

module.exports = app;