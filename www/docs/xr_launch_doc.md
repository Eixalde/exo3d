<a name="module_XRLauncher"></a>

## XRLauncher

* [XRLauncher](#module_XRLauncher)
    * [~XRLauncher](#module_XRLauncher..XRLauncher)
        * [new XRLauncher(engineManager)](#new_module_XRLauncher..XRLauncher_new)
        * [.initialize(scene)](#module_XRLauncher..XRLauncher+initialize)
        * [.onEnteringXR(scene, xr)](#module_XRLauncher..XRLauncher+onEnteringXR)
        * [.onLeavingXR(scene)](#module_XRLauncher..XRLauncher+onLeavingXR)


* * *

<a name="module_XRLauncher..XRLauncher"></a>

### XRLauncher~XRLauncher
Manages the launch of the XR-mode.

**Kind**: inner class of [<code>XRLauncher</code>](#module_XRLauncher)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| ground | <code>BABYLON.GroundMesh</code> | The platform where the user stands on. |
| xrHandler | <code>BABYLON.WebXRDefaultExperience</code> | The XR experience handler for the application. |
| xrCamPos | <code>BABYLON.Vector3</code> | The default position to set for the XR Camera. |
| xrCamRot | <code>BABYLON.Vector3</code> | The default rotation to set for the XR Camera. |
| engineManager | <code>EngineManager</code> | The engine manager used for the application. |


* [~XRLauncher](#module_XRLauncher..XRLauncher)
    * [new XRLauncher(engineManager)](#new_module_XRLauncher..XRLauncher_new)
    * [.initialize(scene)](#module_XRLauncher..XRLauncher+initialize)
    * [.onEnteringXR(scene, xr)](#module_XRLauncher..XRLauncher+onEnteringXR)
    * [.onLeavingXR(scene)](#module_XRLauncher..XRLauncher+onLeavingXR)


* * *

<a name="new_module_XRLauncher..XRLauncher_new"></a>

#### new XRLauncher(engineManager)

| Param | Type | Description |
| --- | --- | --- |
| engineManager | <code>EngineManager</code> | The engine manager created in the main module. |


* * *

<a name="module_XRLauncher..XRLauncher+initialize"></a>

#### xrLauncher.initialize(scene)
Start up a basic XR configuration on a platform, far above the star.

**Kind**: instance method of [<code>XRLauncher</code>](#module_XRLauncher..XRLauncher)  

| Param | Type | Description |
| --- | --- | --- |
| scene | <code>BABYLON.Scene</code> | The current scene. |


* * *

<a name="module_XRLauncher..XRLauncher+onEnteringXR"></a>

#### xrLauncher.onEnteringXR(scene, xr)
Set various actions each time the XR session is enabled.

**Kind**: instance method of [<code>XRLauncher</code>](#module_XRLauncher..XRLauncher)  

| Param | Type | Description |
| --- | --- | --- |
| scene | <code>BABYLON.Scene</code> | The current scene. |
| xr | <code>BABYLON.WebXRDefaultExperience</code> | The XR experience handler for the application. |


* * *

<a name="module_XRLauncher..XRLauncher+onLeavingXR"></a>

#### xrLauncher.onLeavingXR(scene)
Set various actions each time the XR session has ended.

**Kind**: instance method of [<code>XRLauncher</code>](#module_XRLauncher..XRLauncher)  

| Param | Type | Description |
| --- | --- | --- |
| scene | <code>BABYLON.Scene</code> | The current scene. |


* * *

