const mongoose = require('mongoose'),
    reqString = { type: String, required: true },
    nonreqString = { type: String, required: false },
    reqBoolean = { type: Boolean, required: true, default: false },
    moment = require('moment'),
    now = new Date(),
    dateStringWithTime = moment(now).format('YYYY-MM-DD HH:MM:SS');
const passportLocalMongoose = require("passport-local-mongoose");
const playlistSchema = new mongoose.Schema({
    name: reqString,
    id: reqString,
    songs: {type: Array, required: true},
    date: {
        type:String,
        default: dateStringWithTime
    },
})

const userSchema = new mongoose.Schema({
    email: reqString,
    name: reqString,
    password: reqString,
    date: {
        type: String,
        default: dateStringWithTime
    },
    userId: reqString,
    admin: reqBoolean,
    pfp: {type:String, default:"https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png"},
    access_token: {type: String, default: ""},
    playlists: [playlistSchema]
})
userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema)