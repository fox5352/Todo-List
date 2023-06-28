const path = require('path');
const express = require('express');
const passport = require('passport');

const authRouter = express.Router();

// Google login route
authRouter.get('/auth/google',
    passport.authenticate('google', {
        scope: ['email']
    })
);
authRouter.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/loginMethod',
        successRedirect: '/',
    }),(req, res) => {});

// GitHub login route
authRouter.get('/auth/github',
    passport.authenticate('github', {
        scope: ["email"]
    })
);
authRouter.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/loginMethod',
        successRedirect: '/',
    }),(req, res) => {});

module.exports = authRouter