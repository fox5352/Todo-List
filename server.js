require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// TODO: pull data from index not string in the remove route.
// TODO: added validators later to the post / route.

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
const saltRounds = Number(process.env.SALT_ROUNDS);

let data = { navBtn: false, notes: [], alert: false, alertMessage: '' };// this holds all the page data
let userAccount = { userName: "default" };//loggedIn username
let counter = 0;// to automatically display the about page if it's the default user account

// changes users name
function changeUser(userName) {
    userAccount = { userName: userName };
}

// HOME PAGE
app.route('/')
    // Handles home page
    .get(async function (req, res) {
        //gets users data
        const response = await User.findOne({ userName: userAccount.userName });

        // sets the navBtn to false which loads the about page button
        data.navBtn = false;
        try {
            //sets the notes from the data base to the page
            data.notes = response.list;
        } catch (error) {
            console.log(error);
        }

        // if its the default user account first redirect to about page
        if (userAccount.userName === "default") {
            if (counter > 0) {
                // renders the home page
                res.render('todoList', { data: data });
            } else {
                counter++;
                // renders the about page
                res.redirect('/about');
            }
        } else {
            // renders the home page
            res.render('todoList', { data: data });
        }
    })
    // sends data to the data base
    .post(async function (req, res) {
        const newData = req.body.newNote;
        const response = await User.updateOne({ userName: userAccount.userName }, { $push: { list: newData } });

        res.redirect("/");

    });

// handles the removal of the notes from the todo-list
app.post('/remove', async function (req, res) {
    // gets the users data
    const response = await User.findOne({ userName: userAccount.userName });
    // this is just temporary till i can find a way to remove from index rather than the string its self
    const delItem = response.list[req.body.index];

    // pull the data from the data base 
    const data = await User.updateOne({ userName: userAccount.userName }, { $pull: { list: delItem } });

    // then reloads the page
    res.redirect('/');
});

// ABOUT PAGE    
app.route('/about')
    // renders the about page
    .get(async function (req, res) {
        //sets the navBtn to home page then renders the page
        data.navBtn = true;
        res.render('about', { data: data });
    });

// // LOGIN PAGE 
app.route("/login")
    // renders login form page
    .get(async function (req, res) {
        res.render('login', { data: data });

        // if there was an alert pushed from a redirect it'll reset the values to default
        if (data.alert === true) {
            data.alert = false;
            data.alertMessage = '';
        }
    })
    //checks if the formData matches the data base then redirects
    .post(async function (req, res) {
        // Gets the user data that matches
        const response = await User.findOne({ userName: req.body.userName });

        // checks to see if username matches
        if (response) {

            // compares the users input to the databases data
            bcrypt.compare(req.body.password, response.password, (err, bool) => {
                if (!err) {
                    // if passwords matches then changes username and redirects
                    if (bool) {
                        //then changes global user's name to new user
                        changeUser(req.body.userName);

                        res.redirect('/');
                    } else {
                        res.redirect('/login');
                    }
                } else {
                    console.log(err);
                    res.redirect('/login');
                }
            });

        } else {
            res.redirect('/login');
        }
    });

app.route('/register')
    //renders register page
    .get(async function (req, res) {
        res.render('register', { data: data });
    })
    //validates then creates new users then redirects to home page
    .post(async function (req, res) {
        // gets form data
        const data = req.body;

        //validates if the userName exists already 
        const userValidator = await User.exists({ userName: data.userName });

        // if userName doesn't exist
        if (!userValidator) {
            // check if passwords match
            if (data.password1 === data.password2) {
                // hashes the password before saving it
                bcrypt.hash(data.password1, saltRounds, (err, hash) => {
                    if (!err) {
                        //create new user document 
                        const newUser = new User({
                            userName: data.userName,
                            password: hash
                        });

                        //save then change global username to new user then redirect to home page
                        newUser.save()
                            .then(() => {
                                changeUser(data.userName);

                                res.redirect('/');
                            });

                    } else {
                        console.log(err);
                        res.redirect('/register');
                    }
                });

            } else {
                res.redirect('/register');//passwords didn't match
            }
        } else {
            res.redirect('/register');//userName already exists
        }

    });

app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
});
