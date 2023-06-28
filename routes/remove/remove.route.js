const { join } = require('path');
const { Router } = require('express');
//local vars
const { removePostController } = require(join(__dirname, 'remove.controller.js'));

const removeNoteRouter = Router();

removeNoteRouter.post('/remove', removePostController);

module.exports = removeNoteRouter;