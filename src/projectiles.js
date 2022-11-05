const createProjectile = (bodyImage, effectImage) => {
  const imagesAngleOffset = 0
  const imageWidthOffset = 16
  const imageHeightOffset = 64

  const projectileBody = document.createElement("img")
  projectileBody.setAttribute("class", "body_mini")
  projectileBody.setAttribute('src', `./imgs/${bodyImage}`)

  const projectileEffect = document.createElement("img")
  projectileEffect.setAttribute("class", "propel")
  projectileEffect.setAttribute('src', `./imgs/${effectImage || 'transparent.png'}`)

  const projectileContainer = document.createElement("div")
  projectileContainer.setAttribute("class", "container_mini")
  projectileContainer.append(projectileEffect);
  projectileContainer.append(projectileBody);

  const move = (offsetX, offsetY, offsetAngle) => {
    projectileContainer.style.left = `${offsetX - imageWidthOffset}px`
    projectileContainer.style.top = `${offsetY - imageHeightOffset}px`
    projectileContainer.style.transform = `rotate(${offsetAngle + imagesAngleOffset}deg)`
  }

  const toggleEffects = isTurnedOn => {
    projectileEffect.style.visibility = isTurnedOn ? 'visible' : 'hidden'
  }

  const projectiles = {
    container: projectileContainer,
    move,
    toggleEffects
  }
  return projectiles
}


export default { createProjectile }