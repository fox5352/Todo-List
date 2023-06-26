const { join } = require('path');
const { Router } = require('express');
//local imports
const { registerGetController, registerPostController } = require(join(__dirname,'register.controller.js'));


const registerRouter = Router();

//renders register page
registerRouter.get('/', registerGetController);

//validates then creates new users then redirects to home page
registerRouter.post('/', registerPostController);

module.exports = registerRouter;