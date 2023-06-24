const express = require('express');
//local imports
const { createUser } = require('../model/user.model');

const registerRouter = express.Router();

//renders register page
registerRouter.get('/', async function (req, res) {
    let { data } = require('../globals');
    res.render('register', { data: data });
});
//validates then creates new users then redirects to home page
registerRouter.post('/', async function (req, res) {
    let { userAccount, saltRounds } = require('../globals');

    // check if passwords match
    if (req.body.password1 === req.body.password2) {
        const response = await createUser(req.body.userName, req.body.password1, saltRounds);

        if (response) {
            userAccount = { userName: req.body.userName };
            res.redirect('/');
        } else {
            res.redirect('/register');
        }

    } else {
        res.redirect('/register');
    }
});

module.exports = registerRouter;