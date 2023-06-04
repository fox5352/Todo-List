require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));



app.listen(process.env.PORT, () => { console.log(`server started on port ${process.env.PORT}`); });