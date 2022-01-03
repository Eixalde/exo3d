<a name="module_HTMLModifier"></a>

## HTMLModifier
This module contains every function used to add of modify HTML
elements that are dependant of variable parameters (such as the number and
the name of planets in the system). None of this functions control anything
on the features they support, they only provide fixed elements based on the
parameters they receive.


* [HTMLModifier](#module_HTMLModifier)
    * [~NumberOfDaysUpdater](#module_HTMLModifier..NumberOfDaysUpdater)
        * [new NumberOfDaysUpdater(animManager, simulationTime, firstPlanetRevPeriod)](#new_module_HTMLModifier..NumberOfDaysUpdater_new)
        * [.update()](#module_HTMLModifier..NumberOfDaysUpdater+update)
    * [~addPlanetRadioButtons(planets)](#module_HTMLModifier..addPlanetRadioButtons)
    * [~modifyPlanetSpeedSlider(planets)](#module_HTMLModifier..modifyPlanetSpeedSlider)


* * *

<a name="module_HTMLModifier..NumberOfDaysUpdater"></a>

### HTMLModifier~NumberOfDaysUpdater
Handles the update of the day count in the simulation.

**Kind**: inner class of [<code>HTMLModifier</code>](#module_HTMLModifier)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| daysCount | <code>Number</code> | Number of simulation days since the begining of the similation. |
| animManager | <code>AnimManager</code> | The animation manager of the application. |
| simulationTime | <code>Number</code> | The base time for a given planet to revolve in the simulation (in sec). |
| firstPlanetRevPeriod | <code>Number</code> | The period of the first planet of the system (in days). |


* [~NumberOfDaysUpdater](#module_HTMLModifier..NumberOfDaysUpdater)
    * [new NumberOfDaysUpdater(animManager, simulationTime, firstPlanetRevPeriod)](#new_module_HTMLModifier..NumberOfDaysUpdater_new)
    * [.update()](#module_HTMLModifier..NumberOfDaysUpdater+update)


* * *

<a name="new_module_HTMLModifier..NumberOfDaysUpdater_new"></a>

#### new NumberOfDaysUpdater(animManager, simulationTime, firstPlanetRevPeriod)

| Param | Type | Description |
| --- | --- | --- |
| animManager | <code>AnimManager</code> | The animation manager of the application. |
| simulationTime | <code>Number</code> | The base time for a given planet to revolve in the simulation (in sec). |
| firstPlanetRevPeriod | <code>Number</code> | The period of the first planet of the system (in days). |


* * *

<a name="module_HTMLModifier..NumberOfDaysUpdater+update"></a>

#### numberOfDaysUpdater.update()
Constantly updates the Number of days simulated through the application and
shows it in the dedicated HTML part. It prints months beyond 30 days, and
years beyond 12 months (the conversion is made with daysToDuration, see
'celestial_maths').

**Kind**: instance method of [<code>NumberOfDaysUpdater</code>](#module_HTMLModifier..NumberOfDaysUpdater)

* * *

<a name="module_HTMLModifier..addPlanetRadioButtons"></a>

### HTMLModifier~addPlanetRadioButtons(planets)
Creates radio buttons for every planet. Those buttons are controlled in
cameraModes to change the focus of the camera to look at a specific planet.

**Kind**: inner method of [<code>HTMLModifier</code>](#module_HTMLModifier)

| Param | Type | Description |
| --- | --- | --- |
| planets | <code>Array.&lt;Planet&gt;</code> | All the planets in the system. |


* * *

<a name="module_HTMLModifier..modifyPlanetSpeedSlider"></a>

### HTMLModifier~modifyPlanetSpeedSlider(planets)
Modifies the slider for the control of relative speed. It adds tickmarks up
to the number of planets in the system and number them in order. The actual
interactions with that relative speed is done in animManager.

**Kind**: inner method of [<code>HTMLModifier</code>](#module_HTMLModifier)

| Param | Type | Description |
| --- | --- | --- |
| planets | <code>Array.&lt;Planet&gt;</code> | All the planets in the system. |


* * *
