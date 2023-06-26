const path = require('path');
const {Router} = require('express');
const passport = require('passport');
//local imports
const { loginGetController } = require(path.join(__dirname, 'login.controller.js'));

const loginRouter = Router();

// renders login form page
loginRouter.get('/', loginGetController);


loginRouter.post('/', 
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        session: true,        
    })
); //TODO: use passport localStrategy)

module.exports = loginRouter;