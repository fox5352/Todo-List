const path = require('path');
const express = require('express');
//local vars
const { homeGetController, homePostController } = require(path.join(__dirname, 'home.controller.js'));

const homeRouter = express.Router();

// Handles home page
homeRouter.get('/', homeGetController);

// sends data to the data base
homeRouter.post('/', homePostController);

module.exports = homeRouter;