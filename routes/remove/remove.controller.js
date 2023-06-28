const { join } = require('path');
const express = require('express');
// local imports 
const { removeUserNote, getUserNotes } = require(join(__dirname, '..', '..', 'model', 'user.model.js'));


async function removePostController(req, res) {
    if (req.isAuthenticated() && req.user.ID) {
        const notes = await getUserNotes(req.user.ID)
        // pull the data from the data base 
        const response = await removeUserNote(req.user.ID, notes[req.body.index].index, notes[req.body.index].note);
        // then reloads the page
        res.redirect('/');
    }else {
        res.redirect('/login');
    }
}

module.exports = {
    removePostController
};