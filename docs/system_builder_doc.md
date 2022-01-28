<a name="module_SystemBuilder"></a>

## SystemBuilder

A design pattern of a builder, it generates the Spatial Objects contained in the system.

- [SystemBuilder](#module_SystemBuilder)
  - [~SystemBuilder](#module_SystemBuilder..SystemBuilder)
    - [.setScene(scene)](#module_SystemBuilder..SystemBuilder+setScene) ⇒ <code>SystemBuilder</code>
    - [.setConstants(astroUnit, exoTypes)](#module_SystemBuilder..SystemBuilder+setConstants) ⇒ <code>SystemBuilder</code>
    - [.setDefaultOptions(defaultOptions)](#module_SystemBuilder..SystemBuilder+setDefaultOptions) ⇒ <code>SystemBuilder</code>
    - [.setSystemOptions(systemOptions)](#module_SystemBuilder..SystemBuilder+setSystemOptions) ⇒ <code>SystemBuilder</code>
    - [.getSystemOptions()](#module_SystemBuilder..SystemBuilder+getSystemOptions) ⇒ <code>Object</code>
    - [.normalizeParameters(simulationTime)](#module_SystemBuilder..SystemBuilder+normalizeParameters) ⇒ <code>SystemBuilder</code>
    - [.setSystemCenter(systemCenter)](#module_SystemBuilder..SystemBuilder+setSystemCenter) ⇒ <code>SystemBuilder</code>
    - [.setAnimatable(animatable)](#module_SystemBuilder..SystemBuilder+setAnimatable) ⇒ <code>SystemBuilder</code>
    - [.setParentToObject(spObj, planetList)](#module_SystemBuilder..SystemBuilder+setParentToObject)

---

<a name="module_SystemBuilder..SystemBuilder"></a>

### SystemBuilder~SystemBuilder

Builds a system with a star, several planets and - if existing - their rings
and satellites.

**Kind**: inner class of [<code>SystemBuilder</code>](#module_SystemBuilder)

- [~SystemBuilder](#module_SystemBuilder..SystemBuilder)
  - [.setScene(scene)](#module_SystemBuilder..SystemBuilder+setScene) ⇒ <code>SystemBuilder</code>
  - [.setConstants(astroUnit, exoTypes)](#module_SystemBuilder..SystemBuilder+setConstants) ⇒ <code>SystemBuilder</code>
  - [.setDefaultOptions(defaultOptions)](#module_SystemBuilder..SystemBuilder+setDefaultOptions) ⇒ <code>SystemBuilder</code>
  - [.setSystemOptions(systemOptions)](#module_SystemBuilder..SystemBuilder+setSystemOptions) ⇒ <code>SystemBuilder</code>
  - [.getSystemOptions()](#module_SystemBuilder..SystemBuilder+getSystemOptions) ⇒ <code>Object</code>
  - [.normalizeParameters(simulationTime)](#module_SystemBuilder..SystemBuilder+normalizeParameters) ⇒ <code>SystemBuilder</code>
  - [.setSystemCenter(systemCenter)](#module_SystemBuilder..SystemBuilder+setSystemCenter) ⇒ <code>SystemBuilder</code>
  - [.setAnimatable(animatable)](#module_SystemBuilder..SystemBuilder+setAnimatable) ⇒ <code>SystemBuilder</code>
  - [.setParentToObject(spObj, planetList)](#module_SystemBuilder..SystemBuilder+setParentToObject)

---

<a name="module_SystemBuilder..SystemBuilder+setScene"></a>

#### systemBuilder.setScene(scene) ⇒ <code>SystemBuilder</code>

**Kind**: instance method of [<code>SystemBuilder</code>](#module_SystemBuilder..SystemBuilder)

| Param | Type                       | Description        |
| ----- | -------------------------- | ------------------ |
| scene | <code>BABYLON.Scene</code> | The current scene. |

---

<a name="module_SystemBuilder..SystemBuilder+setConstants"></a>

#### systemBuilder.setConstants(astroUnit, exoTypes) ⇒ <code>SystemBuilder</code>

**Kind**: instance method of [<code>SystemBuilder</code>](#module_SystemBuilder..SystemBuilder)

| Param     | Type                              | Description                                            |
| --------- | --------------------------------- | ------------------------------------------------------ |
| astroUnit | <code>Number</code>               | The value of the astronomical unit (in Babylon units). |
| exoTypes  | <code>Array.&lt;String&gt;</code> | The name of every type of exo-object.                  |

---

<a name="module_SystemBuilder..SystemBuilder+setDefaultOptions"></a>

#### systemBuilder.setDefaultOptions(defaultOptions) ⇒ <code>SystemBuilder</code>

**Kind**: instance method of [<code>SystemBuilder</code>](#module_SystemBuilder..SystemBuilder)

| Param          | Type                |
| -------------- | ------------------- |
| defaultOptions | <code>Object</code> |

---

<a name="module_SystemBuilder..SystemBuilder+setSystemOptions"></a>

#### systemBuilder.setSystemOptions(systemOptions) ⇒ <code>SystemBuilder</code>

**Kind**: instance method of [<code>SystemBuilder</code>](#module_SystemBuilder..SystemBuilder)

| Param         | Type                | Description                                     |
| ------------- | ------------------- | ----------------------------------------------- |
| systemOptions | <code>Object</code> | Parameters needed for the creation of a system. |

---

<a name="module_SystemBuilder..SystemBuilder+getSystemOptions"></a>

#### systemBuilder.getSystemOptions() ⇒ <code>Object</code>

**Kind**: instance method of [<code>SystemBuilder</code>](#module_SystemBuilder..SystemBuilder)
**Returns**: <code>Object</code> - - Returns the internal system options.

---

<a name="module_SystemBuilder..SystemBuilder+normalizeParameters"></a>

#### systemBuilder.normalizeParameters(simulationTime) ⇒ <code>SystemBuilder</code>

**Kind**: instance method of [<code>SystemBuilder</code>](#module_SystemBuilder..SystemBuilder)

| Param          | Type                | Description                                    |
| -------------- | ------------------- | ---------------------------------------------- |
| simulationTime | <code>Number</code> | The time needed for a given planet to revolve. |

---

<a name="module_SystemBuilder..SystemBuilder+setSystemCenter"></a>

#### systemBuilder.setSystemCenter(systemCenter) ⇒ <code>SystemBuilder</code>

**Kind**: instance method of [<code>SystemBuilder</code>](#module_SystemBuilder..SystemBuilder)

| Param        | Type                         | Description                                             |
| ------------ | ---------------------------- | ------------------------------------------------------- |
| systemCenter | <code>BABYLON.Vector3</code> | The position of reference for the center of the system. |

---

<a name="module_SystemBuilder..SystemBuilder+setAnimatable"></a>

#### systemBuilder.setAnimatable(animatable) ⇒ <code>SystemBuilder</code>

**Kind**: instance method of [<code>SystemBuilder</code>](#module_SystemBuilder..SystemBuilder)

| Param      | Type                                          | Description                               |
| ---------- | --------------------------------------------- | ----------------------------------------- |
| animatable | <code>Array.&lt;BABYLON.Animatable&gt;</code> | Contains every animation of every object. |

---

<a name="module_SystemBuilder..SystemBuilder+setParentToObject"></a>

#### systemBuilder.setParentToObject(spObj, planetList)

**Kind**: instance method of [<code>SystemBuilder</code>](#module_SystemBuilder..SystemBuilder)

| Param      | Type                              | Description                           |
| ---------- | --------------------------------- | ------------------------------------- |
| spObj      | <code>SpatialObject</code>        | A spatial object that needs a parent. |
| planetList | <code>Array.&lt;Planet&gt;</code> | A list of the planets in the system.  |

---
