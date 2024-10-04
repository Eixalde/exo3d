/**
 * @module Constants
 * @description Every constants shared by multiple modules.
 */

/* For exact scale purposes, ASTRONOMICAL_UNIT is equal to the ratio between 1
AU and the diameter of the Earth. This way, the size of the Earth can be set to
1 unit of the Babylon engine. */
const ASTRONOMICAL_UNIT = 11727.647
const EARTH_SIZE = 12742

const EXO_TYPES = {
  star: 'star',
  planet: 'planet',
  satellite: 'satellite',
  rings: 'rings'
}

const SYSTEM_FILE_NAMES = ['solar_system.json', 'exosystem_one.json']

/* Default position of the spaceship for the XR Session. Cannot be a
BABYLON.Vector3 because BABYLON is not recognized here. Also those are ad hoc
values. DO NOT GIVE DOUBLE VALUES TO THIS. EVER. */
const SPACESHIP_POSITION = {
  x: 0,
  y: 5000,
  z: -8000
}

export { ASTRONOMICAL_UNIT, EXO_TYPES, SYSTEM_FILE_NAMES, SPACESHIP_POSITION, EARTH_SIZE }
