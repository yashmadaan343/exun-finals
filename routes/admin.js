const router = require('express').Router();
const {ensureAdminAuthenticated} = require('../middleware/authenticate') 
const Song = require('../schemas/songSchema')
const {uuid} = require('uuidv4')

router.get('/addSong', ensureAdminAuthenticated, (req, res) => {
    res.render('admin/addSong', {user: req.user})
})

router.post('/addSong', ensureAdminAuthenticated, async (req, res) => {
    const id = uuid()
    const {name, artist, img, genre} = req.body
    const newSong = new Song({
        name, artist, id, album_img:img, genre
      });
    newSong.save().then((song)=>{
        res.send(song)
    })
})

module.exports = router;