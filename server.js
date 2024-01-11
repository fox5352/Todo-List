const fs = require('fs');
require('dotenv').config();
const http = require('http');
const morgan = require('morgan');
const helmet = require('helmet');
const { join } = require('path');
const express = require('express');

const session = require('express-session');
const MongoStore = require('connect-mongo');

const passport = require('passport');
const local = require('passport-local').Strategy;
const gitHubStrategy = require('passport-github2').Strategy;

// Local imports
const {findOrCreate} = require(join(__dirname, 'model', 'user.model', 'user.model.js'))

// routes
const authRouter = require(join(__dirname, 'routes', 'auth', 'auth.route.js'));
const homeRouter = require(join(__dirname, 'routes', 'home', 'home.route.js'));
const loginRouter = require(join(__dirname, 'routes', 'login', 'login.route.js'));
const aboutRouter = require(join(__dirname, 'routes', 'about', 'about.route.js'));
const removeNoteRouter = require(join(__dirname, 'routes', 'remove', 'remove.route.js'));
const loginMethodRouter = require(join(__dirname, 'routes', 'loginMethod', 'loginMethod.route.js'));

// Express config
const app = express();

// security
app.use(helmet({
    contentSecurityPolicy: false
}));

app.use(morgan('combined'))


app.use(session({
    name: 'session',
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL_O,
        dbName: 'TodoListDB',
        collectionName: "session"
    }),
    // cookie: {
    //     maxAge: 24 * 60 *60 * 1000,
    //     httpOnly: true,
    //     secure: true,
    //     signed: true,
    // }
}))

// initialize passport and sessions
app.use(passport.initialize())
app.use(passport.session())

// github strategy
const GitHub_opts = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback',
};
async function gitHubVerifyCallback(accessToken, refreshToken,profile, done){//TODO: get email and pass it in
    try {
        const response = await findOrCreate(profile.username, '', profile.id)
        done(null, {...response})
    } catch (error) {
        done(error, null)
    }
}
passport.use(new gitHubStrategy(GitHub_opts, gitHubVerifyCallback))

// Local strategy
passport.use(new local(async (username, password, done) => {
    try {
        const response = await findOrCreate(username, password)
        done(null, {...response})
    } catch (error) {
        done(error, null)
    }
}))


passport.serializeUser((user, done)=>{
    done(null, user)
})
passport.deserializeUser((obj, done)=>{
    // TODO: find user
    done(null, obj)
})

app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs');
app.use(express.static(join(__dirname, 'public')));

// HOME PAGE    
app.use('/', homeRouter);

// handles the removal of the notes from the todo-list
app.use('/', removeNoteRouter);

// ABOUT PAGE    
app.use('/about', aboutRouter);

// login method page
app.use('/loginMethod', loginMethodRouter)

// oauth redirects
app.use('/auth', authRouter);

// Login page
app.use('/login', loginRouter); //TODO: switch to crypto


http.createServer(app).listen(process.env.PORT, () => {
    console.log(`server started on port:${process.env.PORT}`);
})