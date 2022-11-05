import Math2 from "./essentials.js"

const createEntity = (offsetX, offsetY, offsetAngle, linearSpeed, angularSpeed, entityModel) => {
  const position = { x: offsetX, y: offsetY, angle: offsetAngle }
  const speed = { linear: linearSpeed, angular: angularSpeed }
  const model = entityModel
  const mouseRange = 128

  const toggleModelVisibility = isVisible => {
    model.container.style.visibility = isVisible ? 'visible' : 'hidden'
  }

  const setPosition = (x, y, angle) => {
    position['x'] = isNaN(x) ? position['x'] : x
    position['y'] = isNaN(y) ? position['y'] : y
    position['angle'] = isNaN(angle) ? position['angle'] : angle
  }

  const getPosition = () => position;

  const getPositionArray = () => Object.values(position);

  const setSpeed = (linear, angular) => {
    speed['linear'] = isNaN(linear) ? speed['linear'] : linear
    speed['angular'] = isNaN(angular) ? speed['angular'] : angular
  }
  const getSpeedArray = () => Object.values(speed);

  const increaseSpeed = (linear = 0, angular = 0) => {
    speed['linear'] += linear
    speed['angular'] += angular
  }

  const angularSpeedFadeOut = () => {
    const signal = Math2.getSignal(speed['angular'])
    speed['angular'] += signal * (-1)
  }

  const angularSpeedFadeIn = (theta) => {
    const delta = theta - position['angle']
    const signal = Math2.getSignal(delta)
    speed['angular'] += signal
  }

  const rotateEntity = () => {
    const { angle } = position
    const { angular: angularSpeed } = speed
    position['angle'] = (angle + angularSpeed) % 360
    angularSpeedFadeOut()
  }

  const getEntityModelContainer = () => model.container

  const moveEntity = (isMouseControlling, distanceToMousePoint, spaceLimits) => {
    const radians = Math2.convertDegreeToRadians(position['angle'])
    const [x, y] = getPositionArray()
    const { width: maxWidth, height: maxHeight } = spaceLimits
    if (isMouseControlling) {
      const distance = Math.abs(distanceToMousePoint || 0) || 0
      speed['linear'] = distance < mouseRange ? 0 : Math.min(10, distance)
    }
    const newX = Math2.minMaxInCorners(0, maxWidth, x + Math.cos(radians) * speed['linear'])
    const newY = Math2.minMaxInCorners(0, maxHeight, y + Math.sin(radians) * speed['linear'])
    setPosition(newX, newY)
    updateModel()
  }

  const updateModel = () => {
    model.move(...getPositionArray())
    model.toggleEffects(speed['linear'] !== 0)
  }

  const checkCollision = entity => {
    const thisHitBox = getEntityModelContainer().getBoundingClientRect()
    const anotherHitBox = entity.getEntityModelContainer().getBoundingClientRect()

    return !(
      thisHitBox.top > anotherHitBox.bottom ||
      thisHitBox.right < anotherHitBox.left ||
      thisHitBox.bottom < anotherHitBox.top ||
      thisHitBox.left > anotherHitBox.right
    );
  }

  const entity = {
    rotateEntity,
    moveEntity,
    getSpeedArray,
    getPositionArray,
    getPosition,
    setPosition,
    setSpeed,
    increaseSpeed,
    getEntityModelContainer,
    toggleModelVisibility,
    checkCollision
  }
  return entity
}

const entityController = {
  createEntity
}
export { entityController }