/* global test, expect */
import { sum, sub } from '../modules/dummy.mjs'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})

test('substracts 3 - 1 to equal 2', () => {
  expect(sub(3, 1)).toBe(2)
})
