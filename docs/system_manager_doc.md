<a name="module_SystemManager"></a>

## SystemManager

Every "magic number" appearing in the parameters of the planets is actually
calculated from data on the different values of every planet (sideral day,
revolution period, distance to the sun, size...) You can find the detail of
those calculations in the [detailled documentation](../docs/detailled_doc.md).

- [SystemManager](#module_SystemManager)
  - [~GravitationalSystemManager](#module_SystemManager..GravitationalSystemManager)
    - [new GravitationalSystemManager(scene, UI, canvas)](#new_module_SystemManager..GravitationalSystemManager_new)

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
| gravitationalSystem         | <code>Object</code>               | Contains the star and the planets of the system.  |
| gravitationalSystem.star    | <code>Star</code>                 | The star of the system.                           |
| gravitationalSystem.planets | <code>Array.&lt;Planet&gt;</code> | The list of planets of the system.                |

---

<a name="new_module_SystemManager..GravitationalSystemManager_new"></a>

#### new GravitationalSystemManager(scene, UI, canvas)

| Param  | Type                       | Description                                |
| ------ | -------------------------- | ------------------------------------------ |
| scene  | <code>BABYLON.Scene</code> | The current scene.                         |
| UI     | <code>BABYLON.GUI</code>   | The global Babylon UI for the application. |
| canvas | <code>HTMLElement</code>   | The canvas used by the engine.             |

---
