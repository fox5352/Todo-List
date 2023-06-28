const path = require('path');
// local imports
const { getUserNotes, pushNewNote } = require(path.join(__dirname, '..', '..', 'model', 'user.model.js'));

async function homeGetController(req, res) {
    let data = {notes: [], navBtn: false}

    
    if (req.isAuthenticated() && req.user.ID) { //user session validator
        //gets users notes
        try{
            data.notes = await getUserNotes(req.user.ID)
            res.render('todoList', { data: data });
        }catch(error){
            res.redirect('/')
        }
    }else{
        res.redirect('/about')
    }
}

async function homePostController(req, res) {
    // pushes new note to users list
    const response = await pushNewNote(req.user.ID, req.body.newNote);  
    res.redirect("/");
}

module.exports = {
    homeGetController,
    homePostController

};
