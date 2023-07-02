const bcrypt = require('bcryptjs')
const { join} = require('path');
const mongoose = require('mongoose')
//local imports
const User = require(join(__dirname, 'user.schema.js'))

// DB Connection
mongoose.connect(
    `${process.env.DB_URL_O}/TodoListDB`, { 
   useNewUrlParser: true, 
    useUnifiedTopology: true 
}
)
mongoose.connection.once('open', ()=>{console.log('connected');})
mongoose.connection.once('error', (err)=>console.error(err))

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

// pull specified note from user using user ID, index number and note
async function removeUserNote(ID, index, note) {
    return new Promise((resolve, reject)=>{
        User.updateOne(
            {id: `${ID}`}, 
            { $pull: { list: {index: Number(index) ,note: String(note)}} })
            .then(response=> resolve(response))
    })
}

// checks to see if account exists, if true it calls loginUser otherwise it calls createUser and passes the data
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

// if theres no id passed checks to see is username and password matches
// if theres a id then checks to see if users id matches
async function loginUser(username, password, id) {//TODO: change to find many later
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

// if there no id then its a local registering and uses password
// if theres a id then is creates user with no password
function createUser(username, password, id) {//TODO: add email param later
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