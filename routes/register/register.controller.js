const { join } = require('path');
// local imports
const { createUser } = require(join(__dirname, '..', '..', 'model', 'user.model.js'));


async function registerGetController(req, res) {
    const data = {navBtn: false}
    res.render('register', { data: data }); // TODO:replace with page model
}

async function registerPostController(req, res) {
    // TODO: add authentication

    // check if passwords match
    if (req.body.password1 === req.body.password2) {
        try {
            const response = await createUser(req.body.userName, req.body.password1, Number(process.env.SALT_ROUNDS)); 
            // console.log(response.id);
            res.redirect('/')// TODO: added authentication here
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/register');
    }
}

module.exports = {
    registerGetController,
    registerPostController
};