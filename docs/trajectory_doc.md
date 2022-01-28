<a name="module_Trajectory"></a>

## Trajectory

The trajectory is mainly focused around its component called
'staticTrajectory'. This represents what the user will see of the trajectory
in general : its path. For the most part, the SpatialObject handles well the
imprecision of the defined, limited amount of points in the trajectory (by
making interpolations). But the actual representation cannot use any of that,
it has to use straight lines between a strict amount of points. This wasn't
an issue when the precision was barely respected, but it became a real
problem when we started to scale the system at really high distances. So our
almost perfect circles got back to what they actually are : ugly polygones.
We needed to improve the precision without calculating a trillion of points,
so we had an idea : short interpolation at short scale. When we look at one
specific object (and only that one), we add points between the pre-existing
ones, we make one of those points follow the SpatialObject while they're near
from each other, and we re-draw the line of the trajectory to include that
point. This isn't still really precise, but it is visually way better than
before - where the trajectory not matching the actual movement of the object
was genuinely the only thing you would notice.

- [Trajectory](#module_Trajectory)
  - [~EllipticalTrajectory](#module_Trajectory..EllipticalTrajectory)
    - [new EllipticalTrajectory(a, e, canMove)](#new_module_Trajectory..EllipticalTrajectory_new)
    - [.staticTrajectory](#module_Trajectory..EllipticalTrajectory+staticTrajectory) ⇒ <code>Array.&lt;BABYLON.Vector3&gt;</code>
    - [.positionWithNu(nu)](#module_Trajectory..EllipticalTrajectory+positionWithNu) ⇒ <code>Object</code>
    - [.buildStaticTrajectory(steps)](#module_Trajectory..EllipticalTrajectory+buildStaticTrajectory) ⇒ <code>Array.&lt;BABYLON.Vector3&gt;</code>
    - [.showStaticTrajectory(animatable, framerate, scene, spObj)](#module_Trajectory..EllipticalTrajectory+showStaticTrajectory)
    - [.fixStaticTrajectory(scene, spObj, curFrame, framerate, stTraj, line)](#module_Trajectory..EllipticalTrajectory+fixStaticTrajectory)

---

<a name="module_Trajectory..EllipticalTrajectory"></a>

### Trajectory~EllipticalTrajectory

An object that mathematically represents an elliptical trajectory. It also
provides functions to compute single positions on this trajectory, and ways
to show them to the user.

**Kind**: inner class of [<code>Trajectory</code>](#module_Trajectory)
**Properties**

| Name             | Type                                       | Description                                                      |
| ---------------- | ------------------------------------------ | ---------------------------------------------------------------- |
| a                | <code>Number</code>                        | The semi-major axis.                                             |
| e                | <code>Number</code>                        | The excentricity.                                                |
| b                | <code>Number</code>                        | The semi-minor axis.                                             |
| canMove          | <code>Boolean</code>                       | States if the object attached to the trajectory can move or not. |
| staticTrajectory | <code>Array.&lt;BABYLON.Vector3&gt;</code> | The actual representation of the trajectory in the simulation.   |

- [~EllipticalTrajectory](#module_Trajectory..EllipticalTrajectory)
  - [new EllipticalTrajectory(a, e, canMove)](#new_module_Trajectory..EllipticalTrajectory_new)
  - [.staticTrajectory](#module_Trajectory..EllipticalTrajectory+staticTrajectory) ⇒ <code>Array.&lt;BABYLON.Vector3&gt;</code>
  - [.positionWithNu(nu)](#module_Trajectory..EllipticalTrajectory+positionWithNu) ⇒ <code>Object</code>
  - [.buildStaticTrajectory(steps)](#module_Trajectory..EllipticalTrajectory+buildStaticTrajectory) ⇒ <code>Array.&lt;BABYLON.Vector3&gt;</code>
  - [.showStaticTrajectory(animatable, framerate, scene, spObj)](#module_Trajectory..EllipticalTrajectory+showStaticTrajectory)
  - [.fixStaticTrajectory(scene, spObj, curFrame, framerate, stTraj, line)](#module_Trajectory..EllipticalTrajectory+fixStaticTrajectory)

---

<a name="new_module_Trajectory..EllipticalTrajectory_new"></a>

#### new EllipticalTrajectory(a, e, canMove)

| Param   | Type                 |
| ------- | -------------------- |
| a       | <code>Number</code>  |
| e       | <code>Number</code>  |
| canMove | <code>Boolean</code> |

---

<a name="module_Trajectory..EllipticalTrajectory+staticTrajectory"></a>

#### ellipticalTrajectory.staticTrajectory ⇒ <code>Array.&lt;BABYLON.Vector3&gt;</code>

Lazy accessor for the static trajectory.

**Kind**: instance property of [<code>EllipticalTrajectory</code>](#module_Trajectory..EllipticalTrajectory)

---

<a name="module_Trajectory..EllipticalTrajectory+positionWithNu"></a>

#### ellipticalTrajectory.positionWithNu(nu) ⇒ <code>Object</code>

Computes a position (on the ellipse) based on the true anomaly.

**Kind**: instance method of [<code>EllipticalTrajectory</code>](#module_Trajectory..EllipticalTrajectory)
**Returns**: <code>Object</code> - The coordinates of a 2D-point and its distance to the focus.

| Param | Type                | Description                                                                                                               |
| ----- | ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| nu    | <code>Number</code> | The true anomaly : angle between the direction of periapsis and the position, as seen from the main focus of the ellipse. |

---

<a name="module_Trajectory..EllipticalTrajectory+buildStaticTrajectory"></a>

#### ellipticalTrajectory.buildStaticTrajectory(steps) ⇒ <code>Array.&lt;BABYLON.Vector3&gt;</code>

Creates a static trajectory.

**Kind**: instance method of [<code>EllipticalTrajectory</code>](#module_Trajectory..EllipticalTrajectory)
**Returns**: <code>Array.&lt;BABYLON.Vector3&gt;</code> - The 3D-points contained in the static trajectory.

| Param | Type                | Description              |
| ----- | ------------------- | ------------------------ |
| steps | <code>Number</code> | Number of points to use. |

---

<a name="module_Trajectory..EllipticalTrajectory+showStaticTrajectory"></a>

#### ellipticalTrajectory.showStaticTrajectory(animatable, framerate, scene, spObj)

Creates lines to approach the real trajectory of the object.

**Kind**: instance method of [<code>EllipticalTrajectory</code>](#module_Trajectory..EllipticalTrajectory)

| Param      | Type                                          | Description                                           |
| ---------- | --------------------------------------------- | ----------------------------------------------------- |
| animatable | <code>Array.&lt;BABYLON.Animatable&gt;</code> | The animation of which we want to see the trajectory. |
| framerate  | <code>Number</code>                           | The framerate of the animation.                       |
| scene      | <code>BABYLON.Scene</code>                    | The current scene.                                    |
| spObj      | <code>SpatialObject</code>                    | The spatial object of reference for the trajectory.   |

---

<a name="module_Trajectory..EllipticalTrajectory+fixStaticTrajectory"></a>

#### ellipticalTrajectory.fixStaticTrajectory(scene, spObj, curFrame, framerate, stTraj, line)

Adds more precision to the static trajectory line by artificially moving
some points alongside its spatial object.

**Kind**: instance method of [<code>EllipticalTrajectory</code>](#module_Trajectory..EllipticalTrajectory)

| Param     | Type                                       | Description                                               |
| --------- | ------------------------------------------ | --------------------------------------------------------- |
| scene     | <code>BABYLON.Scene</code>                 | The current scene.                                        |
| spObj     | <code>SpatialObject</code>                 | The spatial object associated to the static trajectory.   |
| curFrame  | <code>Number</code>                        | The current frame of the animation of the spatial object. |
| framerate | <code>Number</code>                        | The framerate of the animation.                           |
| stTraj    | <code>Array.&lt;BABYLON.Vector3&gt;</code> | The points of the static trajectory.                      |
| line      | <code>BABYLON.LinesMesh</code>             | The line representing the static trajectory.              |

---
