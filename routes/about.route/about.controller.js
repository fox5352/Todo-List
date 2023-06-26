const { join } = require('path');
// local imports
const { data } = require(join(__dirname, '..', '..', 'globals.js'));//TODO:replace with page model

async function aboutController(req, res) {
    //sets the navBtn to home page then renders the page
    data.navBtn = true;//TODO:replace with page model
    res.render('about', { data: data });//TODO:replace with page model
}

module.exports = aboutController;