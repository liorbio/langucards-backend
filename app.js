const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");

const publicRoutes = require("./routes/public_routes");
const protectedRoutes = require("./routes/protected_routes");

const app = express();

app.use(
    cors({
        origin: ["https://langucardsapp.web.app", "https://langucardsapp.firebaseapp.com", "http://localhost:3000"],
        allowedHeaders: ["authorization", "Content-Type", "auth-token"],
        exposedHeaders: ["authorization"],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true,
    })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

publicRoutes(app);
protectedRoutes(app);

module.exports = app;
