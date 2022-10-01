/* global test, expect */

import { colorInhabitable } from '../exo3d.mjs'

/* Used the values depicted in this stackoverflow answer :
https://stackoverflow.com/a/13982347. The colors are given in hexadecimal, so I
converted them to decimal, then scaled them from 0 to 1 (because that is the
 range of the convert function). */
test('Planets are highlighted correctly', () => {
  const expected = [
    { a: 1, e: 0.01, r: 0, g: 1 },
    { a: 3, e: 0.04, r: 1, g: 0 },
    { a: 1.75, e: 0.04, r: 0, g: 1 },
    { a: 1.5, e: 0.8, r: 0.5, g: 0.5 },
    { a: 3, e: 0.8, r: 0.5, g: 0.5 }
  ]

  const innerRadius = 0.95
  const outerRadius = 2

  expected.forEach((expec) => {
    const RGB = colorInhabitable(expec.a, expec.e, innerRadius, outerRadius)
    expect(RGB.red).toBeCloseTo(expec.r)
    expect(RGB.green).toBeCloseTo(expec.g)
  })
})

test('Inhabitables sphere radiuses are correct', () => {})
