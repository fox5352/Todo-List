require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// DB Connection
mongoose.connect(`${process.env.DB_URL}TodoListDB`);

const todoSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    list: {
        type: Array
    }
});

const User = mongoose.model('users', todoSchema);

// Express config
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Global vars
let data = { navBtn: false };

app.route('/')
    .get(async function (req, res) {
        data.navBtn = false;
        res.render('todoList', { data: data });
    });

app.route('/about')
    .get(async function (req, res) {
        data.navBtn = true;
        res.render('todoList', { data: data });
    });

app.route("/:title")
    .get(async function (req, res) {
        data.navBtn = false;
        res.render('todoList', { data: data });
    });

app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
});