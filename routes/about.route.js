const express = require('express');
//local imports
const { data } = require('../globals');

const aboutRouter = express.Router();

aboutRouter.get('/', async function (req, res) {
    //sets the navBtn to home page then renders the page
    data.navBtn = true;
    res.render('about', { data: data });
});

module.exports = aboutRouter;