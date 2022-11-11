const router = require('express').Router();
const {ensureAdminAuthenticated} = require('../middleware/authenticate') 
const Song = require('../schemas/songSchema')
router.get('/addSong', ensureAdminAuthenticated, (req, res) => {
    res.render('admin/addSong')
})

router.post('/addSong', ensureAdminAuthenticated, async (req, res) => {
    const {name, artist, id, album_img} = req.body
    const newSong = new Song({
        name, artist, id, album_img
      });
    newSong.save().then((song)=>{
        res.send(song)
    })
})

module.exports = router;