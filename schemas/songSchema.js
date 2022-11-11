const mongoose = require("mongoose")
const reqString = { type:String, required:true }

const songSchema = new mongoose.Schema({
    name: reqString,
    artist: reqString,
    id: reqString,
    album_img: reqString,
    genre: reqString,
})

module.exports = mongoose.model("Song", songSchema)
