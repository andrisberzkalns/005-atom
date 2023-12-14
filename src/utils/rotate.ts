export function rotate(
  cx: number,
  cy: number,
  x: number,
  y: number,
  angle: number,
): [number, number] {
  var radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cos * (x - cx) + sin * (y - cy) + cx,
    ny = cos * (y - cy) - sin * (x - cx) + cy;
  return [nx, ny];
}

export default rotate;
