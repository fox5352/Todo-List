const path = require('path');
const express = require('express');
//local imports
const { loginGetController, loginPostController } = require(path.join(__dirname, 'login.controller.js'));

// TODO: add github and google oauth

const loginRouter = express.Router();

// renders login form page
loginRouter.get('/', loginGetController);

loginRouter.post('/', loginPostController);

module.exports = loginRouter;