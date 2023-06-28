const { join } = require('path');
// local imports 
const { removeUserNote, getUserNotes } = require(join(__dirname, '..', '..', 'model', 'user.model.js'));


async function removePostController(req, res) {
    const notes = await getUserNotes(req.user.ID)

    // pull the data from the data base 
    const response = await removeUserNote(req.user.ID, notes[req.body.index].index, notes[req.body.index].note);
    // then reloads the page
    res.redirect('/');
}

module.exports = {
    removePostController
};