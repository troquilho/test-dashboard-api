const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require("helmet");
const requireDir = require('require-dir');
require('dotenv/config');

const app = express();
const server = require("http").Server(app);

mongoose.set("strictQuery", true);
mongoose.connect(process.env.DB_CONNECTION_STRING);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors());
app.use(helmet());
app.use(express.json());

requireDir('./app/models');

app.use('/api', require('./routes'));

server.listen(process.env.PORT || 3000);