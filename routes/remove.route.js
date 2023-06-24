const express = require('express');
//local vars
const { removeUserNote, getUserNotes } = require('../model/user.model');

const removeNoteRouter = express.Router();

// TODO: replace userAccount with cookie data

removeNoteRouter.post('/', async function (req, res) {
    // gets the users data
    // const list = await getUserNotes(userAccount.userName);  //TODO: needs users data
    // this is just temporary till i can find a way to remove from index rather than the string its self
    const delItem = list[req.body.index];

    // pull the data from the data base 
    // const response = await removeUserNote(userAccount.userName, delItem);  //TODO: needs users data

    // then reloads the page
    res.redirect('/');
});

module.exports = removeNoteRouter;