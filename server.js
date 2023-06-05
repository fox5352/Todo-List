require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// DB Connection

// Express config
const app = express();
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Global vars

app.route('/')
    .get(async function (req, res) {
        res.render('todoList');
    });

app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
});