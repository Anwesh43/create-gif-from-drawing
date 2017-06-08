class Shape {
    constructor(point) {
        this.points = []
    }
    draw(context) {
        context.lineWidth = 5
        context.save()
        context.beginPath()
        this.points.forEach((point,index)=>{
            if(index == 0) {
                context.moveTo(point.x,point.y)
            }
            else {
                context.lineTo(point.x,point.y)
            }
        })
        context.stroke()
        context.restore()
    }
    addPoint(point) {
        this.points.push(point)
    }
}
const canvas = document.getElementById('drawingSpace')
const context = canvas.getContext('2d')
const shapes = []
var isDown = false
const socket = io.connect('http://localhost:9001/gifapp')
function sendImageData() {
    const dataURL = canvas.toDataURL()
    const imageDataParts = dataURL.split(",")
    if(imageDataParts.length == 2) {
        socket.emit('save',imageDataParts[1])
    }
}
function draw() {
    context.clearRect(0,0,canvas.width,canvas.height)
    context.fillStyle = 'white'
    context.fillRect(0,0,canvas.width,canvas.height)
    shapes.forEach((shape)=>{
        shape.draw(context)
    })
    if(currShape) {
        currShape.draw(context)
    }
}
canvas.onmousedown = (event) => {
    const x = event.offsetX,y = event.offsetY
    if(isDown == false) {
        window.currShape = new Shape({x,y})
        isDown = true
        draw()
        sendImageData()
    }
}
canvas.onmousemove = (event) => {
    const x = event.offsetX,y = event.offsetY
    if(isDown == true) {
        currShape.addPoint({x,y})
        draw()
        sendImageData()
    }
}
canvas.onmouseup = (event) => {
    if(isDown == true) {
        isDown = false
        shapes.push(currShape)
        window.currShape = undefined
        draw()
    }
}
window.onkeydown = (event) => {
    if(event.keyCode == 13) {
        console.log("trying to create gif")
        socket.emit('creategif','drawing.gif')
    }
}
draw()
