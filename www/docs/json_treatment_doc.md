<a name="module_JSON_Treatment"></a>

## JSON_Treatment

Contains every function or class needed to interact with JSON files/objects.

- [JSON_Treatment](#module_JSON_Treatment)
  - [~writeJsonToStorage(jsonNameFile)](#module_JSON_Treatment..writeJsonToStorage)
  - [~readJsonFromStorage()](#module_JSON_Treatment..readJsonFromStorage) ⇒ <code>Object</code>
  - [~convertJsonToDict(jsonName)](#module_JSON_Treatment..convertJsonToDict)
  - [~convertDictToSystem(objectJson, contextSystem, systemOptions)](#module_JSON_Treatment..convertDictToSystem)
  - [~addToSusbystemHierarchy(spObj, contextSubsystemHierarchy, systemOptions)](#module_JSON_Treatment..addToSusbystemHierarchy)

---

<a name="module_JSON_Treatment..writeJsonToStorage"></a>

### JSON_Treatment~writeJsonToStorage(jsonNameFile)

Stores whatever JSON was chosen by the user. This JSON can be created based
on their inputs in the form or fetched from the repository if they chose a
pre-existing exosystem JSON.

**Kind**: inner method of [<code>JSON_Treatment</code>](#module_JSON_Treatment)

| Param        | Type                | Description                                |
| ------------ | ------------------- | ------------------------------------------ |
| jsonNameFile | <code>String</code> | The name of a JSON file that may be passed |

---

<a name="module_JSON_Treatment..readJsonFromStorage"></a>

### JSON_Treatment~readJsonFromStorage() ⇒ <code>Object</code>

Reads the JSON that was stored upon completing the system generation form.

**Kind**: inner method of [<code>JSON_Treatment</code>](#module_JSON_Treatment)
**Returns**: <code>Object</code> - The JSON passed by the generation form.

---

<a name="module_JSON_Treatment..convertJsonToDict"></a>

### JSON_Treatment~convertJsonToDict(jsonName)

Converts the JSON file into a dictionnary.

**Kind**: inner method of [<code>JSON_Treatment</code>](#module_JSON_Treatment)

| Param    | Type                | Description                                                |
| -------- | ------------------- | ---------------------------------------------------------- |
| jsonName | <code>String</code> | The name of the raw JSON file (minus the .json extension). |

---

<a name="module_JSON_Treatment..convertDictToSystem"></a>

### JSON_Treatment~convertDictToSystem(objectJson, contextSystem, systemOptions)

Looks at every element in a context system. If that element is a spatial
object, the function calls addToSubsystemHierarchy to give it its correct
place in the system (star, planet, satellite or rings). If that element is a
subsystem, the function will instead call itself with that subsystem, until
it eventually finds only spatial objects. If there are any satellites or
rings in the context system, this means they are attached to the only planet
in the same system. Therefore, those are given a special attribute called
"parent" which is the planet in the subsystem. More information is found in
the detailed documentation.

**Kind**: inner method of [<code>JSON_Treatment</code>](#module_JSON_Treatment)

| Param         | Type                | Description                                                           |
| ------------- | ------------------- | --------------------------------------------------------------------- |
| objectJson    | <code>Object</code> | The object containing the information of the system in the JSON file. |
| contextSystem | <code>Object</code> | The subsystem we are currently navigating through.                    |
| systemOptions | <code>Object</code> | The parameters needed for the creation of a system.                   |

---

<a name="module_JSON_Treatment..addToSusbystemHierarchy"></a>

### JSON_Treatment~addToSusbystemHierarchy(spObj, contextSubsystemHierarchy, systemOptions)

Takes a spatial object, analyzes its type (star, planet, satellite, rings)
and adds it to both its subsystem hierarchy and the systemOptions.

**Kind**: inner method of [<code>JSON_Treatment</code>](#module_JSON_Treatment)

| Param                     | Type                | Description                                                   |
| ------------------------- | ------------------- | ------------------------------------------------------------- |
| spObj                     | <code>Object</code> | The spatial object options to be sorted.                      |
| contextSubsystemHierarchy | <code>Object</code> | The hierarchy of the subsystem containing the spatial object. |
| systemOptions             | <code>Object</code> | The parameters needed for the creation of a system.           |

---
