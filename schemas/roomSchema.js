const mongoose = require("mongoose")
const reqString = { type: String, required: true }
const reqStringNoRequired = { type: String, required: false }
const reqBool = { type: Boolean, required: true }
const reqBoolNoRequired = { type: Boolean, required: false }

const roomSchema = new mongoose.Schema({
    name: reqString,
    author: reqString,
    id: reqString,
    users: [reqString],
    playlist: [reqStringNoRequired],
    private: reqBool,
    password: reqStringNoRequired,
    currentSong: reqStringNoRequired
})

module.exports = mongoose.model("Room", roomSchema)