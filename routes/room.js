const { ensureAuthenticated } = require('../middleware/authenticate');
const roomSchema = require('../schemas/roomSchema');
const uuid = require('uuid').v4;
const router = require('express').Router();

router.get('/newroom', ensureAuthenticated, (req, res) => {
    res.render('dashboard/newroom');
})

router.post('/newroom', ensureAuthenticated, (req, res) => {
    const { name, users, playlist, currentSong } = req.body;
    const room = new roomSchema({
        name,
        author: req.user._id,
        id: uuid(),
        users,
        playlist,
        currentSong
    })
    room.save()
        .then(() => {
            res.redirect('/dashboard')
        })
        .catch(err => console.log(err))
})

//join a audio room by :id
router.get('/:id', ensureAuthenticated, (req, res) => {
    roomSchema.findById(req.params.id, (err, room) => {
        if (room){
            res.render('dashboard/room', { roomid: req.params.id, user: req.user, socketurl: process.env.SOCKET_URL });
        }
        else {
            res.redirect('/room/newroom');
        }
    });
})

module.exports = router
