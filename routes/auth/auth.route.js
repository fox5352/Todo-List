const path = require('path');
const express = require('express');
const passport = require('passport');

const authRouter = express.Router();

// Google login route
authRouter.get('/google',
    passport.authenticate('google', {
        scope: ['profile']
    })
);
authRouter.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/loginMethod',
        successRedirect: '/',
    }),(req, res) => {});

// GitHub login route
authRouter.get('/github',
    passport.authenticate('github', {
    }),
    (req, res)=>{
        console.log('test');
    }
);
authRouter.get('/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/loginMethod',
        successRedirect: '/',
    }),(req, res) => {
        console.log('test');
    });

module.exports = authRouter