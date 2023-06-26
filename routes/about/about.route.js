const path = require('path');
const express = require('express');

//local imports
const aboutController = require(path.join(__dirname, "about.controller.js"));


const aboutRouter = express.Router();

aboutRouter.get('/', aboutController);

module.exports = aboutRouter;