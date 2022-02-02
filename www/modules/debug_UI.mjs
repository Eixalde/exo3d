/**
 * @module DebugUI
 */

/**
 * Debug tool, used mostly to manipulate scales in the system.
 * @property {BABYLON.GUI.AdvancedDynamicTexture} UI - The UI of the application.
 * @property {BABYLON.GUI.StackPanel} controlsStackPanel - Stack of controls for the debug.
 */
class DebugUI {
  /**
   * @param {BABYLON.GUI.AdvancedDynamicTexture} generalUI - The UI of the application.
   * @param {Function} modificationFunction - The function to call when using the sliders.
   */
  constructor(generalUI, modificationFunction) {
    const LOWER_SLIDER_VALUE = 0.1 // Ad hoc value
    const UPPER_SLIDER_VALUE = 10000 // Ad hoc value

    this.UI = generalUI
    this.controlsStackPanel = new BABYLON.GUI.StackPanel()
    this.controlsStackPanel.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
    this.controlsStackPanel.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    this.controlsStackPanel.width = 0.2
    this.controlsStackPanel.height = 1

    this.UI.addControl(this.controlsStackPanel)
    let scalingSpatialObjects = 1
    this.addSliderControls(
      scalingSpatialObjects,
      'scalingSpatialObjects',
      LOWER_SLIDER_VALUE,
      UPPER_SLIDER_VALUE,
      modificationFunction
    )
  }

  /**
   * Create a small slider menu to control a specified value.
   * @param {Number} controlledValue - The parameter to modify with the UI.
   * @param {String} labelValue - The name of that parameter.
   * @param {Number} minScale - The minimum value allowed for the parameter.
   * @param {Number} maxScale - The maximum value allowed for the parameter.
   * @param {Function} transitionFunction - Makes any transition needed for objets depending on the parameter.
   */
  addSliderControls(
    controlledValue,
    labelValue,
    minScale,
    maxScale,
    transitionFunction
  ) {
    /* All values for width, height, rows or columns are on a scale from 0
    (inexistant) to 1 (covers all the container). 0.5 in particular is half
    the size. */
    const GRID_WIDTH = 1
    const GRID_HEIGHT = 0.2
    const LABEL_HEIGHT = 0.5
    const FONTSIZE = 15
    const SLIDER_WIDTH = 0.85
    const SLIDER_HEIGHT = 0.3
    const INPUT_WIDTH = 1
    const INPUT_HEIGHT = 0.4

    const haGrid = new BABYLON.GUI.Grid()
    haGrid.width = GRID_WIDTH
    haGrid.height = GRID_HEIGHT
    /* Adding row and columns one by one is unfortunately the only way to do
    with grids in Babylon. */
    haGrid.addRowDefinition(0.5)
    haGrid.addRowDefinition(0.5)
    haGrid.addColumnDefinition(0.5)
    haGrid.addColumnDefinition(0.5)
    this.controlsStackPanel.addControl(haGrid)

    const controlLabel = new BABYLON.GUI.TextBlock()
    controlLabel.height = LABEL_HEIGHT
    controlLabel.color = 'white'
    controlLabel.text = `Value of ${labelValue} : ${controlledValue.toFixed(3)}`
    controlLabel.fontSize = FONTSIZE
    controlLabel.textWrapping = BABYLON.GUI.TextWrapping.WordWrap

    const controlSlider = new BABYLON.GUI.Slider()
    controlSlider.minimum = minScale
    controlSlider.maximum = maxScale
    controlSlider.value = controlledValue
    controlSlider.height = SLIDER_HEIGHT
    controlSlider.width = SLIDER_WIDTH
    controlSlider.color = 'blue'
    controlSlider.background = 'grey'
    controlSlider.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    controlSlider.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER

    controlSlider.onValueChangedObservable.add(function (value) {
      controlledValue = value
      controlLabel.text = `Value of ${labelValue} : ${controlledValue.toFixed(
        3
      )}`
      transitionFunction(controlledValue)
    })

    const controlInput = new BABYLON.GUI.InputText()
    controlInput.width = INPUT_WIDTH
    controlInput.height = INPUT_HEIGHT
    controlInput.fontSize = FONTSIZE
    controlInput.color = 'white'
    controlInput.onTextChangedObservable.add(() => {
      const checkNmb = Number(controlInput.text)
      if (!isNaN(checkNmb)) {
        /* The following line maps the entered value between the extremums */
        const checkNumber = Math.min(
          controlSlider.maximum,
          Math.max(checkNmb, controlSlider.minimum)
        )
        controlLabel.text = `Value of ${labelValue} ${checkNumber.toFixed(3)}`
        controlledValue = checkNumber
        controlSlider.value = controlledValue
        transitionFunction(controlledValue.toFixed(1))
      }
    })

    /* The 2nd and 3rd parameters of addControl for a grid is the position in
    that grid (by rows and column) */
    haGrid.addControl(controlInput, 1, 1)
    haGrid.addControl(controlLabel, 0, 0)
    haGrid.addControl(controlSlider, 1, 0)
  }
}

export { DebugUI }
