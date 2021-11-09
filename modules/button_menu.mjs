/**
 * A menu that allow the user to interact with the scene using buttons.
 *
 * @member {number} tSize - The font size for the menu.
 * @member {BABYLON.GUI.Grid} menuGrid - The grid that contains all the elements of the menu.
 * @member {Array} gridLabels - The titles for the menu.
 * @member {function} actionOnClick - The function that has to be run when a button is clicked.
 */
class ButtonMenu {
  /**
   * Creates a button menu with specific actions.
   *
   * @param {Array} gridLabels - The titles for the menu.
   * @param {function} actionOnClick - The function that has to be run when a button is clicked.
   * @param {number} hAlignment - The horizontal alignment for the menu (Babylon constant).
   * @param {number} vAlignment - The vertical alignment for the menu (Babylon constant).
   * @param {number} gridWidth - The width of the menu relative to the window (between 0 and 1).
   * @param {number} gridHeight - The height of the menu relative to the window (between 0 and 1).
   * @constant {BABYLON.GUI.TextBlock} gridTitle - The description of the menu.
   */

  constructor({
    gridLabels,
    actionOnClick,
    hAlignment,
    vAlignment,
    gridWidth,
    gridHeight
  }) {
    this.tSize = (window.innerWidth / window.innerHeight) * 7 // Arbitrary font size
    this.menuGrid = new BABYLON.GUI.Grid()
    this.gridLabels = gridLabels
    this.menuGrid.width = gridWidth
    this.menuGrid.height = gridHeight
    this.actionOnClick = actionOnClick

    this.menuGrid.horizontalAlignment = hAlignment
    this.menuGrid.verticalAlignment = vAlignment

    this.menuGrid.fontSize = this.tSize
    const gridTitle = new BABYLON.GUI.TextBlock('', this.gridLabels.menuLabel)
    gridTitle.textSize = this.tSize
    gridTitle.color = 'white'
    this.menuGrid.addControl(gridTitle, 0, 0) // Title menu must be placed in the grid, in the cell of coordinates (0,0)

    // Build all buttons
    for (const [idx, title] of this.gridLabels.buttonLabels.entries()) {
      // Thanks to Pierre-Yves Martin for this syntax
      this.menuGrid.addRowDefinition(1)
      const gridButton = BABYLON.GUI.Button.CreateSimpleButton('', title)
      gridButton.height = 0.9 // Arbitrary button size
      gridButton.width = 0.6
      gridButton.background = 'white'

      // Linking the button with the function passed in parameters
      gridButton.onPointerClickObservable.add(() => {
        this.actionOnClick(title) // Giving the title of the button to the function so it can recognize it
      })
      this.menuGrid.addControl(gridButton, idx + 1, 0)
    }
  }
}

export { ButtonMenu }
