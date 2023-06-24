require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

// Local imports
const homeRouter = require(path.join(__dirname, 'routes', 'home.route'));
const loginRouter = require(path.join(__dirname, 'routes', 'login.route'));
const aboutRouter = require(path.join(__dirname, 'routes', 'about.route'));
const registerRouter = require(path.join(__dirname, 'routes', 'register.route'));
const removeNoteRouter = require(path.join(__dirname, 'routes', 'remove.route'));

// TODO: added validators later to the post / route.

// Express config
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));



// HOME PAGE
app.use('/', homeRouter);

// handles the removal of the notes from the todo-list
app.use('/remove', removeNoteRouter);

// ABOUT PAGE    
app.use('/about', aboutRouter);

// Login page
app.use('/login', loginRouter);

// Register page
app.use('/register', registerRouter);


app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
});
