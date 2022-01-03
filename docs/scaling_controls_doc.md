<a name="module_ScalingControls"></a>

## ScalingControls

* [ScalingControls](#module_ScalingControls)
    * [~ScalingControls](#module_ScalingControls..ScalingControls)
        * [new ScalingControls(planets, star, cameras, scene)](#new_module_ScalingControls..ScalingControls_new)


* * *

<a name="module_ScalingControls..ScalingControls"></a>

### ScalingControls~ScalingControls
Provides an asymetric scaling for all objects in the system, making the
planets bigger (still at scale with each other) and then applying a different
scaling to the star. This allows to see effectively all planets from a large
perspective. Most of this class consists of the transition for all scaled
objects, so they can grow/shrink gradually.

**Kind**: inner class of [<code>ScalingControls</code>](#module_ScalingControls)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| systemCompareParameters | <code>Array.&lt;SpatialObjectParams&gt;</code> | The set of parameters needed for every comparison between planets. |


* * *

<a name="new_module_ScalingControls..ScalingControls_new"></a>

#### new ScalingControls(planets, star, cameras, scene)

| Param | Type | Description |
| --- | --- | --- |
| planets | <code>Array.&lt;Planet&gt;</code> | The set of all planets in the system. |
| star | <code>Star</code> | The star of the system. |
| cameras | <code>Array.&lt;BABYLON.Camera&gt;</code> | Some of the cameras used in the scene. |
| scene | <code>BABYLON.Scene</code> | The current scene. |


* * *
