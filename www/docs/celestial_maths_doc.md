<a name="module_CelestialMaths"></a>

## CelestialMaths
About the function 'convertTemperature to RGB' : we found the
code on [GitHub](https://github.com/sergiomb2/ufraw/blob/1aec313/ufraw_routines.c#L246-L294).

We also refered to the following stackoverflow thread : [Calculate colour temperature in K](https://stackoverflow.com/questions/13975917/calculate-colour-temperature-in-k/13982347#13982347).


* [CelestialMaths](#module_CelestialMaths)
    * [~convertTemperatureToRGB(temperature)](#module_CelestialMaths..convertTemperatureToRGB) ⇒ <code>Object</code>
    * [~compareOrbits(currentObjTraj, neighbourObjTraj, currentObjDiameter, neighbourObjDiameter)](#module_CelestialMaths..compareOrbits) ⇒ <code>Number</code>
    * [~compareSystemOrbits(systemCompareParameters)](#module_CelestialMaths..compareSystemOrbits) ⇒ <code>Number</code>
    * [~daysToDuration(daysTotal)](#module_CelestialMaths..daysToDuration) ⇒ <code>Object</code>


* * *

<a name="module_CelestialMaths..convertTemperatureToRGB"></a>

### CelestialMaths~convertTemperatureToRGB(temperature) ⇒ <code>Object</code>
Calculate the RGB coding of a given temperature.

**Kind**: inner method of [<code>CelestialMaths</code>](#module_CelestialMaths)
**Returns**: <code>Object</code> - Returns the RGB coding of that temperature (scaled from 0 to 1).

| Param | Type | Description |
| --- | --- | --- |
| temperature | <code>Number</code> | The temperature of a celestial body (in K). |


* * *

<a name="module_CelestialMaths..compareOrbits"></a>

### CelestialMaths~compareOrbits(currentObjTraj, neighbourObjTraj, currentObjDiameter, neighbourObjDiameter) ⇒ <code>Number</code>
Takes two neighbouring objects (their trajectory and size) and compare them.
The result is a scaling factor by which each object can be enlarged so they
touch each other.

**Kind**: inner method of [<code>CelestialMaths</code>](#module_CelestialMaths)
**Returns**: <code>Number</code> - The scaling factor for the two objects.

| Param | Type | Description |
| --- | --- | --- |
| currentObjTraj | <code>Trajectory</code> | The trajectory of the first object we want to make bigger. |
| neighbourObjTraj | <code>Trajectory</code> | The trajectory of the neighbour of the first object. |
| currentObjDiameter | <code>Number</code> | The diameter of the object. |
| neighbourObjDiameter | <code>Number</code> | The diameter of the neighbour. |


* * *

<a name="module_CelestialMaths..compareSystemOrbits"></a>

### CelestialMaths~compareSystemOrbits(systemCompareParameters) ⇒ <code>Number</code>
Applies the compareOrbits function to an entire system (star excluded). The
result is a factor adapted for the smallest scaling ratio in the system, this
way only two planets may touch each other and there is no overlap.

**Kind**: inner method of [<code>CelestialMaths</code>](#module_CelestialMaths)
**Returns**: <code>Number</code> - The smallest scaling ratio to apply to an entire system.

| Param | Type | Description |
| --- | --- | --- |
| systemCompareParameters | <code>Array.&lt;SpatialObjectParams&gt;</code> | An array of multiple objects containing the parameters for the compareOrbits function. |


* * *

<a name="module_CelestialMaths..daysToDuration"></a>

### CelestialMaths~daysToDuration(daysTotal) ⇒ <code>Object</code>
Convert a duration given in days into years, months and days.

**Kind**: inner method of [<code>CelestialMaths</code>](#module_CelestialMaths)
**Returns**: <code>Object</code> - Structure with the different parts of the duration.

| Param | Type | Description |
| --- | --- | --- |
| daysTotal | <code>Number</code> | Amount of days to convert. |


* * *
