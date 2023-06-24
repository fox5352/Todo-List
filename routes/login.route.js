const express = require('express');
//local imports
const { loginUser } = require('../model/user.model');
let { data } = require('../globals');

// TODO: add github and google oauth

const loginRouter = express.Router();

// renders login form page
loginRouter.get('/', async function (req, res) {
    res.render('loginMethod', { data: data });
});

loginRouter.post('/', function (req, res) {
    // local authentication
});

module.exports = loginRouter;