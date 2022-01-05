<a name="module_SpatialObject"></a>

## SpatialObject
About the movement animation : tangents and
interpolation. I am using Babylon's animation system with keys. Give it some
vectors each linked to a frame (it doesn't have to be an integer though) and
it will return a smooth animation between all those vectors. By default, the
transition is made linearly, so with eight points in the space, you make an
8-sided polygon path. But we want elliptical trajectories, so either we
increase the number of points really high, or we make Babylon transitions a
bit more curved. The first option will suffer through any 10000/1 ratio
trajectory (meaning there are two trajectories in the same system and one is
10k times larger), so we have to take the second option. Babylon has pre-made
functions to interpolate movement between two vectors, given proper
parameters and setup. If you provide the tangent of the vector alongside
itself and its frame, Babylon automatically uses a Hermite method to curve
the transition. So we had to get the tangents in the first place. We
calculated them with the Runge-Kutta method, considering the formula for the
vector i :

(i+1th vector - i-1th vector) / 2*deltaT

(deltaT being the time between two keys of animation).


* [SpatialObject](#module_SpatialObject)
    * [~SystemBuilder](#module_SpatialObject..SystemBuilder)
        * [.setScene(scene)](#module_SpatialObject..SystemBuilder+setScene) ⇒ <code>SystemBuilder</code>
        * [.setStarOptions(starOptions)](#module_SpatialObject..SystemBuilder+setStarOptions) ⇒ <code>SystemBuilder</code>
        * [.setRingOptions(ringOptions)](#module_SpatialObject..SystemBuilder+setRingOptions) ⇒ <code>SystemBuilder</code>
        * [.setSatelliteOptions(satelliteOptions)](#module_SpatialObject..SystemBuilder+setSatelliteOptions) ⇒ <code>SystemBuilder</code>
        * [.setPlanetsOptions(planetsOptions)](#module_SpatialObject..SystemBuilder+setPlanetsOptions) ⇒ <code>SystemBuilder</code>
        * [.setNormalizedPeriods(simulationTime)](#module_SpatialObject..SystemBuilder+setNormalizedPeriods) ⇒ <code>SystemBuilder</code>
        * [.setAnimatable(animatable)](#module_SpatialObject..SystemBuilder+setAnimatable) ⇒ <code>SystemBuilder</code>
        * [.setSatelliteOfPlanet(planetOptions)](#module_SpatialObject..SystemBuilder+setSatelliteOfPlanet) ⇒ <code>SystemBuilder</code>
        * [.setRingOfPlanet(planetOptions)](#module_SpatialObject..SystemBuilder+setRingOfPlanet) ⇒ <code>SystemBuilder</code>
    * [~SpatialObject](#module_SpatialObject..SpatialObject)
        * [new SpatialObject(spatialObjectParams, scene)](#new_module_SpatialObject..SpatialObject_new)
        * [.buildAnimation(steps, scene, showStatTraj)](#module_SpatialObject..SpatialObject+buildAnimation)
        * [.setEclipticInclination()](#module_SpatialObject..SpatialObject+setEclipticInclination)
        * [.getVisualDiameter()](#module_SpatialObject..SpatialObject+getVisualDiameter) ⇒ <code>Number</code>
    * [~Star](#module_SpatialObject..Star) ⇐ <code>SpatialObject</code>
        * [new Star(spatialObjectParams, scene)](#new_module_SpatialObject..Star_new)
    * [~Planet](#module_SpatialObject..Planet) ⇐ <code>SpatialObject</code>
        * [new Planet(spatialObjectParams, scene)](#new_module_SpatialObject..Planet_new)
    * [~Ring](#module_SpatialObject..Ring) ⇐ <code>SpatialObject</code>
        * [new Ring(spatialObjectParams, scene)](#new_module_SpatialObject..Ring_new)
    * [~SpatialObjectParams](#module_SpatialObject..SpatialObjectParams) : <code>Object</code>


* * *

<a name="module_SpatialObject..SystemBuilder"></a>

### SpatialObject~SystemBuilder
Builds a system with a star, several planets and - if existing - their rings
and satellites.

**Kind**: inner class of [<code>SpatialObject</code>](#module_SpatialObject)

* [~SystemBuilder](#module_SpatialObject..SystemBuilder)
    * [.setScene(scene)](#module_SpatialObject..SystemBuilder+setScene) ⇒ <code>SystemBuilder</code>
    * [.setStarOptions(starOptions)](#module_SpatialObject..SystemBuilder+setStarOptions) ⇒ <code>SystemBuilder</code>
    * [.setRingOptions(ringOptions)](#module_SpatialObject..SystemBuilder+setRingOptions) ⇒ <code>SystemBuilder</code>
    * [.setSatelliteOptions(satelliteOptions)](#module_SpatialObject..SystemBuilder+setSatelliteOptions) ⇒ <code>SystemBuilder</code>
    * [.setPlanetsOptions(planetsOptions)](#module_SpatialObject..SystemBuilder+setPlanetsOptions) ⇒ <code>SystemBuilder</code>
    * [.setNormalizedPeriods(simulationTime)](#module_SpatialObject..SystemBuilder+setNormalizedPeriods) ⇒ <code>SystemBuilder</code>
    * [.setAnimatable(animatable)](#module_SpatialObject..SystemBuilder+setAnimatable) ⇒ <code>SystemBuilder</code>
    * [.setSatelliteOfPlanet(planetOptions)](#module_SpatialObject..SystemBuilder+setSatelliteOfPlanet) ⇒ <code>SystemBuilder</code>
    * [.setRingOfPlanet(planetOptions)](#module_SpatialObject..SystemBuilder+setRingOfPlanet) ⇒ <code>SystemBuilder</code>


* * *

<a name="module_SpatialObject..SystemBuilder+setScene"></a>

#### systemBuilder.setScene(scene) ⇒ <code>SystemBuilder</code>
**Kind**: instance method of [<code>SystemBuilder</code>](#module_SpatialObject..SystemBuilder)

| Param | Type | Description |
| --- | --- | --- |
| scene | <code>BABYLON.Scene</code> | The current scene. |


* * *

<a name="module_SpatialObject..SystemBuilder+setStarOptions"></a>

#### systemBuilder.setStarOptions(starOptions) ⇒ <code>SystemBuilder</code>
**Kind**: instance method of [<code>SystemBuilder</code>](#module_SpatialObject..SystemBuilder)

| Param | Type | Description |
| --- | --- | --- |
| starOptions | <code>Object</code> | Parameters needed for the creation of a star. |


* * *

<a name="module_SpatialObject..SystemBuilder+setRingOptions"></a>

#### systemBuilder.setRingOptions(ringOptions) ⇒ <code>SystemBuilder</code>
**Kind**: instance method of [<code>SystemBuilder</code>](#module_SpatialObject..SystemBuilder)

| Param | Type | Description |
| --- | --- | --- |
| ringOptions | <code>Object</code> | Parameters needed for the creation of a ring. |


* * *

<a name="module_SpatialObject..SystemBuilder+setSatelliteOptions"></a>

#### systemBuilder.setSatelliteOptions(satelliteOptions) ⇒ <code>SystemBuilder</code>
**Kind**: instance method of [<code>SystemBuilder</code>](#module_SpatialObject..SystemBuilder)

| Param | Type | Description |
| --- | --- | --- |
| satelliteOptions | <code>Object</code> | Parameters needed for the creation of a satellite. |


* * *

<a name="module_SpatialObject..SystemBuilder+setPlanetsOptions"></a>

#### systemBuilder.setPlanetsOptions(planetsOptions) ⇒ <code>SystemBuilder</code>
**Kind**: instance method of [<code>SystemBuilder</code>](#module_SpatialObject..SystemBuilder)

| Param | Type | Description |
| --- | --- | --- |
| planetsOptions | <code>Array</code> | The array of the parameters need for several planets. |


* * *

<a name="module_SpatialObject..SystemBuilder+setNormalizedPeriods"></a>

#### systemBuilder.setNormalizedPeriods(simulationTime) ⇒ <code>SystemBuilder</code>
**Kind**: instance method of [<code>SystemBuilder</code>](#module_SpatialObject..SystemBuilder)

| Param | Type | Description |
| --- | --- | --- |
| simulationTime | <code>Number</code> | The time needed for a given planet to revolve. |


* * *

<a name="module_SpatialObject..SystemBuilder+setAnimatable"></a>

#### systemBuilder.setAnimatable(animatable) ⇒ <code>SystemBuilder</code>
**Kind**: instance method of [<code>SystemBuilder</code>](#module_SpatialObject..SystemBuilder)

| Param | Type | Description |
| --- | --- | --- |
| animatable | <code>AnimManager.animatable</code> | Contains every animation of every object. |


* * *

<a name="module_SpatialObject..SystemBuilder+setSatelliteOfPlanet"></a>

#### systemBuilder.setSatelliteOfPlanet(planetOptions) ⇒ <code>SystemBuilder</code>
**Kind**: instance method of [<code>SystemBuilder</code>](#module_SpatialObject..SystemBuilder)

| Param | Type | Description |
| --- | --- | --- |
| planetOptions | <code>Object</code> | Parameters needed for the creation of a planet. |


* * *

<a name="module_SpatialObject..SystemBuilder+setRingOfPlanet"></a>

#### systemBuilder.setRingOfPlanet(planetOptions) ⇒ <code>SystemBuilder</code>
**Kind**: instance method of [<code>SystemBuilder</code>](#module_SpatialObject..SystemBuilder)

| Param | Type | Description |
| --- | --- | --- |
| planetOptions | <code>Object</code> | Parameters needed for the creation of a planet. |


* * *

<a name="module_SpatialObject..SpatialObject"></a>

### SpatialObject~SpatialObject
The base class for any spatial object. It shall not be instantiated as such,
because it has no signification otherwise.

**Kind**: inner class of [<code>SpatialObject</code>](#module_SpatialObject)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the object. |
| diameter | <code>Number</code> | The diameter of the object (no units). |
| distanceToParent | <code>Number</code> | The distance to any parent object (no units). |
| texture | <code>String</code> | The link for the texture of the object. |
| color | <code>BABYLON.Color3</code> | The color of the object. |
| mesh | <code>BABYLON.Mesh</code> | The mesh representing the object. |
| eclipticInclinationAngle | <code>Number</code> | The inclination of the object relative to its star (rad). |
| selfInclinationAngle | <code>Number</code> | The inclination of the object on itself (rad). |
| systemCenter | <code>BABYLON.Vector3</code> | The point of reference for the center of the system (for inclination purposes). |
| revolutionAxisParent | <code>BABYLON.Sphere</code> | The object that allow inclination on the ecliptic plane. |
| spinAxisParent | <code>BABYLON.Sphere</code> | The object that allow inclination on the planet itself. |
| temperature | <code>Number</code> | The temperature of the object (K). |
| trajectory | <code>EllipticalTrajectory</code> | The trajectory of the object. |
| normalizedSpin | <code>Number</code> | The time needed for the object to revolve around itself (seconds). |
| normalizedRevolutionPeriod | <code>Number</code> | The time needed for the object to revolve around its star (seconds). |
| animatableIndex | <code>Number</code> | The position of the animations in the animatable array. |


* [~SpatialObject](#module_SpatialObject..SpatialObject)
    * [new SpatialObject(spatialObjectParams, scene)](#new_module_SpatialObject..SpatialObject_new)
    * [.buildAnimation(steps, scene, showStatTraj)](#module_SpatialObject..SpatialObject+buildAnimation)
    * [.setEclipticInclination()](#module_SpatialObject..SpatialObject+setEclipticInclination)
    * [.getVisualDiameter()](#module_SpatialObject..SpatialObject+getVisualDiameter) ⇒ <code>Number</code>


* * *

<a name="new_module_SpatialObject..SpatialObject_new"></a>

#### new SpatialObject(spatialObjectParams, scene)

| Param | Type | Description |
| --- | --- | --- |
| spatialObjectParams | <code>SpatialObjectParams</code> | Parameters needed for the creation of a SpatialObject. |
| scene | <code>BABYLON.Scene</code> | The current scene. |


* * *

<a name="module_SpatialObject..SpatialObject+buildAnimation"></a>

#### spatialObject.buildAnimation(steps, scene, showStatTraj)
Creates the 'rotate on itself' animation, and the movement animation if the
object does move.

**Kind**: instance method of [<code>SpatialObject</code>](#module_SpatialObject..SpatialObject)

| Param | Type | Description |
| --- | --- | --- |
| steps | <code>Number</code> | The number of steps required for the animation. |
| scene | <code>BABYLON.Scene</code> | The current scene. |
| showStatTraj | <code>Boolean</code> | Defines if the static trajectory appears or not. |


* * *

<a name="module_SpatialObject..SpatialObject+setEclipticInclination"></a>

#### spatialObject.setEclipticInclination()
Places the object in such a way that it has the correct inclination to the
ecliptic plane. In particular, this creates a 'revolutionAxisParent' attribute that
will take the role of tilting the whole plane containing the center of the
system and the spatial object.

**Kind**: instance method of [<code>SpatialObject</code>](#module_SpatialObject..SpatialObject)

* * *

<a name="module_SpatialObject..SpatialObject+getVisualDiameter"></a>

#### spatialObject.getVisualDiameter() ⇒ <code>Number</code>
Computes and returns the current diameter of the object, including any
scaling.

**Kind**: instance method of [<code>SpatialObject</code>](#module_SpatialObject..SpatialObject)

* * *

<a name="module_SpatialObject..Star"></a>

### SpatialObject~Star ⇐ <code>SpatialObject</code>
The class used for any star.

**Kind**: inner class of [<code>SpatialObject</code>](#module_SpatialObject)
**Extends**: <code>SpatialObject</code>

* * *

<a name="new_module_SpatialObject..Star_new"></a>

#### new Star(spatialObjectParams, scene)

| Param | Type | Description |
| --- | --- | --- |
| spatialObjectParams | <code>SpatialObjectParams</code> | The multiple paramaters needed for any spatial object. |
| scene | <code>BABYLON.Scene</code> | The current scene. |


* * *

<a name="module_SpatialObject..Planet"></a>

### SpatialObject~Planet ⇐ <code>SpatialObject</code>
The class used for planets and satellites.

**Kind**: inner class of [<code>SpatialObject</code>](#module_SpatialObject)
**Extends**: <code>SpatialObject</code>
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| satellites | <code>Array</code> | Planet-exclusive member, dedicated to the list of its satellites (if any). |


* * *

<a name="new_module_SpatialObject..Planet_new"></a>

#### new Planet(spatialObjectParams, scene)

| Param | Type | Description |
| --- | --- | --- |
| spatialObjectParams | <code>SpatialObjectParams</code> | The multiple paramaters needed for any spatial object. |
| scene | <code>BABYLON.Scene</code> | The current scene. |


* * *

<a name="module_SpatialObject..Ring"></a>

### SpatialObject~Ring ⇐ <code>SpatialObject</code>
The planetary disc support (for objects like Saturn rings e.g.)

**Kind**: inner class of [<code>SpatialObject</code>](#module_SpatialObject)
**Extends**: <code>SpatialObject</code>

* * *

<a name="new_module_SpatialObject..Ring_new"></a>

#### new Ring(spatialObjectParams, scene)

| Param | Type | Description |
| --- | --- | --- |
| spatialObjectParams | <code>SpatialObjectParams</code> | Parameters needed for the creation of a SpatialObject. |
| scene | <code>BABYLON.Scene</code> | The current scene. |


* * *

<a name="module_SpatialObject..SpatialObjectParams"></a>

### SpatialObject~SpatialObjectParams : <code>Object</code>
Parameters needed for the creation of a SpatialObject.

**Kind**: inner typedef of [<code>SpatialObject</code>](#module_SpatialObject)
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
| systemCenter | <code>BABYLON.Vector3</code> | The point of reference for the center of the system (for inclination purposes). |
| temperature | <code>Number</code> | The temperature of the object. |
| trajectory | <code>EllipticalTrajectory</code> | The trajectory of the object. |
| normalizedSpin | <code>Number</code> | The time needed for the object to revolve around itself (seconds). |
| normalizedRevolutionPeriod | <code>Number</code> | The time needed for the object to revolve around its star (seconds). |
| originalPosition | <code>BABYLON.Vector3</code> | The position the object should appear at. |
| showStatTraj | <code>Boolean</code> | Defines if the static trajectory appears or not. |
| animatable | <code>BABYLON.Animatable</code> | Contains all animations. |


* * *
