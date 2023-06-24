const path = require('path');
const express = require('express');
//local vars
const { getUserNotes, pushNewNote } = require(path.join(__dirname, '..', 'model', 'user.model'));
const { data } = require(path.join(__dirname, '..', 'globals'));

const homeRouter = express.Router();

// TODO: replace data with cookie

// Handles home page
homeRouter.get('/', async function (req, res) {

    //gets users notes
    // data.notes = await getUserNotes(userAccount.userName) || []; //TODO: needs users data

    // sets the navBtn to false which loads the about page button
    data.navBtn = false;

    // if its the default user account first redirect to about page
    res.render('todoList', { data: data });
});

// sends data to the data base
homeRouter.post('/', async function (req, res) {

    // pushes new note to users list
    // const response = await pushNewNote(userAccount.userName, req.body.newNote);  //TODO: needs users data

    res.redirect("/");
});

module.exports = homeRouter;