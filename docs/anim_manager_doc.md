<a name="module_AnimManager"></a>

## AnimManager
About the speed management : there used to be only the global
speed ratio to control the animations, but this implies that any animation
can only be at 2x speed maximum. For planets that have really high
revolutions periods compared to the nearest planets, you would see them move
extremely slowly. Thus we made a relative speed ratio, that allows to change
the speed to larger scales. In particular, the relative speed ratio takes a
specific planet and accelerates its movement to make it revolve in a definite
amount of time (mostly 5 seconds, see the constant BASE_REVOLUTION_PERIOD in
the system_manager). Then, every other planet will have to follow that new
reference, i.e. if the Earth revolves in 5 secondes, Mars would take around 9
seconds to revolve.


* [AnimManager](#module_AnimManager)
    * [~AnimManager](#module_AnimManager..AnimManager)
        * [new AnimManager(planetsOptions)](#new_module_AnimManager..AnimManager_new)
    * [~PlanetOptions](#module_AnimManager..PlanetOptions) : <code>Object</code>
    * [~ButtonParams](#module_AnimManager..ButtonParams) : <code>Object</code>


* * *

<a name="module_AnimManager..AnimManager"></a>

### AnimManager~AnimManager
The object that manages every animation - their speed in particular.

**Kind**: inner class of [<code>AnimManager</code>](#module_AnimManager)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| globalSpeedRatio | <code>Number</code> | The speed ratio independant of any object. |
| relativeSpeedRatio | <code>Number</code> | The speed ratio relative to a specific planet. |
| animatable | <code>BABYLON.Animatable</code> | Contains all animations. |


* * *

<a name="new_module_AnimManager..AnimManager_new"></a>

#### new AnimManager(planetsOptions)

| Param | Type | Description |
| --- | --- | --- |
| planetsOptions | <code>Array.&lt;PlanetOptions&gt;</code> | The parameters of the planets in the system. |


* * *

<a name="module_AnimManager..PlanetOptions"></a>

### AnimManager~PlanetOptions : <code>Object</code>
Initial parameters for a planet (not to confuse with SpatialObjectParams in 'SpatialObject').

**Kind**: inner typedef of [<code>AnimManager</code>](#module_AnimManager)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the object. |
| diameter | <code>Number</code> | The diameter of the object (no units). |
| distanceToParent | <code>Number</code> | The distance to any parent object (no units). |
| texture | <code>String</code> | The link for the texture of the object. |
| color | <code>BABYLON.Color3</code> | The color of the object. |
| eclipticInclinationAngle | <code>Number</code> | The inclination of the object relative to its star (rad). |
| selfInclinationAngle | <code>Number</code> | The inclination of the object on itself (rad). |
| temperature | <code>Number</code> | The temperature of the object. |
| trajectory | <code>EllipticalTrajectory</code> | The trajectory of the object. |
| spin | <code>Number</code> | The time needed for the object to revolve around itself (seconds). |
| revolutionPeriod | <code>Number</code> | The time needed for the object to revolve around its star (seconds). |
| originalPosition | <code>BABYLON.Vector3</code> | The position the object should appear at. |
| showStaticTrajectory | <code>Boolean</code> | Defines if the static trajectory appears or not. |


* * *

<a name="module_AnimManager..ButtonParams"></a>

### AnimManager~ButtonParams : <code>Object</code>
**Kind**: inner typedef of [<code>AnimManager</code>](#module_AnimManager)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Name of the button. |
| value | <code>Number</code> | Value associated to the button. |


* * *
