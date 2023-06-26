const fs = require('fs');
require('dotenv').config();
const path = require('path');
const https = require('https');
const helmet = require('helmet');
const { join } = require('path');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const local = require('passport-local').Strategy;
// TODO: add github oauth
// TODO: add google oauth

// Local imports
const {loginUser} = require(join(__dirname, 'model', 'user.model.js'))
// routes
const homeRouter = require(path.join(__dirname, 'routes', 'home', 'home.route.js'));
const loginRouter = require(path.join(__dirname, 'routes', 'login', 'login.route.js'));
const aboutRouter = require(path.join(__dirname, 'routes', 'about', 'about.route.js'));
const removeNoteRouter = require(path.join(__dirname, 'routes', 'remove', 'remove.route.js'));
const registerRouter = require(path.join(__dirname, 'routes', 'register', 'register.route.js'));

// Local strategy
async function localVerifyCallback(username, password, done) {
    try {
        const response = await loginUser(username, password)
        done(null, {userID: response})
    } catch (error) {
        done(error, null)
    }
}
passport.use(new local(localVerifyCallback))


// TODO: added validators later to the post / route.
// TODO: install morgan

// Express config
const app = express();

// security
app.use(helmet());

app.use(bodyParser.urlencoded({extended: true}))

app.use(session({
    name: 'session',
    secret: 'cat bomb',
    resave: true,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,
        signed: true,
    }
}))

passport.serializeUser((user, done)=>{
    done(null, user)
})
passport.deserializeUser((obj, done)=>{
    done(null, obj)
})

// initialize passport and sessions
app.use(passport.initialize())
app.use(passport.session())


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// HOME PAGE    
app.use('/', homeRouter);

// handles the removal of the notes from the todo-list
app.use('/remove', removeNoteRouter);

// ABOUT PAGE    
app.use('/about', aboutRouter);

// Login page
app.use('/login', loginRouter);

// app.use('/auth',);

// Register page
app.use('/register', registerRouter);


https.createServer({
    key: fs.readFileSync(join(__dirname, 'key.pem')),
    cert: fs.readFileSync(join(__dirname, 'cert.pem'))
},app).listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
})
