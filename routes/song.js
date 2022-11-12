const router = require('express').Router();
const {ensureAuthenticated} = require('../middleware/authenticate')
    path = require('path'),
    fs = require('fs'),
    Song = require('../schemas/songSchema.js')

router.get('/play/:name',async(req, res)=>{
    const filePath = path.join(__dirname, '../songs/' + req.params.name + '.mp3');
    if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(filePath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'audio/mpeg',
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'audio/mpeg',
            };
            res.writeHead(200, head);
            fs.createReadStream(filePath).pipe(res);
        }
    
    }else{
        res.send("Can't find song!")
    }
})

router.get('/details/:name',ensureAuthenticated, async (req, res)=>{
        Song.findOne({name: req.params.name}, (err, song)=>{
            if(err){
                res.send("Something went wrong!")
                console.log(err)
            }else{
                res.render('song/details', {song, user:req.user})
            }
        })
})

router.get('/all', ensureAuthenticated, async (req, res)=>{
    Song.find({}, (err, songs)=>{
        if(err){
            res.send("Something went wrong!")
            console.log(err)
        }else{
            res.render('song/songs', {songs, user:req.user})
        }
    })
})

module.exports = router;