<a name="module_Trajectory"></a>

## Trajectory

* [Trajectory](#module_Trajectory)
    * [~EllipticalTrajectory](#module_Trajectory..EllipticalTrajectory)
        * [new EllipticalTrajectory(a, e, canMove)](#new_module_Trajectory..EllipticalTrajectory_new)
        * [.posInNu(nu)](#module_Trajectory..EllipticalTrajectory+posInNu) ⇒ <code>Object</code>
        * [.staticTrajectory(steps)](#module_Trajectory..EllipticalTrajectory+staticTrajectory) ⇒ <code>Array</code>


* * *

<a name="module_Trajectory..EllipticalTrajectory"></a>

### Trajectory~EllipticalTrajectory
An object that mathematically represents an elliptical trajectory. It also
provides functions to compute single positions on this trajectory.

**Kind**: inner class of [<code>Trajectory</code>](#module_Trajectory)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| a | <code>Number</code> | The semi-major axis. |
| e | <code>Number</code> | The excentricity. |
| b | <code>Number</code> | The semi-minor axis. |
| canMove | <code>Boolean</code> | States if the object attached to the trajectory can move or not. |


* [~EllipticalTrajectory](#module_Trajectory..EllipticalTrajectory)
    * [new EllipticalTrajectory(a, e, canMove)](#new_module_Trajectory..EllipticalTrajectory_new)
    * [.posInNu(nu)](#module_Trajectory..EllipticalTrajectory+posInNu) ⇒ <code>Object</code>
    * [.staticTrajectory(steps)](#module_Trajectory..EllipticalTrajectory+staticTrajectory) ⇒ <code>Array</code>


* * *

<a name="new_module_Trajectory..EllipticalTrajectory_new"></a>

#### new EllipticalTrajectory(a, e, canMove)

| Param | Type |
| --- | --- |
| a | <code>Number</code> |
| e | <code>Number</code> |
| canMove | <code>Boolean</code> |


* * *

<a name="module_Trajectory..EllipticalTrajectory+posInNu"></a>

#### ellipticalTrajectory.posInNu(nu) ⇒ <code>Object</code>
Computes a position (on the ellipse) based on the true anomaly.

**Kind**: instance method of [<code>EllipticalTrajectory</code>](#module_Trajectory..EllipticalTrajectory)
**Returns**: <code>Object</code> - The coordinates of a 2D-point and its distance to the focus.

| Param | Type | Description |
| --- | --- | --- |
| nu | <code>Number</code> | The true anomaly : angle between the direction of periapsis and the position, as seen from the main focus of the ellipse. |


* * *

<a name="module_Trajectory..EllipticalTrajectory+staticTrajectory"></a>

#### ellipticalTrajectory.staticTrajectory(steps) ⇒ <code>Array</code>
Creates a static trajectory.

**Kind**: instance method of [<code>EllipticalTrajectory</code>](#module_Trajectory..EllipticalTrajectory)
**Returns**: <code>Array</code> - The 3D-points contained in the static trajectory.

| Param | Type | Description |
| --- | --- | --- |
| steps | <code>Number</code> | Number of points to use. |


* * *
