// Global vars
const saltRounds = Number(process.env.SALT_ROUNDS);

let data = { navBtn: false, notes: []};// this holds all the page data

module.exports = {
    saltRounds,
};