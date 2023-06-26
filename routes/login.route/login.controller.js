const path = require('path');
// local imports
let { data } = require(path.join(__dirname, '..', '..', 'globals.js'));//TODO:replace with page model
const { loginUser } = require(path.join(__dirname, '..', '..', 'model', 'user.model.js'));

async function loginGetController(req, res) {
    res.render('loginMethod', { data: data });//TODO:replace with page model
}

async function loginPostController(req, res) {
    // local authentication 
}

module.exports = {
    loginGetController,
    loginPostController
};