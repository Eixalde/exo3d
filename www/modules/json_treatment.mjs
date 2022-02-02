/**
 * @module JSON_Treatment
 * @description Contains every function or class needed to interact with JSON files/objects.
 */

import { EXO_TYPES } from '../exo3d.mjs'

/**
 * Stores whatever JSON was chosen by the user. This JSON can be created based
 * on their inputs in the form or fetched from the repository if they chose a
 * pre-existing exosystem JSON.
 * @param {String} jsonName - The name of a JSON file that may be passed
 */
async function writeJsonToStorage(jsonName = 'solar_system.json') {
  let exo3dSystemJson = undefined

  /* NOTE : at the moment, we only consider pre-existing JSONs, but in the near
  future the form will allow the users to give the informations by themselves.
  The exo3dSystemJson will contain any input given in the form, and if it doesn't
  have one then the pre-existing systems are used instead. */
  if (exo3dSystemJson) {
    // Nothing until a future update
  } else {
    exo3dSystemJson = await fetch(`../system_json/${jsonName}`).then(
      (response) => response.json()
    )
  }

  sessionStorage.setItem('exo3dSystemJson', JSON.stringify(exo3dSystemJson))
}

/**
 * Reads the JSON that was stored upon completing the system generation form.
 * @returns {Object} The JSON passed by the generation form.
 */
function readJsonFromStorage() {
  const exo3dSystemJson = JSON.parse(sessionStorage.getItem('exo3dSystemJson'))
  return exo3dSystemJson
}

/**
 * Converts the JSON file into a dictionnary.
 * @param {String} jsonName - The name of the raw JSON file (minus the .json extension).
 */
function convertJsonToDict(originJson) {
  const OBJECTS_CATEGORY = 'system'
  const HIERARCHY_CATEGORY = 'hierarchy'

  const dictionnaryJson = {}

  /* The JSON file must include the two categories mentioned. If either is
  missing, we throw an error. */
  for (const CATEGORY of [OBJECTS_CATEGORY, HIERARCHY_CATEGORY]) {
    if (!(CATEGORY in originJson)) {
      throw `Category ${CATEGORY} is missing in the JSON file !`
    }
  }

  /* Both `system` and `hierarchy` have their contents formatted in lists. We
    will instead make each element of the list an attribute of the category they
    belong to. */
  for (const [attributeName, list] of Object.entries(originJson)) {
    dictionnaryJson[attributeName] = {}
    switch (attributeName) {
      case OBJECTS_CATEGORY:
        list.forEach((listNode) => {
          /* In the case of the spatial objects, the attribute that should reference them
            is their name. */
          const objName = listNode.name
          dictionnaryJson[attributeName][objName] = listNode
        })
        break

      case HIERARCHY_CATEGORY:
        list.forEach((listNode) => {
          /* For the subsystems in the hierarchy, we take the name of the attribute which
            contains the subsystem (often named "sg1", "sg2", "sg3", etc). */
          const sysName = Object.keys(listNode)[0]
          dictionnaryJson[attributeName][sysName] = Object.values(listNode)[0]
        })
        break

      default:
        throw `Category ${attributeName} is invalid !`
    }
  }
  return dictionnaryJson
}

/**
 * Looks at every element in a context system. If that element is a spatial
 * object, the function calls addToSubsystemHierarchy to give it its correct
 * place in the system (star, planet, satellite or rings). If that element is a
 * subsystem, the function will instead call itself with that subsystem, until
 * it eventually finds only spatial objects. If there are any satellites or
 * rings in the context system, this means they are attached to the only planet
 * in the same system. Therefore, those are given a special attribute called
 * "parent" which is the planet in the subsystem. More information is found in
 * the detailed documentation.
 * @param {Object} objectJson - The object containing the information of the system in the JSON file.
 * @param {Object} contextSystem - The subsystem we are currently navigating through.
 * @param {Object} systemOptions - The parameters needed for the creation of a system.
 */
function convertDictToSystem(objectJson, contextSystem, systemOptions) {
  /* Creating a local object to classify spatial objects in the subsystem.
  This is what associates satellites/rings with their planet. */
  const hierarchy = {}
  for (const exotype in EXO_TYPES) {
    hierarchy[exotype] = []
  }

  console.log(systemOptions)

  /* This is the algorithm of search through the objectJson, which is divided in
  two parts : `system` and `hierarchy`. The first one contains raw informations
  on all spatial objects, and the second one specifies the interactions between
  them (eventually creating multiple subsystems). If the element listed in the
  subsystem is found in `system`, then it is a spatial object : the
  addToSubsystemHierarchy is called. Otherwise, the element is in `hierarchy`,
  so convertDictToSystem calls itself on that element. */
  for (const systemElement of Object.values(contextSystem)) {
    if (systemElement in objectJson.system) {
      const spObj = objectJson.system[systemElement]
      addToSusbystemHierarchy(spObj, hierarchy, systemOptions)
    } else {
      const internSubsystem = objectJson.hierarchy[systemElement]
      convertDictToSystem(objectJson, internSubsystem, systemOptions)
    }
  }

  /* If there is any satellite or rings, associate them with the only planet
  of the subsystem. */
  if (hierarchy[EXO_TYPES.satellite].length > 0) {
    hierarchy[EXO_TYPES.satellite].forEach(
      (satellite) =>
        (satellite.parentName = hierarchy[EXO_TYPES.planet][0].name)
    )
  }

  if (hierarchy[EXO_TYPES.rings].length > 0) {
    hierarchy[EXO_TYPES.rings].forEach(
      (ring) => (ring.parentName = hierarchy[EXO_TYPES.planet][0].name)
    )
  }
}

/**
 * Takes a spatial object, analyzes its type (star, planet, satellite, rings)
 * and adds it to both its subsystem hierarchy and the systemOptions.
 * @param {Object} spObj - The spatial object options to be sorted.
 * @param {Object} contextSubsystemHierarchy - The hierarchy of the subsystem containing the spatial object.
 * @param {Object} systemOptions - The parameters needed for the creation of a system.
 */
function addToSusbystemHierarchy(
  spObj,
  contextSubsystemHierarchy,
  systemOptions
) {
  contextSubsystemHierarchy[spObj.exo_type].push(spObj)
  systemOptions[spObj.exo_type].push(spObj)
}

export {
  convertJsonToDict,
  writeJsonToStorage,
  readJsonFromStorage,
  convertDictToSystem
}
