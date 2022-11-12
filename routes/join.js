const router = require('express').Router()

const { ensureAuthenticated } = require('../middleware/authenticate');
router.get('/', ensureAuthenticated, (req, res)=>{
    res.render('dashboard/join', {user: req.user})
})

module.exports = router;