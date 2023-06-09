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
let data = { navBtn: false, notes: [] };// this var is used to dynamically change the one nav btn depending on what page your on
let userAccount = { userName: "default", password: "YMCA" };
let counter = 0;


// HOME PAGE
app.route('/')
    .get(async function (req, res) {
        const response = await User.findOne({ userName: userAccount.userName });

        data.navBtn = false;
        data.notes = response.list;


        res.render('todoList', { data: data });

        // if (counter > 0) {
        //     res.render('todoList', { data: data });
        // } else {
        //     counter++;
        //     res.redirect('/about');
        // }
    })
    .post(async function (req, res) {
        const newData = req.body.newNote;
        User.updateOne({ userName: userAccount.userName }, { $addToSet: { list: newData } })
            .then(response => {
                res.redirect("/");
            });

    });

// ABOUT PAGE    
app.route('/about')
    .get(async function (req, res) {
        data.navBtn = true;
        res.render('about', { data: data });
    });

// // LOGIN PAGE
app.route("/login")
    .get(async function (req, res) {
        res.render('login', { data: data });
    })
    .post(async function (req, res) {
        const formData = req.body;
        // const resData = await User.find({ userName: formData.userName });
    });

app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
});