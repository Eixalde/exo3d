<a name="module_DebugUI"></a>

## DebugUI

* [DebugUI](#module_DebugUI)
    * [~DebugUI](#module_DebugUI..DebugUI)
        * [new DebugUI(generalUI, modificationFunction)](#new_module_DebugUI..DebugUI_new)
        * [.addSliderControls(controlledValue, labelValue, minScale, maxScale, transitionFunction)](#module_DebugUI..DebugUI+addSliderControls)


* * *

<a name="module_DebugUI..DebugUI"></a>

### DebugUI~DebugUI
Debug tool, used mostly to manipulate scales in the system.

**Kind**: inner class of [<code>DebugUI</code>](#module_DebugUI)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| UI | <code>BABYLON.GUI.AdvancedDynamicTexture</code> | The UI of the application. |
| controlsStackPanel | <code>BABYLON.GUI.StackPanel</code> | Stack of controls for the debug. |


* [~DebugUI](#module_DebugUI..DebugUI)
    * [new DebugUI(generalUI, modificationFunction)](#new_module_DebugUI..DebugUI_new)
    * [.addSliderControls(controlledValue, labelValue, minScale, maxScale, transitionFunction)](#module_DebugUI..DebugUI+addSliderControls)


* * *

<a name="new_module_DebugUI..DebugUI_new"></a>

#### new DebugUI(generalUI, modificationFunction)

| Param | Type | Description |
| --- | --- | --- |
| generalUI | <code>BABYLON.GUI.AdvancedDynamicTexture</code> | The UI of the application. |
| modificationFunction | <code>function</code> | The function to call when using the sliders. |


* * *

<a name="module_DebugUI..DebugUI+addSliderControls"></a>

#### debugUI.addSliderControls(controlledValue, labelValue, minScale, maxScale, transitionFunction)
Create a small slider menu to control a specified value.

**Kind**: instance method of [<code>DebugUI</code>](#module_DebugUI..DebugUI)

| Param | Type | Description |
| --- | --- | --- |
| controlledValue | <code>Number</code> | The parameter to modify with the UI. |
| labelValue | <code>String</code> | The name of that parameter. |
| minScale | <code>Number</code> | The minimum value allowed for the parameter. |
| maxScale | <code>Number</code> | The maximum value allowed for the parameter. |
| transitionFunction | <code>function</code> | Makes any transition needed for objets depending on the parameter. |


* * *
