/* global test, expect */

import { SystemBuilder } from '../exo3d.mjs'

import defaultJson from '../system_json/default_objects.json'
import minValid from './jsons/minValid.json'
import minValidExpected from './jsons/minValidExpected.json'
import fullValid from './jsons/fullValid.json'

/* ----- Valid tests ----- */

/* Minimal valid system */
test('Adding default to a minimal valid system', () => {
  const sysBuild = new SystemBuilder()
    .setSystemOptions(minValid)
    .setDefaultOptions(defaultJson)

  const minDefaulted = sysBuild.getSystemOptions()

  expect(minDefaulted).toEqual(minValidExpected)
})

test('Adding default to a complete valid system', () => {
  const sysBuild = new SystemBuilder()
    .setSystemOptions(fullValid)
    .setDefaultOptions(defaultJson)

  const fullDefaulted = sysBuild.getSystemOptions()

  expect(fullDefaulted).toEqual(fullValid)
})
