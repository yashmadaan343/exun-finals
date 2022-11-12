const { raw } = require('body-parser');
const { ensureAuthenticated } = require('../middleware/authenticate');

const router = require('express').Router();
//join a audio room by :id
router.get('/:id', ensureAuthenticated, (req, res) => {
    res.render('dashboard/room1', { roomid: req.params.id, user: req.user, socketurl: process.env.SOCKET_URL });
})


module.exports = router