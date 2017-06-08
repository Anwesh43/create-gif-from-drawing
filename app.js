const http = require('http')
const express = require('express')
const expressServer = express()
const path = require('path')
expressServer.use(express.static(path.join(__dirname,'public')))
const server = http.createServer(expressServer)
const socketIO = require('socket.io')
const io = socketIO(server)
const ImageSaver = require('image-saver-nodejs/lib')
const imageSaver = new ImageSaver()
var count = 0
const seq_queue = require('seq-queue')
const saveQueue = seq_queue.createQueue(1000)
const createQueue = seq_queue.createQueue(1000)
const createGIF = require('./GifCreator')
io.of('/gifapp').on('connect',(socket)=>{
    console.log("connect")
    socket.on('save',(base64Data)=>{
        saveQueue.push((cb)=>{
            imageSaver.saveFile(`imgs/${count}.png`,base64Data).then((data)=>{
                console.log(`${count}.png is saved successfully`)
                count++
                cb.done()
            }).catch((err)=>{
                console.log("error in saving the image")
                cb.done()
            })
        })
    })
    socket.on('creategif',(fileName)=>{
        createQueue.push((cb)=>{
            console.log(`trying to create ${fileName}`)
            createGIF(fileName)
            console.log("gif is created")
            cb.done()
        })
    })
})
server.listen(9001,()=>{
    console.log("listening on 9001 port")
})
