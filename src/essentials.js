const convertDegreeToRadians = degree => degree * Math.PI / 180
const convertRadiansToDegree = radians => radians * 180 / Math.PI
const getSignal = value => value / Math.abs(value) | 0
const minMaxInCorners = (min, max, value) => Math.max(min, Math.min(max, value))

const getRectAngle = (initialX, initialY, finalX, finalY) => {
  return Math.atan((finalX - initialX) / (finalY - initialY))
}

const distanceBetween = (objectPosition, anotherObjectPosition) => {
  const { x: x0, y: y0 } = objectPosition
  const { x: x1, y: y1 } = anotherObjectPosition
  const deltaX = x1 - x0
  const deltaY = y1 - y0
  return Math.sqrt(deltaX ** 2 + deltaY ** 2)
}

export default {
  convertDegreeToRadians,
  convertRadiansToDegree,
  getSignal,
  distanceBetween,
  getRectAngle,
  minMaxInCorners,
}