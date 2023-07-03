const fs = require('fs');
require('dotenv').config();
const https = require('https');
const morgan = require('morgan');
const helmet = require('helmet');
const { join } = require('path');
const { cpus } = require('os');   
const cluster = require('cluster');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const local = require('passport-local').Strategy;
const gitHubStrategy = require('passport-github2').Strategy;
const googleStrategy = require('passport-google-oauth20').Strategy;

// Local imports
const {findOrCreate} = require(join(__dirname, 'model', 'user.model', 'user.model.js'))

// routes
const authRouter = require(join(__dirname, 'routes', 'auth', 'auth.route.js'));
const homeRouter = require(join(__dirname, 'routes', 'home', 'home.route.js'));
const loginRouter = require(join(__dirname, 'routes', 'login', 'login.route.js'));
const aboutRouter = require(join(__dirname, 'routes', 'about', 'about.route.js'));
const removeNoteRouter = require(join(__dirname, 'routes', 'remove', 'remove.route.js'));
const loginMethodRouter = require(join(__dirname, 'routes', 'loginMethod', 'loginMethod.route.js'));

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
    callbackURL: 'https://localhost:3000/auth/github/callback',
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

const Google_opts = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://localhost:3000/auth/google/callback',
};
async function googleVerifyCallback(accessToken, refreshToken, profile, done) {//TODO: get email and pass it in
    //id displayName emails photos provider

    try {
        const response = await findOrCreate(profile.displayName.split(' ')[0], '', profile.id)
        done(null, {...response})
    } catch (error) {
        done(error, null)
    }
}
passport.use(new googleStrategy(Google_opts, googleVerifyCallback))


// Express config
const app = express();

// security
app.use(helmet({
    contentSecurityPolicy: false
}));

app.use(morgan('combined'))

app.use(bodyParser.urlencoded({extended: true}))

app.use(session({
    name: 'session',
    secret: 'cat bomb',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL_O,
        dbName: 'TodoListDB',
        collectionName: "session"
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


if (cluster.isPrimary) {
    console.log('server starting now...');

    const cores = cpus().length

    for (let core = 0; core < cores; core++) {
        cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
      });
}else{
    https.createServer({
        key: fs.readFileSync(join(__dirname, 'key.pem')),
        cert: fs.readFileSync(join(__dirname, 'cert.pem'))
    },app).listen(process.env.PORT, () => {})
}