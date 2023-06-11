require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//TODO: istall mongoose-encryption


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

//todoSchema.plugin(encrypt, {secret: key, encryptedFields: ['list','password']})

// creates model
const User = mongoose.model('users', todoSchema);

// Express config
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Global vars
let data = { navBtn: false, notes: [] };// this var is used to dynamically change the one nav btn depending on what page your on
let userAccount = { userName: "default" };
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
        //sets the notes from the data base to the page
        data.notes = response.list;

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
    // TODO: added validators later
    .post(async function (req, res) {
        const newData = req.body.newNote;
        const response = await User.updateOne({ userName: userAccount.userName }, { $push: { list: newData } });

        res.redirect("/");

    });

// handles the removal of the notes from the todo-list
// TODO: pull data from index not string
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
    })
    //checks if the formData matches the data base then redirects
    .post(async function (req, res) {
        const response = await User.findOne({ userName: req.body.userName });

        // checks to see if username matches
        if (response) {
            //check if passwords matches
            if (req.body.password === response.password) {
                //then changes global user's name to new user
                changeUser(req.body.userName);

                res.redirect('/');
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
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


        if (!userValidator) {// if userName doesn't exist
            // check if passwords match
            if (data.password1 === data.password2) {
                //create new document 
                const newUser = new User({
                    userName: data.userName,
                    password: data.password1
                });

                newUser.save()//save then change global username to new user then redirect to home page
                    .then(() => {
                        changeUser(data.userName);

                        res.redirect('/');
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
