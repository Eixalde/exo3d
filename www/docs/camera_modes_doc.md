<a name="module_CameraModes"></a>

## CameraModes

* [CameraModes](#module_CameraModes)
    * [~CameraModes](#module_CameraModes..CameraModes)
        * [new CameraModes(scene, star, planets, canvas, skyboxSize)](#new_module_CameraModes..CameraModes_new)
        * [.changeCameraMode(toCamera, scene, allCameras, canvas)](#module_CameraModes..CameraModes+changeCameraMode)
        * [.changeCameraToNearbyPlanet(btnLabel, planetCamLabels, planets)](#module_CameraModes..CameraModes+changeCameraToNearbyPlanet)


* * *

<a name="module_CameraModes..CameraModes"></a>

### CameraModes~CameraModes
Manages all cameras and views for the user.

**Kind**: inner class of [<code>CameraModes</code>](#module_CameraModes)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| starCamera | <code>BABYLON.ArcRotateCamera</code> | A camera focused on the center of the system (the star, mostly). |
| planetCamera | <code>BABYLON.ArcRotateCamera</code> | A camera focused on the planet. |
| freeCamera | <code>BABYLON.UniversalCamera</code> | A camera controlled by the user, can move anywhere in the system. |
| cameraFarSight | <code>Number</code> | The distance the camera needs to see up to. |


* [~CameraModes](#module_CameraModes..CameraModes)
    * [new CameraModes(scene, star, planets, canvas, skyboxSize)](#new_module_CameraModes..CameraModes_new)
    * [.changeCameraMode(toCamera, scene, allCameras, canvas)](#module_CameraModes..CameraModes+changeCameraMode)
    * [.changeCameraToNearbyPlanet(btnLabel, planetCamLabels, planets)](#module_CameraModes..CameraModes+changeCameraToNearbyPlanet)


* * *

<a name="new_module_CameraModes..CameraModes_new"></a>

#### new CameraModes(scene, star, planets, canvas, skyboxSize)

| Param | Type | Description |
| --- | --- | --- |
| scene | <code>BABYLON.Scene</code> | The current scene. |
| star | <code>Star</code> | The star of the system observed. |
| planets | <code>Array.&lt;Planet&gt;</code> | The group of planets we want to look at. |
| canvas | <code>HTMLElement</code> | The current canvas. |
| skyboxSize | <code>Number</code> | The size of the skybox in the scene. |


* * *

<a name="module_CameraModes..CameraModes+changeCameraMode"></a>

#### cameraModes.changeCameraMode(toCamera, scene, allCameras, canvas)
Switches the view between the system, any planet of a free view.

**Kind**: instance method of [<code>CameraModes</code>](#module_CameraModes..CameraModes)  

| Param | Type | Description |
| --- | --- | --- |
| toCamera | <code>BABYLON.Camera</code> | The camera we want to switch to. |
| scene | <code>BABYLON.Scene</code> | The current scene. |
| allCameras | <code>Array.&lt;BABYLON.Camera&gt;</code> | All the cameras in the scene. |
| canvas | <code>HTMLElement</code> | The canvas of the page. |


* * *

<a name="module_CameraModes..CameraModes+changeCameraToNearbyPlanet"></a>

#### cameraModes.changeCameraToNearbyPlanet(btnLabel, planetCamLabels, planets)
Changes the focus of the planet camera, switching to any planet selected by
the user.

**Kind**: instance method of [<code>CameraModes</code>](#module_CameraModes..CameraModes)  

| Param | Type | Description |
| --- | --- | --- |
| btnLabel | <code>String</code> | The name of the button. |
| planetCamLabels | <code>Array.&lt;String&gt;</code> | The name of all buttons related to planet camera. |
| planets | <code>Array.&lt;Planet&gt;</code> | All the planets of the system. |


* * *

