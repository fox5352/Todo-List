const express = require('express');

function LoginMethodGetController(req,res){
    const data = { navBtn: false }

    res.render('loginMethod', {data: data})
}

module.exports = {
    LoginMethodGetController
}