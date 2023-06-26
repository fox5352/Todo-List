const path = require('path');
// local imports
const { getUserNotes, pushNewNote } = require(path.join(__dirname, '..', '..', 'model', 'user.model.js'));

async function homeGetController(req, res) {
    let data = {notes: [], navBtn: false}

    
    if (req.isAuthenticated() && req.user) { //user session validator
        //gets users notes
        // data.notes = await getUserNotes(req.user)
        res.render('todoList', { data: data });
    }else{
        res.redirect('/about')
    }
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
