import { pointPair2Curve } from '../src/util'

describe('Util', () => {
  it('pointPair2Curve', () => {
    const p1 = {
        x: Math.random() * 100,
        y: Math.random()
      },
      p2 = {
        x: Math.random() * 100,
        y: Math.random()
      }
    const curve = pointPair2Curve(p1, p2)
    expect(curve(p1.x)).toBeCloseTo(p1.y)
    expect(curve(p2.x)).toBeCloseTo(p2.y)
  })
})
