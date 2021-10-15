/* global test, expect */
import { EllipticalTrajectory } from '../modules/trajectory.mjs'

const PI = Math.PI

test('Star as center of the ellipse', () => {
  const a = 2
  const b = 1
  const traj = new EllipticalTrajectory({ a: a, b: b })

  const expPos = [
    { nu: 0, expX: 2 + Math.sqrt(3), expY: 0 },
    { nu: Math.atan(Math.sqrt(3) / 3), expX: Math.sqrt(3), expY: 1 },
    { nu: PI, expX: Math.sqrt(3) - 2, expY: 0 }
  ]

  for (const { nu, expX, expY } of expPos) {
    const pos = traj.posInNu(nu)
    expect(pos.x).toBeCloseTo(expX)
    expect(pos.y).toBeCloseTo(expY)
  }
})
