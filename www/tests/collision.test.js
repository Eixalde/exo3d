/* global test, expect */

import {
  compareOrbits,
  EllipticalTrajectory,
  compareSystemOrbits
} from '../exo3d.mjs'

test('Check max size allowed to avoid collision\nbetween planets', () => {
  const compareParameters = {
    currentObjTraj: new EllipticalTrajectory({ a: 10, e: 0 }),
    neighbourObjTraj: new EllipticalTrajectory({ a: 15, e: 0.1 }),
    currentObjDiameter: 1,
    neighbourObjDiameter: 1
  }

  expect(compareOrbits(compareParameters)).toBeCloseTo(3.5)
})

test('Find minimum size allowed for an entire system', () => {
  // Miscellaneous system with equal-sized planets
  const systemCompareParameters = [
    {
      currentObjTraj: new EllipticalTrajectory({ a: 10, e: 0 }),
      neighbourObjTraj: new EllipticalTrajectory({ a: 17, e: 0 }),
      currentObjDiameter: 1,
      neighbourObjDiameter: 1
    },
    {
      currentObjTraj: new EllipticalTrajectory({ a: 17, e: 0 }),
      neighbourObjTraj: new EllipticalTrajectory({ a: 25, e: 0.1 }),
      currentObjDiameter: 1,
      neighbourObjDiameter: 1
    },
    {
      currentObjTraj: new EllipticalTrajectory({ a: 25, e: 0.1 }),
      neighbourObjTraj: new EllipticalTrajectory({ a: 37, e: 0 }),
      currentObjDiameter: 1,
      neighbourObjDiameter: 1
    }
  ]

  expect(compareSystemOrbits(systemCompareParameters)).toBeCloseTo(5.5)

  // Misc system with different-sized planets
  const otherSystemCompareParameters = [
    {
      currentObjTraj: new EllipticalTrajectory({ a: 10, e: 0 }),
      neighbourObjTraj: new EllipticalTrajectory({ a: 17, e: 0 }),
      currentObjDiameter: 1,
      neighbourObjDiameter: 3
    },
    {
      currentObjTraj: new EllipticalTrajectory({ a: 17, e: 0 }),
      neighbourObjTraj: new EllipticalTrajectory({ a: 25, e: 0 }),
      currentObjDiameter: 3,
      neighbourObjDiameter: 2.5
    },
    {
      currentObjTraj: new EllipticalTrajectory({ a: 25, e: 0 }),
      neighbourObjTraj: new EllipticalTrajectory({ a: 37, e: 0 }),
      currentObjDiameter: 2.5,
      neighbourObjDiameter: 2
    }
  ]

  expect(compareSystemOrbits(otherSystemCompareParameters)).toBeCloseTo(32 / 11)

  // Single-planet system
  const singlePlanetCompareParameters = [
    {
      currentObjTraj: new EllipticalTrajectory({ a: 10, e: 0 }),
      neighbourObjTraj: undefined,
      currentObjDiameter: 1,
      neighbourObjDiameter: 0
    }
  ]

  // Should fail
  expect(() => {
    compareSystemOrbits(singlePlanetCompareParameters)
  }).toThrow(TypeError)
})
