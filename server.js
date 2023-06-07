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
let data = { navBtn: false };// this var is used to dynamically change the one nav btn depending on what page your on


// HOME PAGE
app.route('/')
    .get(async function (req, res) {
        data.navBtn = false;
        if (data.loggedIn) {
            res.render('todoList', { data: data });
        } else {
            res.redirect('/about');
        }
    });

// ABOUT PAGE    
app.route('/about')
    .get(async function (req, res) {
        data.navBtn = true;
        res.render('about', { data: data });
    });

// LOGIN PAGE
app.route("/login")
    .get(async function (req, res) {
        res.render('login', { data: data });
    })
    .post(async function (req, res) {
        res.end();
    });

// CUSTOM ROUTE
app.route("/:title")
    .get(async function (req, res) {
        res.redirect('/');
    });

app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
});