const path = require('path');
const express = require('express');

const authRouter = express.Router();

// Google login route
authRouter.get('/google');

authRouter.get('/google/callback');

// GitHub login route
authRouter.get('/github');

authRouter.get('/github/callback');