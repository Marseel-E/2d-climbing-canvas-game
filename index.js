const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth
canvas.height = innerHeight

const scoreElement = document.getElementById('score');
let score = 0;

const winDiv = document.getElementById('win-screen');
const totalScore = document.getElementById('total-score');
const startGameBtn = document.getElementById('start-game');

let gravity = 1.5;
let keys = {
	A: {
		code: 65,
		pressed: false
	},
	D: {
		code: 68,
		pressed: false
	},
	W: {
		code: 87
	}
}


class Player {
	constructor(x, y) {
		this.x = x
		this.y = y

		this.w = 30
		this.h = 30

		this.s = 10

		this.canJump = true

		this.c = '#2651f8'

		this.v = {
			x: 0,
			y: 0
		}
	}

	draw() {
		ctx.fillStyle = this.c
		ctx.fillRect(this.x, this.y, this.w, this.h)
	}

	update() {
		this.draw()

		this.x += this.v.x
		this.y += this.v.y

		if ((this.y + this.v.y + this.h) <= canvas.height) {
			this.v.y += gravity
		} else {
			cancelAnimationFrame(gameId)
			winDiv.style.display = 'flex'
			totalScore.innerHTML = score
		}
	}
}


class Platform {
	constructor(x, y, s) {
		this.x = x
		this.y = y

		this.w = 100
		this.h = 25

		this.s = s

		this.c = "limegreen"
 	}

 	draw() {
 		ctx.fillStyle = this.c
 		ctx.fillRect(this.x, this.y, this.w, this.h)
 	}
}


let platforms = []

function createPlatform(platform) {
	platforms.push(new Platform(Math.random() * ((canvas.width - platform.w) - 0) + 0, platform.y - (200 + (platform.s * 10)), platform.s + 1))
}
createPlatform(new Platform(Math.random() * ((canvas.width - 100) - 0) + 0, 400, 5))
function makePlatforms() {
	for (var i = 0; i < 100; i++) {
		createPlatform(platforms[i])
	}
}
makePlatforms()

function placePlayer() {
	return new Player((platforms.at(0).x + platforms.at(0).h) - 15, platforms.at(0).y - 60)
}
let player = placePlayer()


function init() {
	player = placePlayer()
	
	platforms = []
	createPlatform(new Platform(Math.random() * ((canvas.width - 100) - 0) + 0, 400, 5))
	makePlatforms()

	score = 0
	scoreElement.innerHTML = score

	winDiv.style.display = 'none'
}


let gameId
function gameLoop() {
	gameId = requestAnimationFrame(gameLoop)

	scrollBy(0, 1)

	ctx.fillStyle = "rgba(0,0,0,0.1)"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	player.update()

	if (keys.D.pressed) {
		player.v.x = player.s
	} else if (keys.A.pressed) {
		player.v.x = -player.s
	} else {
		player.v.x = 0
	}

	platforms.forEach((platform, index) => {
		platform.draw()

		if (platform.y + platform.h >= canvas.height) {
			platforms.splice(index, 1)

			score += 100
			scoreElement.innerHTML = score

		} else gsap.to(platform, {
			y: platform.y + platform.s
		})

		// platform collision detection
		if ((player.y + player.h) <= platform.y && (player.y + player.h + player.v.y) >= platform.y && (player.x + player.w) >= platform.x && player.x <= (platform.x + platform.w)) {
			player.v.y = 0
			player.canJump = true
		}
	})
}

startGameBtn.addEventListener('click', () => {
	init()
	gameLoop()
})


addEventListener('keydown', ({keyCode}) => {
	switch (keyCode) {
		case keys.A.code:
			keys.A.pressed = true
			return
		case keys.D.code: 
			keys.D.pressed = true
			return

		case keys.W.code:
			if (player.canJump && (player.y + 30) > 0) {
				gravity = 1.5
				player.v.y = 0

				player.v.y -= 30
				player.canJump = false

				createPlatform(platforms.at(-1))

				return
			}
	}
})

addEventListener('keyup', ({keyCode}) => {
	switch (keyCode) {
		case keys.A.code:
			keys.A.pressed = false
			return
		case keys.D.code:
			keys.D.pressed = false
			return
	}
})