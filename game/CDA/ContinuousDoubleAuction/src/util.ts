export function getEnumKeys<E>(e: {}): Array<string> {
  const keys: Array<string> = []
  for (const key in e) {
    if (typeof e[key] === 'number') {
      keys.push(key)
    }
  }
  return keys
}

export interface IPoint {
  x: number
  y: number
}

export function pointPair2Curve(p1: IPoint, p2: IPoint): (x: number) => number {
  const a = (-2 * (p1.y - p2.y)) / Math.pow(p1.x - p2.x, 3),
    b = -1.5 * (p1.x + p2.x) * a,
    c = 3 * p1.x * p2.x * a,
    d = p1.y - a * Math.pow(p1.x, 3) - b * Math.pow(p1.x, 2) - c * p1.x
  return (x: number) => a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d
}
