const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
// const mongoose=require('mongoose');
const config = require('./app/config/database');
const db = config.database;

db.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('database connected');
});

const app = express();

app.use(cors());


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./app/config/controllers')(app);

app.listen(7000, () => { console.log("server started on port 7000"); });
