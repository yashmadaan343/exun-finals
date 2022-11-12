const { raw } = require('body-parser');
const { ensureAuthenticated } = require('../middleware/authenticate');
const roomSchema = require('../schemas/roomSchema');
const songSchema = require('../schemas/songSchema');
const uuid = require('uuid').v4;
const router = require('express').Router();

router.get('/newroom', ensureAuthenticated, async (req, res) => {
    var songs = await songSchema.find({}).sort({ songName: 1 });
    res.render('dashboard/newroom', { songs: songs });
})

router.post('/newroom', ensureAuthenticated, (req, res) => {
    const { name, playlist, currentSong, password, private } = req.body;
    console.log(req.body);
    var id = uuid();
    var room;
    if (private == true) {
        room = new roomSchema({
            name,
            author: req.user._id,
            id,
            users: [],
            playlist,
            //currentSong,
            private: true,
            password
        });
    } else {
        room = new roomSchema({
            name,
            author: req.user._id,
            id,
            users: [],
            private: false,
            password: '',
            playlist,
            //currentSong
        })
    }
    room.save().then(() => {
        res.send({roomId: id});
    }).catch(err => console.log(err))
})

//join a audio room by :id
router.get('/:id', ensureAuthenticated, async (req, res) => {
    roomSchema.findOne({id: req.params.id}, async  (err, room) => {
        console.log(room);
        var songs = await room.playlist.map(async song => await songSchema.findOne({_id: song}));
        songs = await Promise.all(songs);
        console.log(songs);
        if (room) {
            res.render('dashboard/room1', { roomid: req.params.id, user: req.user, socketurl: process.env.SOCKET_URL, songs:await songs });
        }
        else {
            res.redirect('/room/newroom');
        }
    });
});

module.exports = router