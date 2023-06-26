const { join } = require('path');
const { Router } = require('express');
//local vars
const { removePostController } = require(join(__dirname, 'remove.controller.js'));

const removeNoteRouter = Router();

// TODO: replace userAccount with cookie data

removeNoteRouter.post('/', removePostController);

module.exports = removeNoteRouter;