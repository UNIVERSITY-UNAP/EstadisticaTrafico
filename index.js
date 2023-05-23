const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

canvas.width = 1400
canvas.height = 600

class Road {
    constructor({ x = 0, y = 0, width, height }, color = "#ccc") {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.draw = function (ctx) {
            ctx.fillStyle = this.color
            ctx.fillRect(x, y, width, height)
        }
    }
}

class Car {
    constructor(
        { x = 0, y = 0, width = 30, height = 30 },
        speed = 2,
        color = "#ff0000") {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speed = speed
        this.color = color
        this.stop = false
        this.lastSpeed = this.speed
    }


    draw(ctx) {
        ctx.save()
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.restore()
    }

    setSpeed(speed) {
        this.lastSpeed = this.speed = speed
    }

    updateX() {
        if (!this.stop) this.x += this.speed
        /*
        if (this.x > canvas.width) {
            this.x = -this.width
        }
        else if (this.x < -this.width) {
            this.x = canvas.width
        }
        */
    }
    updateY() {
        this.y += this.speed
        if (this.y > canvas.height) {
            this.y = -this.height
        }
        else if (this.y < -this.height) {
            this.y = canvas.height
        }
    }
}

class Semaphore {
    constructor(
        { x = 0, y = 0, width = 30 }
    ) {
        this.x = x
        this.y = y
        this.height = this.width = width
        // this.color = ["#b81d13", "efb700", "#008450"]
        this.state = 0 //State 0 is red, 1 is green
        this.color = ["#ff4b00", "#a8d32a","#ffd400",  "#dd3400", "#93bf00", "#fdbf00"]
    }
    draw(ctx) {
        ctx.fillStyle = this.color[this.state]
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.fill()
        ctx.restore()
    }
}

const getRandom = (min, max) => (Math.floor(Math.random() * (max - min) + min))

const colores = ["#f00", "#0f0", "#00f", "#ff0", "#f0f", "#0ff", "fff", "000"]

const road1 = new Road({ x: 0, y: canvas.height / 2 - 35, width: canvas.width, height: 70 }, "#ccc")
const sem = new Semaphore({x:canvas.width/2, y: canvas.height/2-35-15-5, width:30})
let c = []
let st = Date.now() / 1000
let intervalo = 2.0
let intervaloSem = 4.
function animacionCarros() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //background
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    //Carreteras
    road1.draw(ctx)

    //Semaforo
    if (Date.now() / 1000 - st > intervaloSem)
    {
        sem.state = (sem.state+1) % 2
        intervaloSem += 4. + getRandom(3,4)
    }
    sem.draw(ctx)
    if (sem.state == 0) c.forEach(cc => {
        if(sem.x - (cc.x+cc.width) > 0 && sem.x - (cc.x+cc.width) <= 10) cc.speed = 0
    })
    else c.forEach(cc => { cc.speed = cc.lastSpeed })

    //Carros
    if (Date.now() / 1000 - st > intervalo) {
        c.push(new Car({ x: -40, y: canvas.height / 2 - 20, width: 40, height: 40 }, getRandom(10, 30) / 10, colores[getRandom(0, 6)]))
        intervalo += getRandom(1, 3)
    }

    //Emparejamiento de velocidad
    for (let i = 1; i < c.length; i++) {
        if(sem.x - (c[i].x+c[i].width) > 0 && sem.x - (c[i].x+c[i].width) <= 10) ;
        else if (c[i - 1].x - (c[i].x + c[i].width) <= 10) c[i].setSpeed(c[i - 1].speed)
    }

    //Muestra
    c.forEach(cc => {
        cc.updateX()
        cc.draw(ctx)
    })

    c = c.filter(cc => cc.x < canvas.width) 


    requestAnimationFrame(animacionCarros)
}
animacionCarros()