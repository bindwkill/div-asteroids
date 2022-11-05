import { rocket } from './rocket.js'
import projectiles from './projectiles.js'
import asteroids from './asteroids.js'
import { entityController } from './entityController.js'
import Math2 from './essentials.js'

let IntervalID;
let toggleMouse = true
let pause = false
let score = 0
const spawnRate = () => Math.ceil(1 + score / 100)

const popup = document.querySelector('.popup')

const setPopUpStart = () => {
	popup.querySelector('[data-id=principalText]').textContent = "<div>Asteroids</div>"
	popup.querySelector('[data-id=sideText]').textContent = "An experimental buggy game"
	popup.querySelector('[data-id=button]').textContent = "PLAY"
}

const setPopUpPause = () => {
	popup.removeAttribute("hidden")
	popup.querySelector('[data-id=principalText]').textContent = "<div>Game Paused</div>"
	popup.querySelector('[data-id=sideText]').textContent = `Score: ${score}`
	popup.querySelector('[data-id=button]').textContent = "CONTINUE"
}

const setPopUpGameOver = () => {
	popup.removeAttribute("hidden")
	popup.querySelector('[data-id=principalText]').textContent = "<div>Game Over</div>"
	popup.querySelector('[data-id=sideText]').textContent = `Score: ${score}`
	popup.querySelector('[data-id=button]').textContent = "PLAY AGAIN"
}

const display = document.querySelector('[data-id=Display]')
display.prepend(rocket.container)

const spaceLimits = {
	width: display.offsetWidth,
	height: display.offsetHeight
}

const player = entityController.createEntity(spaceLimits['width'] / 2, spaceLimits['height'] / 2, -45, 0, 0, rocket);
const projectilesArray = []
const asteroidsArray = []
const eventHit = new Event('hit')

const resetGame = () => {
	while (projectilesArray.length > 0) {
		display.removeChild(projectilesArray.pop().getEntityModelContainer())
	}
	while (asteroidsArray.length > 0) {
		display.removeChild(asteroidsArray.pop().getEntityModelContainer())
	}
	score = 0
}

const mousePointerDistance = (mouseX, mouseY) => () => {
	const [x, y] = player.getPositionArray()
	return Math2.distanceBetween({ x, y }, { x: mouseX, y: mouseY })
}
let distanceToLastMousePosition = mousePointerDistance(...player.getPositionArray());

const movementListener = {
	'ArrowUp': () => player.increaseSpeed(1, 0),
	'ArrowDown': () => player.increaseSpeed(-1, 0),
	'ArrowLeft': () => player.increaseSpeed(0, -6),
	'ArrowRight': () => player.increaseSpeed(0, +6),
	'Escape': () => {
		toggleMouse = !toggleMouse;
		player.setSpeed(0, 0)
	},
	'KeyP': () => {
		pause = !pause
		if (pause) {
			setPopUpPause()
		}
	}
}

const shotProjectile = () => {
	if (projectilesArray.length >= 3) { return }
	const [x, y, angle] = player.getPositionArray()
	const projectile = projectiles.createProjectile('old_bullet.png')
	const bullet = entityController.createEntity(x, y - 48 * (projectilesArray.length + asteroidsArray.length), angle, 15, 0, projectile)
	projectilesArray.push(bullet)
	display.append(bullet.getEntityModelContainer())
}

const spawnAsteroid = () => {
	if (asteroidsArray.length <= spawnRate()) {
		const { width, height } = spaceLimits
		const position = {
			x: Math.random() * width,
			y: Math.random() * height,
			angle: Math.random() * 360
		}

		let distance = Math2.distanceBetween(player.getPosition(), position)
		while (distance <= height / 4) {
			position.x = Math.random() * width;
			position.y = Math.random() * height;
			distance = Math2.distanceBetween(player.getPosition(), position)
		}

		const asteroid = asteroids.createAsteroid('asteroid-icon.png')
		const entity = entityController.createEntity(
			position.x,
			position.y,
			position.angle + Math2.convertRadiansToDegree(Math2.getRectAngle(position.x, position.y, width / 2, height / 2)),
			Math.ceil(Math.random() * (1 + score / 100)),
			0,
			asteroid
		)

		entity.getEntityModelContainer().addEventListener('hit', event => { score += 5 })
		asteroidsArray.push(entity)
		display.append(entity.getEntityModelContainer())
	}
}

const destroyEntityByHit = (entity, index, array) => {
	const element = display.removeChild(entity.getEntityModelContainer())
	array.splice(index, 1)

	return !!element
}

const destroyEntityByBounds = (entity, index, array) => {
	const [x, y] = entity.getPositionArray()
	const { width, height } = spaceLimits
	const hitLaterals = x <= 0 || x >= width - 48
	const hitTopBottom = y <= 0 || y >= height - 48

	if (hitLaterals || hitTopBottom) {
		display.removeChild(entity.getEntityModelContainer())
		array.splice(index, 1)
		return true
	}
	return false
}

const seekMousePointer = (mouseX, mouseY) => {
	const [x, y] = player.getPositionArray()
	const theta = 90 + Math2.convertRadiansToDegree(Math2.getRectAngle(x, y, mouseX, mouseY));
	const newAngle = (mouseY - y < 0) ? -theta : 180 - theta

	player.setPosition(x, y, newAngle)
	distanceToLastMousePosition = mousePointerDistance(mouseX, mouseY)
}

const update = () => {
	if (pause) { return }

	spawnAsteroid()
	player.moveEntity(toggleMouse, distanceToLastMousePosition(), spaceLimits)
	player.rotateEntity()

	const checkIfOutOfBounds = (entity, index, array) => {
		entity.moveEntity(false, 0, spaceLimits)
		entity.rotateEntity()
		destroyEntityByBounds(entity, index, array)
	}
	projectilesArray.forEach(checkIfOutOfBounds)
	asteroidsArray.forEach(checkIfOutOfBounds)

	projectilesArray.forEach((projectile, pIndex, pArray) => {
		asteroidsArray.forEach((asteroid, aIndex, aArray) => {
			if (projectile.checkCollision(asteroid)) {
				asteroid.getEntityModelContainer().dispatchEvent(eventHit)
				destroyEntityByHit(asteroid, aIndex, aArray)
				destroyEntityByHit(projectile, pIndex, pArray)
			}
		})
	})

	asteroidsArray.forEach(asteroid => {
		if (asteroid.checkCollision(player)) {
			stopGame()
		}
	})

	document.querySelector('.score').value = score
}

document.querySelector('body').addEventListener('keydown', event => {
	const key = event.code
	if (movementListener[key]) {
		movementListener[key]()
	}
})

display.addEventListener("mousemove", event => {
	event.preventDefault()
	const { pageX, pageY } = event
	if (toggleMouse) {
		seekMousePointer(pageX, pageY)
	}
})

display.addEventListener("click", event => {
	event.preventDefault()
	if (!IntervalID) { return }
	if (toggleMouse && !pause) {
		const { offsetX, offsetY } = event
		shotProjectile(offsetX, offsetY)
		return
	}
	toggleMouse = !toggleMouse
})

popup.querySelector('[data-id=button]').addEventListener('click', event => {
	event.preventDefault()
	if (!IntervalID) {
		startGame()
		return
	}
	if (pause) {
		pause = false
		popup.setAttribute("hidden", true)
	}
})

const startGame = () => {
	popup.setAttribute("hidden", true)
	IntervalID = setInterval(update, 16)
}

const stopGame = () => {
	clearInterval(IntervalID)
	IntervalID = null
	setPopUpGameOver()
	resetGame()
}

setPopUpStart()