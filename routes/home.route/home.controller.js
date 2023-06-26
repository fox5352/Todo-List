const path = require('path');
// local imports
const { data } = require(path.join(__dirname, '..', '..', 'globals'));//TODO:replace with page model
const { getUserNotes, pushNewNote } = require(path.join(__dirname, '..', '..', 'model', 'user.model.js'));

async function homeGetController(req, res) {

    //gets users notes
    data.notes = await getUserNotes('default') || []; //TODO:replace with page model

    // sets the navBtn to false which loads the about page button
    data.navBtn = false; //TODO:replace with page model

    // if its the default user account first redirect to about page
    res.render('todoList', { data: data });//TODO:replace with page model
}

async function homePostController(req, res) {

    // pushes new note to users list
    const response = await pushNewNote('default', req.body.newNote);  //TODO: needs users data

    res.redirect("/");
}

module.exports = {
    homeGetController,
    homePostController

};
