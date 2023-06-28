const { Router} = require('express');
const { join } = require('path');
// local imports
const {LoginMethodGetController} = require(join(__dirname, 'loginMethod.controller.js'));

const loginMethodRouter = Router()

loginMethodRouter.get('/',LoginMethodGetController)

module.exports = loginMethodRouter

