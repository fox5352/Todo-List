const {cpus} = require('os');
const fs = require('fs');
require('dotenv').config();
const path = require('path');
const https = require('https');
const helmet = require('helmet');
const { join } = require('path');
const express = require('express');
const cluster = require('cluster');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const local = require('passport-local').Strategy;

// Local imports
const {findOrCreate} = require(join(__dirname, 'model', 'user.model.js'))

// routes
const authRouter = require(path.join(__dirname, 'routes', 'auth', 'auth.route.js'));
const homeRouter = require(path.join(__dirname, 'routes', 'home', 'home.route.js'));
const loginRouter = require(path.join(__dirname, 'routes', 'login', 'login.route.js'));
const aboutRouter = require(path.join(__dirname, 'routes', 'about', 'about.route.js'));
const removeNoteRouter = require(path.join(__dirname, 'routes', 'remove', 'remove.route.js'));
const loginMethodRouter = require(path.join(__dirname, 'routes', 'loginMethod', 'loginMethod.route.js'));

// Local strategy
async function localVerifyCallback(username, password, done) {
    try {
        const response = await findOrCreate(username, password)
        done(null, {...response})
    } catch (error) {
        done(error, null)
    }
}
passport.use(new local(localVerifyCallback))
// github strategy
const GitHub_opts = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback',
};
async function gitHubVerifyCallback(accessToken, refreshToken,profile, done){
    console.log(profile);
    done(null, profile)
}
// passport.use(new)// TODO: add github strategy

const Google_opts = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/github/callback',
};
async function googleVerifyCallback(accessToken, refreshToken, profile, done) {
    console.log(profile);
    done(null,profile)
}
// passport.use(new)// TODO: add google strategy


// TODO: install morgan

// Express config
const app = express();

// security
// app.use(helmet());// TODO: helmet clocks inline events fix!!

app.use(bodyParser.urlencoded({extended: true}))

app.use(session({
    name: 'session',
    secret: 'cat bomb',
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL,
        dbName: 'TodoListDB',
        collectionName: 'sessions',
        touchAfter: 3600// time period  in seconds
    }),
    cookie: {
        maxAge: 24 * 60 *60 * 1000,
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
app.use('/', removeNoteRouter);

// ABOUT PAGE    
app.use('/about', aboutRouter);

// Login page
app.use('/login', loginRouter);

app.use('/loginMethod', loginMethodRouter)

// app.use('/auth',);

// Register page
// app.use('/register', registerRouter);

if (cluster.isPrimary) {
    //starting servers
    for (let index = 0; index < cpus().length; index++) {
        cluster.fork()
    }
    console.log(`server started on port ${process.env.PORT}`);
}else{
    https.createServer({
        key: fs.readFileSync(join(__dirname, 'key.pem')),
        cert: fs.readFileSync(join(__dirname, 'cert.pem'))
    },app).listen(process.env.PORT, () => {})
}

// TODO: create docker image