const bcrypt = require('bcrypt')
const { reject } = require('bcrypt/promises')
const { response } = require('express')
const mongoose = require('mongoose')


// DB Connection
mongoose.connect(`${process.env.DB_URL}/TodoListDB`, { useNewUrlParser: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))

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
    },
    list: {
        type: Array,
        default: []
    }
})

// creates user model
const User = mongoose.model('users', todoSchema)

// Gets all users notes and returns a list
function getUserNotes(ID) {
    return new Promise((resolve, reject)=>{
        User.findOne({id: `${ID}`})
            .then(response=>{
                resolve(response.list)
            }).catch(err=>{
                reject(err)
            })
    })
}

// Pushes new note to the users list 
function pushNewNote(ID, note) {
    return new Promise((resolve, reject)=>{
        getUserNotes(ID)
            .then(notes=>{
                let index = 0
                notes.length > 0 ? index = notes[notes.length - 1].index + 1 : index = notes.length
                User.updateOne({id: `${ID}`}, { $push: { list: {index: index, note: note} } })
                    .then(response=> resolve(response))
                    .catch(err=> reject(err))
            })        
    })
}

// pull specified note from user
async function removeUserNote(ID, index, note) {
    return new Promise((resolve, reject)=>{
        User.updateOne(
            {id: `${ID}`}, 
            { $pull: { list: {index: Number(index) ,note: String(note)}} })
            .then(response=> resolve(response))
    })
}

function findOrCreate(username, password, id) {
    return new Promise((resolve, reject)=>{
        User.exists({userName: username})
        .then(exists=>{
            if (exists) {
                loginUser(username, password, id)
                    .then(response=> resolve(response))
                    .catch(err=> console.log(err))
            }else{
                createUser(username, password, id)
                    .then(data=>{
                        loginUser(username, password, id)
                            .then(response=> resolve(response))
                    })
                    .catch(err=> console.log(err))

            }
        })
    })
}

// check to see is username and password matches
async function loginUser(username, password, id) {
    return new Promise((resolve, reject)=>{
        User.findOne({userName: username})
            .then(response=>{
                if (!id) {
                    bcrypt.compare(password, response.password, (err, bool) => {
                        if (bool){
                            resolve({ID: response.id, userName: response.userName})
                        }else{
                            reject(false)
                        }
                    })
                }else{
                    if (response.id == id) {
                        resolve({ID: id, userName:username})
                    }else{
                        reject(false)
                    }
                }
            }).catch(err=>{
                reject(false)
            })
    })
}

// creates a new user
function createUser(username, password, id) {
    return new Promise((resolve, reject)=>{
        if (!id) {
            bcrypt.hash(password, Number(process.env.SALT_ROUNDS), (err, hashedPassword)=>{
                if (!err) {
                    const newUser = new User({
                        userName: username,
                        password: hashedPassword
                    })
                    newUser.save()
                        .then((data)=>{
                            resolve(data)
                        })
                }
            })
        }else{
            const newUser = new User({
                userName: username,
                id: id
            })
            newUser.save()
                .then((data)=>{
                    resolve(data)
                })
        }
    })
}

module.exports = {
    getUserNotes,
    pushNewNote,
    removeUserNote,
    findOrCreate,
    loginUser,
    createUser,
}