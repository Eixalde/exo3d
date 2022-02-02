<a name="module_Exo3DHTMLModifier"></a>

## Exo3DHTMLModifier
This module contains every function used to add of modify
elements of the Exo3D HTML, that are dependant of variable parameters (such
as the number and the name of planets in the system). None of this functions
control anything on the features they support, they only provide fixed
elements based on the parameters they receive. Most modifications are made on
exo3d.html but we recently had to modify the index.html as well so the module
contains methods for both.


* [Exo3DHTMLModifier](#module_Exo3DHTMLModifier)
    * [~NumberOfDaysUpdater](#module_Exo3DHTMLModifier..NumberOfDaysUpdater)
        * [new NumberOfDaysUpdater(animManager, simulationTime, firstPlanetRevPeriod)](#new_module_Exo3DHTMLModifier..NumberOfDaysUpdater_new)
        * [.update()](#module_Exo3DHTMLModifier..NumberOfDaysUpdater+update)
    * [~addPlanetRadioButtons(planets)](#module_Exo3DHTMLModifier..addPlanetRadioButtons)
    * [~modifyPlanetSpeedSlider(planets)](#module_Exo3DHTMLModifier..modifyPlanetSpeedSlider)


* * *

<a name="module_Exo3DHTMLModifier..NumberOfDaysUpdater"></a>

### Exo3DHTMLModifier~NumberOfDaysUpdater
Handles the update of the day count in the simulation.

**Kind**: inner class of [<code>Exo3DHTMLModifier</code>](#module_Exo3DHTMLModifier)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| daysCount | <code>Number</code> | Number of simulation days since the begining of the similation. |
| animManager | <code>AnimManager</code> | The animation manager of the application. |
| simulationTime | <code>Number</code> | The base time for a given planet to revolve in the simulation (in sec). |
| firstPlanetRevPeriod | <code>Number</code> | The period of the first planet of the system (in days). |


* [~NumberOfDaysUpdater](#module_Exo3DHTMLModifier..NumberOfDaysUpdater)
    * [new NumberOfDaysUpdater(animManager, simulationTime, firstPlanetRevPeriod)](#new_module_Exo3DHTMLModifier..NumberOfDaysUpdater_new)
    * [.update()](#module_Exo3DHTMLModifier..NumberOfDaysUpdater+update)


* * *

<a name="new_module_Exo3DHTMLModifier..NumberOfDaysUpdater_new"></a>

#### new NumberOfDaysUpdater(animManager, simulationTime, firstPlanetRevPeriod)

| Param | Type | Description |
| --- | --- | --- |
| animManager | <code>AnimManager</code> | The animation manager of the application. |
| simulationTime | <code>Number</code> | The base time for a given planet to revolve in the simulation (in sec). |
| firstPlanetRevPeriod | <code>Number</code> | The period of the first planet of the system (in days). |


* * *

<a name="module_Exo3DHTMLModifier..NumberOfDaysUpdater+update"></a>

#### numberOfDaysUpdater.update()
Constantly updates the Number of days simulated through the application and
shows it in the dedicated HTML part. It prints months beyond 30 days, and
years beyond 12 months (the conversion is made with daysToDuration, see
'celestial_maths').

**Kind**: instance method of [<code>NumberOfDaysUpdater</code>](#module_Exo3DHTMLModifier..NumberOfDaysUpdater)

* * *

<a name="module_Exo3DHTMLModifier..addPlanetRadioButtons"></a>

### Exo3DHTMLModifier~addPlanetRadioButtons(planets)
Creates radio buttons for every planet. Those buttons are controlled in
cameraModes to change the focus of the camera to look at a specific planet.

**Kind**: inner method of [<code>Exo3DHTMLModifier</code>](#module_Exo3DHTMLModifier)

| Param | Type | Description |
| --- | --- | --- |
| planets | <code>Array.&lt;Planet&gt;</code> | All the planets in the system. |


* * *

<a name="module_Exo3DHTMLModifier..modifyPlanetSpeedSlider"></a>

### Exo3DHTMLModifier~modifyPlanetSpeedSlider(planets)
Modifies the slider for the control of relative speed. It adds tickmarks up
to the number of planets in the system and number them in order. The actual
interactions with that relative speed is done in animManager.

**Kind**: inner method of [<code>Exo3DHTMLModifier</code>](#module_Exo3DHTMLModifier)

| Param | Type | Description |
| --- | --- | --- |
| planets | <code>Array.&lt;Planet&gt;</code> | All the planets in the system. |


* * *
