// Global vars
const saltRounds = Number(process.env.SALT_ROUNDS);

let data = { navBtn: false, notes: [], alert: false, alertMessage: '' };// this holds all the page data
let userAccount = { userName: "default" };//loggedIn username
let counter = 0;// to automatically display the about page if it's the default user account


module.exports = {
    saltRounds,
    data,
    userAccount,
    counter,
};