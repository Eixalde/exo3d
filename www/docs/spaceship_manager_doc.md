<a name="module_SpaceshipManager"></a>

## SpaceshipManager

* [SpaceshipManager](#module_SpaceshipManager)
    * [~SpaceshipManager](#module_SpaceshipManager..SpaceshipManager)
        * [.buildSpaceship(scene, glowLayer)](#module_SpaceshipManager..SpaceshipManager+buildSpaceship)


* * *

<a name="module_SpaceshipManager..SpaceshipManager"></a>

### SpaceshipManager~SpaceshipManager
Handles everything related to the spaceship environment used in the XR mode.

**Kind**: inner class of [<code>SpaceshipManager</code>](#module_SpaceshipManager)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| shipPos | <code>BABYLON.Vector3</code> | The position of the spaceship. |
| spaceship | <code>Array.&lt;BABYLON.Mesh&gt;</code> | The meshes consisting of the spaceship (built in Blender). |


* * *

<a name="module_SpaceshipManager..SpaceshipManager+buildSpaceship"></a>

#### spaceshipManager.buildSpaceship(scene, glowLayer)
Creates and handles the spaceship for the XR session.

**Kind**: instance method of [<code>SpaceshipManager</code>](#module_SpaceshipManager..SpaceshipManager)  

| Param | Type | Description |
| --- | --- | --- |
| scene | <code>BABYLON.Scene</code> | The current scene. |
| glowLayer | <code>BABYLON.GlowLayer</code> | The glow effect applied to the star of the system. |


* * *

