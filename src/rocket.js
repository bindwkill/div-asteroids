const rocketBody = document.createElement("img")
rocketBody.setAttribute("class", "body")
rocketBody.setAttribute('src', './imgs/rocket.png')

const rocketPropel = document.createElement("img")
rocketPropel.setAttribute("class", "propel")
rocketPropel.setAttribute('src', './imgs/propel.png')

const rocketContainer = document.createElement("div")
rocketContainer.setAttribute("class", "container")

rocketContainer.append(rocketPropel);
rocketContainer.append(rocketBody);

const imagesAngleOffset = 45
const imageLinearOffset = 24

const move = (offsetX, offsetY, offsetAngle) => {
  rocketContainer.style.left = `${offsetX - imageLinearOffset}px`
  rocketContainer.style.top = `${offsetY - imageLinearOffset}px`
  rocketContainer.style.transform = `rotate(${offsetAngle + imagesAngleOffset}deg)`
}

const toggleEngine = isTurnedOn => {
  rocketPropel.style.visibility = isTurnedOn ? 'visible' : 'hidden'
}

const rocket = {
  container: rocketContainer,
  move,
  toggleEffects: toggleEngine
}

export { rocket }