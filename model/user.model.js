const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { response } = require('express');


// DB Connection
mongoose.connect(`${process.env.DB_URL}TodoListDB`, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => console.log('TodoListDB connected'));

// creates user schema
const todoSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    list: {
        type: Array
    }
});

// creates user model
const User = mongoose.model('users', todoSchema);

// Gets all users notes and returns a list
async function getUserNotes(username) {
    try {
        const response = await User.findOne({ userName: username });
        return response.list;
    } catch (error) {
        console.log(error);
        return;
    }
}

// Pushes new note to the users list 
async function pushNewNote(username, note) {
    try {
        const response = await User.updateOne({ userName: username }, { $push: { list: note } });
        return response;
    } catch (error) {
        console.log(error);
        return;
    }
}

// TODO: pull data from index not string in the remove route.
// pull specified note from user
async function removeUserNote(username, note) {
    try {
        const response = await User.updateOne({ userName: username }, { $pull: { list: note } });
        return response;
    } catch (error) {

    }
}

// check to see is username and password matches
function loginUser(username, password) {
    return new Promise((resolve, reject) => {
        User.findOne({ userName: username })
            .then(response => {
                bcrypt.compare(password, response.password, (err, bool) => {
                    if (!err) {
                        resolve(bool);
                    } else {
                        reject(err);
                    }
                });
            });

    });


}

// creates a new user
async function createUser(username, password, salt) {
    //validates if the userName exists already 
    const exists = await User.exists({ userName: username });
    if (!exists) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (!err) {
                    const newUser = new User({
                        userName: username,
                        password: hash,
                        list: []
                    });
                    newUser.save()
                        .then(resolve(true));
                } else {
                    reject(false);
                }
            });
        });
    } else {
        //account already exists
        return false;
    }

}

module.exports = {
    getUserNotes,
    pushNewNote,
    removeUserNote,
    loginUser,
    createUser,
};