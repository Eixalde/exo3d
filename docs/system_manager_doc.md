<a name="module_SystemManager"></a>

## SystemManager

Every "magic number" appearing in the parameters of the planets is actually
calculated from data on the different values of every planet (sideral day,
revolution period, distance to the sun, size...) You can find the detail of
those calculations in the [detailed documentation]().

- [SystemManager](#module_SystemManager)
  - [~GravitationalSystemManager](#module_SystemManager..GravitationalSystemManager)
    - [.initialize(scene, canvas)](#module_SystemManager..GravitationalSystemManager+initialize)
    - [.convertFromJson(objectJson, contextSystem)](#module_SystemManager..GravitationalSystemManager+convertFromJson)
    - [.addToSusbystemHierarchy(spObj, contextSubsystemHierarchy)](#module_SystemManager..GravitationalSystemManager+addToSusbystemHierarchy)

---

<a name="module_SystemManager..GravitationalSystemManager"></a>

### SystemManager~GravitationalSystemManager

The handler for any gravitational system. It instantiates every spatial
object, the cameras, the background and the light.

**Kind**: inner class of [<code>SystemManager</code>](#module_SystemManager)
**Properties**

| Name                        | Type                              | Description                                       |
| --------------------------- | --------------------------------- | ------------------------------------------------- |
| light                       | <code>BABYLON.PointLight</code>   | The light source of the planetary system.         |
| skybox                      | <code>BABYLON.PhotoDome</code>    | The skybox of the planetary system.               |
| cameras                     | <code>CameraModes</code>          | The different cameras we use to watch the system. |
| animManager                 | <code>AnimManager</code>          | The animation manager for all spatial objects.    |
| systemOptions               | <code>Object</code>               | The informations needed to generate the system.   |
| systemOptions.star          | <code>Object</code>               | Star informations.                                |
| systemOptions.planets       | <code>Array.&lt;Object&gt;</code> | Planets informations.                             |
| systemOptions.satellites    | <code>Array.&lt;Object&gt;</code> | Satellites informations.                          |
| systemOptions.rings         | <code>Array.&lt;Object&gt;</code> | Rings informations.                               |
| gravitationalSystem         | <code>Object</code>               | Contains the star and the planets of the system.  |
| gravitationalSystem.star    | <code>Star</code>                 | The star of the system.                           |
| gravitationalSystem.planets | <code>Array.&lt;Planet&gt;</code> | The list of planets of the system.                |

- [~GravitationalSystemManager](#module_SystemManager..GravitationalSystemManager)
  - [.initialize(scene, canvas)](#module_SystemManager..GravitationalSystemManager+initialize)
  - [.convertFromJson(objectJson, contextSystem)](#module_SystemManager..GravitationalSystemManager+convertFromJson)
  - [.addToSusbystemHierarchy(spObj, contextSubsystemHierarchy)](#module_SystemManager..GravitationalSystemManager+addToSusbystemHierarchy)

---

<a name="module_SystemManager..GravitationalSystemManager+initialize"></a>

#### gravitationalSystemManager.initialize(scene, canvas)

Initializes the gravitational system. Because of JSON files, we have to use
some `await` with it : thus the async function. Everything in there used to
be the constructor actually, but JSONs really messed up the whole
application. For God sake, it shouldn't be that hard to read compatible
local objects, fix JavaScript please.

**Kind**: instance method of [<code>GravitationalSystemManager</code>](#module_SystemManager..GravitationalSystemManager)

| Param  | Type                       | Description                    |
| ------ | -------------------------- | ------------------------------ |
| scene  | <code>BABYLON.Scene</code> | The current scene.             |
| canvas | <code>HTMLElement</code>   | The canvas used by the engine. |

---

<a name="module_SystemManager..GravitationalSystemManager+convertFromJson"></a>

#### gravitationalSystemManager.convertFromJson(objectJson, contextSystem)

Upon giving a context system to analyze, this function looks at every
element in that system. If that element is a spatial object, the function
calls sortSpatialObject to give it its correct place in the system (star,
planet, satellite or rings). If that element is a subsystem, the function
will instead call itself with that subsystem, until it eventually finds
only spatial objects. If there are any satellites or rings in the context
system, this means they are attached to the only planet in the same system.
Therefore, those are given a special attribute called "parent" which is the
planet in the subsystem. More information is found in the detailed
documentation.

**Kind**: instance method of [<code>GravitationalSystemManager</code>](#module_SystemManager..GravitationalSystemManager)

| Param         | Type                | Description                                                           |
| ------------- | ------------------- | --------------------------------------------------------------------- |
| objectJson    | <code>Object</code> | The object containing the information of the system in the JSON file. |
| contextSystem | <code>Object</code> | The subsystem we are currently navigating through.                    |

---

<a name="module_SystemManager..GravitationalSystemManager+addToSusbystemHierarchy"></a>

#### gravitationalSystemManager.addToSusbystemHierarchy(spObj, contextSubsystemHierarchy)

Takes a spatial object, analyzes its type (star, planet, satellite, rings)
and adds it to both its subsystem hierarchy and the systemOptions.

**Kind**: instance method of [<code>GravitationalSystemManager</code>](#module_SystemManager..GravitationalSystemManager)

| Param                     | Type                | Description                                                   |
| ------------------------- | ------------------- | ------------------------------------------------------------- |
| spObj                     | <code>Object</code> | The spatial object options to be sorted.                      |
| contextSubsystemHierarchy | <code>Object</code> | The hierarchy of the subsystem containing the spatial object. |

---
