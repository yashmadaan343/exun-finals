const { route } = require('./landing');
const { v4: uuidv4 } = require('uuid');
const router = require('express').Router()
const Playlist = require('../schemas/playlistSchema')
const {ensureAuthenticated} = require('../middleware/authenticate')
const User = require("../schemas/userSchema")
const Song = require("../schemas/songSchema")

router.get("/new", ensureAuthenticated, (req, res) => {
    res.render("playlist/newplaylist", { user: req.user })
})

router.post("/new", ensureAuthenticated, (req, res) => {
    let id = uuidv4();
    User.findOne({
        id: req.user.id
    }, (err, doc) => {
        let playlist = new Playlist({
            name: req.body.name,
            id: id,
            songs: []
        })
        doc.playlists.push(playlist)
        doc.save().then(() => { res.redirect("/playlist/" + id) });
    })
})


router.get('/:id', ensureAuthenticated, async (req, res) => {
    User.findOne({ name: req.user.name }, async (err, doc) => {
        let index = doc.playlists.findIndex(x => x.id == req.params.id)
        if (doc.playlists[index].songs.length > 0) {
            await Promise.all(
                doc.playlists[index].songs.map(name => {
                    return new Promise((resolve, reject) => {
                        Song.findOne({ name:name }, function (err, doc) {
                            if (err) {
                                reject(err)
                            }
                            if (doc) {
                                resolve(doc)
                            }
                        })
                    })
                })).then(async (songs) => {
                    res.render("playlist/playlist", {
                        user: req.user,
                        songs: songs,
                        playlist: doc.playlists[index]
                    })
                })
        }
        else {
            res.render("playlist/playlist", {
                user: req.user,
                songs: [],
                playlist: doc.playlists[index]
            })
        }
    })
})



router.get("/all", ensureAuthenticated, (req, res) => {
    User.findOne(req.user, (err, doc) => {
        res.send(doc.playlists[0].name)
    })
})

router.get("/:id/add/:name", ensureAuthenticated,  (req, res) => {
    User.findOne(req.user, (err, doc) => {
        Song.findOne({ name: req.params.name }, async (err, doc1) => {
            let index = doc.playlists.findIndex(x => x.name == req.params.id)
            console.log(index)
            if (doc.playlists[index].songs.includes(req.params.name)) {
                res.send("Song already exists in playlist")
            } else {
                doc.playlists[index].songs.push(req.params.name)
                doc.save()
                    .then(res.send(doc))
            }
        })
    })
})

module.exports = router;