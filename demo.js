const GifEncoder = require('gifencoder')
const gifEncoder = new GifEncoder(400,400)
const pngStream = require('png-stream')
const fs = require('fs')
module.exports = function(fileName) {
    pngStream.createReadStream('imgs/*.png').pipe(gifEncoder.createWriteStream({repeat:0,delay:100})).pipe(fs.createWriteStream(fileName))
}
