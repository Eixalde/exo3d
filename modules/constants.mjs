/**
 * @module Constants
 * @description Every constants shared by multiple modules.
 */

/* For exact scale purposes, ASTRONOMICAL_UNIT is equal to the ratio between 1
AU and the diameter of the Earth. This way, the size of the Earth can be set to
1 unit of the Babylon engine. */
const ASTRONOMICAL_UNIT = 11727.647

const EXO_TYPES = {
  star: 'star',
  planet: 'planet',
  satellite: 'satellite',
  rings: 'rings'
}

export { ASTRONOMICAL_UNIT, EXO_TYPES }
