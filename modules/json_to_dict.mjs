/**
 * Converts the JSON file into a dictionnary.
 * @param {String} jsonName - The name of the raw JSON file (minus the .json extension).
 */
function JsonToDict(originJson) {
  const OBJECTS_CATEGORY = `system`
  const HIERARCHY_CATEGORY = `hierarchy`

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

export { JsonToDict }
