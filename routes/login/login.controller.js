
async function loginGetController(req, res) {
    const data = { navBtn: false }
    res.render('login', { data: data })
}


module.exports = {
    loginGetController,
}