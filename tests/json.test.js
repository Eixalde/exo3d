/* global test, expect */

import { JsonToDict } from '../exo3d.mjs'

/* ----- Valid tests ----- */

/* Empty categories */
test('Conversion on empty categories (should pass)', () => {
  const emptyJson = `{
    "system":[],
    "hierarchy":[]
  }`

  const emptyObject = JSON.parse(emptyJson)
  const emptyExpected = {
    system: {},
    hierarchy: {}
  }

  expect(JsonToDict(emptyObject)).toEqual(emptyExpected)
})

/* Minimal valid system */
test('Conversion on minimal valid system (should pass)', () => {
  const minValidJson = `{
    "system":[
        {
          "name": "a",
          "exo_type": "planet"
        },
        {
          "name": "b",
          "exo_type": "planet"
        },
        {
          "name": "s",
          "exo_type": "star"
        }
      ],
      "hierarchy":[
        {
          "gs1": [
            "a",
            "b",
            "s"
          ]
        }
      ]
    }`

  const minValidObject = JSON.parse(minValidJson)

  const minValidExpected = {
    system: {
      a: {
        name: 'a',
        exo_type: 'planet'
      },
      b: {
        name: 'b',
        exo_type: 'planet'
      },
      s: {
        name: 's',
        exo_type: 'star'
      }
    },
    hierarchy: {
      gs1: ['a', 'b', 's']
    }
  }

  expect(JsonToDict(minValidObject)).toEqual(minValidExpected)
})

/* Full valid system */
test('Conversion on full valid system (should pass)', () => {
  const fullValidJson = `{
    "system":[
      {
        "name": "a",
        "exo_type": "planet"
      },
      {
        "name": "aa1",
        "exo_type": "satellite"
      },
      {
        "name": "aa2",
        "exo_type": "satellite"
      },
      {
        "name": "b",
        "exo_type": "planet"
      },
      {
        "name": "bb",
        "exo_type": "ring"
      },
      {
        "name": "s",
        "exo_type": "star"
      }
    ],
    "hierarchy":[
      {
        "gs1": [
          "a",
          "aa1",
          "aa2"
        ]
      },
      {
        "gs2": [
          "b",
          "bb"
        ]
      },
      { "gs3": [
          "gs1",
          "gs2",
          "s"
        ]
      }
    ]
  }`

  const fullValidObject = JSON.parse(fullValidJson)
  const fullValidExpected = {
    system: {
      a: {
        name: 'a',
        exo_type: 'planet'
      },
      aa1: {
        name: 'aa1',
        exo_type: 'satellite'
      },
      aa2: {
        name: 'aa2',
        exo_type: 'satellite'
      },
      b: {
        name: 'b',
        exo_type: 'planet'
      },
      bb: {
        name: 'bb',
        exo_type: 'ring'
      },
      s: {
        name: 's',
        exo_type: 'star'
      }
    },
    hierarchy: {
      gs1: ['a', 'aa1', 'aa2'],
      gs2: ['b', 'bb'],
      gs3: ['gs1', 'gs2', 's']
    }
  }
  expect(JsonToDict(fullValidObject)).toEqual(fullValidExpected)
})

/* ----- End of valid tests ----- */

/* ----- Non-valid tests (missing categories) ----- */

test('Conversion on JSON with missing categories (should throw "missing category" error)', () => {
  /* Empty JSON */
  const nullJson = '{}'

  const nullObject = JSON.parse(nullJson)
  expect(() => {
    JsonToDict(nullObject)
  }).toThrow('Category system is missing in the JSON file !')

  const noSystemJson = `{
    "hierarchy":[]
  }`

  /* No system provided */
  const noSystemObject = JSON.parse(noSystemJson)
  expect(() => {
    JsonToDict(noSystemObject)
  }).toThrow('Category system is missing in the JSON file !')

  /* No hierarchy provided */
  const noHierarchyJson = `{
    "system":[]
  }`

  const noHierarchyObject = JSON.parse(noHierarchyJson)
  expect(() => {
    JsonToDict(noHierarchyObject)
  }).toThrow('Category hierarchy is missing in the JSON file !')
})

/* ----- End of non-valid tests (missing categories) ----- */

/* ----- Non-valid tests (wrong category) ----- */

test('Conversion on JSON with wrong category (should throw "invalid category" error)', () => {
  const wrongCategoryJson = `{
    "system":[],
    "hierarchy":[],
    "wrong":"blablabla"
  }`

  const wrongCategoryObject = JSON.parse(wrongCategoryJson)
  expect(() => {
    JsonToDict(wrongCategoryObject)
  }).toThrow('Category wrong is invalid !')
})

/* ----- End of non-valid tests (wrong category) ----- */
