const bcrypt = require('bcrypt');
const { reject } = require('bcrypt/promises');
const { response } = require('express');
const mongoose = require('mongoose');


// DB Connection
mongoose.connect(`${process.env.DB_URL}/TodoListDB`, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => console.log('TodoListDB connected'));

// creates user schema
const todoSchema = mongoose.Schema({
    id: {
        type: String,
        unique: true,
        default: new mongoose.Types.ObjectId()
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    list: {
        type: Array,
        default: []
    }
});

// creates user model
const User = mongoose.model('users', todoSchema);

// Gets all users notes and returns a list
function getUserNotes(ID) {
    return new Promise((resolve, reject)=>{
        User.findOne({id: ID})
            .then(response=>{
                console.log(response);
                resolve(response.list)
            }).catch(err=>{
                reject()
            })
    })
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
async function loginUser(username, password) {
    return new Promise((resolve, reject)=>{
        User.findOne({userName: username})
            .then(response=>{
                bcrypt.compare(password, response.password, (err, bool) => {
                    if (bool){
                        resolve(response.id)
                    }else{
                        reject(false)
                    }
                })
            }).catch(err=>{
                reject(false)
            })
    })
}

// creates a new user
function createUser(username, password, salt) {
    return new Promise((resolve, reject)=>{
        bcrypt.hash(password, salt, (err, hashedPassword)=>{
            if (!err) {
                const newUser = new User({
                    userName: username,
                    password: hashedPassword
                })
                newUser.save()
                    .then((data)=>{
                        resolve(data)
                    })
            }else{
                resolve('')
            }
        })
    })
}

module.exports = {
    getUserNotes,
    pushNewNote,
    removeUserNote,
    loginUser,
    createUser,
};