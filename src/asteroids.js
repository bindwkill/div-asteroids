const createAsteroid = (bodyImage, effectImage) => {
  const imagesAngleOffset = 0
  const imageWidthOffset = 0
  const imageHeightOffset = 0

  const asteroidBody = document.createElement("img")
  asteroidBody.setAttribute("class", "body")
  asteroidBody.setAttribute('src', `./imgs/${bodyImage}`)

  const asteroidEffect = document.createElement("img")
  asteroidEffect.setAttribute("class", "propel")
  asteroidEffect.setAttribute('src', `./imgs/${effectImage || 'transparent.png'}`)

  const asteroidContainer = document.createElement("div")
  asteroidContainer.setAttribute("class", "container")
  asteroidContainer.setAttribute("data-name", "asteroid")
  asteroidContainer.append(asteroidEffect);
  asteroidContainer.append(asteroidBody);

  const move = (offsetX, offsetY, offsetAngle) => {
    asteroidContainer.style.left = `${offsetX - imageWidthOffset}px`
    asteroidContainer.style.top = `${offsetY - imageHeightOffset}px`
    asteroidContainer.style.transform = `rotate(${offsetAngle + imagesAngleOffset}deg)`
  }

  const toggleEffects = isTurnedOn => {
    asteroidEffect.style.visibility = isTurnedOn ? 'visible' : 'hidden'
  }

  const asteroids = {
    container: asteroidContainer,
    move,
    toggleEffects
  }
  return asteroids
}


export default { createAsteroid }