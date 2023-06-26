const { join } = require('path');
// local imports 
const { removeUserNote, getUserNotes } = require(join(__dirname, '..', '..', 'model', 'user.model.js'));


async function removePostController(req, res) {
    // gets the users data
    const list = await getUserNotes('default');  //TODO: replace default with users cookie session
    // this is just temporary till i can find a way to remove from index rather than the string its self
    const delItem = list[req.body.index];

    // pull the data from the data base 
    const response = await removeUserNote('default', delItem);  //TODO: replace default with users cookie session

    // then reloads the page
    res.redirect('/');
}

module.exports = {
    removePostController
};