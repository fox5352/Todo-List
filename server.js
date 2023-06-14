require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Local imports
const { getUserNotes, pushNewNote,
    removeUserNote, loginUser,
    createUser } = require('./model/user.model');

// TODO: added validators later to the post / route.

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
        //gets users notes
        data.notes = await getUserNotes(userAccount.userName) || [];

        // sets the navBtn to false which loads the about page button
        data.navBtn = false;

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
        // pushes new note to users list
        const response = await pushNewNote(userAccount.userName, req.body.newNote);

        res.redirect("/");
    });

// handles the removal of the notes from the todo-list
app.post('/remove', async function (req, res) {
    // gets the users data
    const list = await getUserNotes(userAccount.userName);
    // this is just temporary till i can find a way to remove from index rather than the string its self
    const delItem = list[req.body.index];

    // pull the data from the data base 
    const response = await removeUserNote(userAccount.userName, delItem);

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
        // validates data and return a bool
        const response = await loginUser(req.body.userName, req.body.password);

        if (response) {
            //then changes global user's name to new user
            changeUser(req.body.userName);

            res.redirect('/');
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

        // check if passwords match
        if (req.body.password1 === req.body.password2) {
            const response = await createUser(req.body.userName, req.body.password1, saltRounds);

            if (response) {
                changeUser(req.body.userName);
                res.redirect('/');
            } else {
                res.redirect('/register');
            }

        } else {
            res.redirect('/register');
        }
    });

app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
});
