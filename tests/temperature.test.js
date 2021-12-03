/* global test, expect */

import { convertTemperatureToRGB } from '../exo3d.mjs'

/* Used the values depicted in this stackoverflow answer :
 https://stackoverflow.com/a/13982347. The colors are given in hexadecimal, so I
 converted them to decimal, then scaled them from 0 to 1 (because that is the
 range of the convert function). */
test('Temperature gives the right color', () => {
  const expected = [
    { temp: 9500, r: 0x9d, g: 0xbe, b: 0xff },
    { temp: 7000, r: 0xe4, g: 0xee, b: 0xff },
    { temp: 5500, r: 0xff, g: 0xe4, b: 0xbe },
    { temp: 3750, r: 0xff, g: 0xa0, b: 0x4c },
    { temp: 3000, r: 0xff, g: 0x7a, b: 0x26 },
    { temp: 2700, r: 0xff, g: 0x6a, b: 0x19 },
    { temp: 2250, r: 0xff, g: 0x50, b: 0x0b },
    { temp: 1800, r: 0xff, g: 0x34, b: 0x03 },
    { temp: 1500, r: 0xff, g: 0x23, b: 0x00 }
  ]
  expected.forEach((expec) => {
    const RGB = convertTemperatureToRGB(expec.temp)
    const RED = expec.r / 0xff
    const GREEN = expec.g / 0xff
    const BLUE = expec.b / 0xff
    expect(RGB.red).toBeCloseTo(RED)
    expect(RGB.green).toBeCloseTo(GREEN)
    expect(RGB.blue).toBeCloseTo(BLUE)
  })
})
