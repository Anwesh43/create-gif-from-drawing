const GifEncoder = require('gifencoder')
const gifEncoder = new GifEncoder(400,400)
const pngStream = require('png-file-stream')
const fs = require('fs')
module.exports = function(fileName) {
    pngStream('imgs/*.png').pipe(gifEncoder.createWriteStream({repeat:0,delay:50,quality:200})).pipe(fs.createWriteStream(fileName))
}
