
async function aboutController(req, res) {
    const data = {navBtn: true}
    //sets the navBtn to home page then renders the page
    res.render('about', { data: data });//TODO:replace with page model
}

module.exports = aboutController;