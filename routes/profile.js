require('dotenv').config()
const router = require('express').Router();
const { ensureAuthenticated } = require('../middleware/authenticate')
const User = require('../schemas/userSchema')
const SpotifyWebApi = require('spotify-web-api-node')

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.APP_BASE_URL + 'profile/spotify-callback/'
})

// const token = 'BQAqrIIFhe7hiiy1zo0Y0fcNUUrnHiYxG-PFqcGDtVHIflEYqYMi8hImGmAvMr4WZe2-OHEkfryXLfKBuxyHhz77fvm89e0ccyZUcF7a9WtxAlrj7Kt-tRHgdMqPl4CAh3rfUIIOquAL0HwrkYySWbprAU1bo-04n-5b7Iuzc0prPUDnBooMU2W8VDAWlMPpgE6RFRwhaRFIlg'
// spotifyApi.setAccessToken(token)
router.get('/connect-spotify', async(req, res, next)=>{
    res.redirect(spotifyApi.createAuthorizeURL([
        'user-read-playback-state',
        'user-read-currently-playing',
    ]))
})

router.get('/spotify-callback/', (req, res, next) => {
    const code = req.query.code
    spotifyApi.authorizationCodeGrant(code).then(
        async function(data) {
            const access_token = data.body['access_token']
            console.log(access_token)
            const user = await User.findOneAndUpdate({userId:req.user.userId}, {access_token})
            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.setRefreshToken(data.body['refresh_token']);
        }).then(() => {
            res.render('index', {user: req.user})
        })
})

router.get('/', ensureAuthenticated, async (req, res) => {
    console.log(spotifyApi.getAccessToken())
    const user = await User.findOne({userId:req.user.userId})
    if(spotifyApi.getAccessToken()){
        spotifyApi.getMyCurrentPlayingTrack()
        .then(async function(data) {
            const song = data.body.item
            if(song){
                const name = song.name
                const artist = song.artists[0].name
                const image = await song.album.images[0].url
                res.render('profile', {user: req.user, name, artist, image, connect:false})
            }else{
                res.render('profile', {user: req.user, name: " ", connect:false}) 
            }
        }, function(err) {
            console.log('Something went wrong!', err);
        });    
    }else{
        res.render('profile', {user: req.user, name: " ", connect:true})
    }
})

router.post('/edit', ensureAuthenticated, async (req, res) => {
    const {name, email, pfp} = req.body
    if(!name || !email) res.send({"msg": "Please fill out all fields"})
    else{
        await User.findOneAndUpdate({userId: req.user.userId},{name, email,pfp}).then((user)=>{
            res.send({success: true, msg: "Profile updated"})
        })
    }
})

router.get('/:id', async (req, res) => {
    const user = await User.findOne({ _id: req.params.id })
    if (user) {
        res.send({ user })
    } else {
        res.send({ msg: "User not found" })
    }
})

module.exports = router;