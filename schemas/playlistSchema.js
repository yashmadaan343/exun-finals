const mongoose = require("mongoose")
const reqString = { type:String, required:true }
const moment = require("moment")
let now = new Date()
let dateStringWithTime = moment(now).format('YYYY-MM-DD HH:MM:SS');

const playlistSchema = new mongoose.Schema({
    name: reqString,
    id: reqString,
    songs: {type: Array, required: true},
    date: {
        type:String,
        default: dateStringWithTime
    },
})

module.exports = mongoose.model("Playlist", playlistSchema)
