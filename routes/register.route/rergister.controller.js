const { join } = require('path');
// local imports
const { data } = require(join(__dirname, '..', '..', 'globals.js')); // TODO:replace with page model
const { createUser } = require(join(__dirname, '..', '..', 'model', 'user.model.js'));


async function registerGetController(req, res) {
    res.render('register', { data: data }); // TODO:replace with page model
}

async function registerPostController(req, res) {
    // TODO: add authentication
    // check if passwords match
    if (req.body.password1 === req.body.password2) {
        // const response = await createUser(req.body.userName, req.body.password1, saltRounds);

        if (response) {
            res.redirect('/');
        } else {
            res.redirect('/register');
        }

    } else {
        res.redirect('/register');
    }
}

module.exports = {
    registerGetController,
    registerPostController
};