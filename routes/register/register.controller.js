const passport = require('passport');
const { join } = require('path');
// local imports
const { findOrCreate } = require(join(__dirname, '..', '..', 'model', 'user.model.js'));


async function registerGetController(req, res) {
    const data = {navBtn: false}
    res.render('register', { data: data });
}

async function registerPostController(req, res) {
    // TODO: add authentication
    req.isAuthenticated() && req.Logout((dat)=>{})

    // check if passwords match
    if (req.body.password1 === req.body.password2) {
        passport.authenticate('local',{
            successRedirect:'/',
            failureRedirect:'/register'
        },(req,res))
    } else {
        res.redirect('/register');
    }
    

}

module.exports = {
    registerGetController,
    registerPostController
};