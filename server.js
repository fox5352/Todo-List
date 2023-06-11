require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// DB Connection
mongoose.connect(`${process.env.DB_URL}TodoListDB`, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log("TodoListDB connected"));

// creates Schema
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

// creates model
const User = mongoose.model('users', todoSchema);

// Express config
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Global vars
let data = { navBtn: false, notes: [] };// this var is used to dynamically change the one nav btn depending on what page your on
let userAccount = { userName: "default", password: "1234" };
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
        const response = await User.updateOne({ userName: userAccount.userName }, { $push: { list: newData } });

        res.redirect("/");

    });

app.post('/remove', async function (req, res) {
    const response = await User.findOne({ userName: userAccount.userName });
    const delItem = response.list[req.body.index];

    const data = await User.updateOne({ userName: userAccount.userName }, { $pull: { list: delItem } });

    res.redirect('/');
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
        const response = await User.findOne({ userName: req.body.userName });

        if (req.body.password === response.password) {
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    });

app.route('/register')
    .get(async function (req, res) {
        res.render('register', { data: data });
    })
    .post(async function (req, res) {
        const data = req.body;
        console.log(data.password1 === data.password2);

        if (data.password1 === data.password2) {
            const newUser = new User({
                userName: data.userName,
                password: data.password1
            });

            newUser.save()
                .then(() => {
                    userAccount.userName = data.userName;
                    userAccount.password = data.password1;
                    res.redirect('/');
                });

        } else {
            res.redirect('/register');
        }
    });

app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
});