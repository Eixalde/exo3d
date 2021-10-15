class ButtonMenu {
  tSize
  menuGrid
  gridTitle
  gridLabels
  actionOnClick

  /**
   * Creates a button menu with specific actions.
   * @param {object} menuParameters - Multiple paramaters needed for a button menu.
   */

  constructor({
    gridLabels,
    actionOnClick,
    hAlignment,
    vAlignment,
    gridWidth,
    gridHeight
  }) {
    this.tSize = (window.innerWidth / window.innerHeight) * 7 // Taille de police arbitraire
    this.menuGrid = new BABYLON.GUI.Grid()
    this.gridLabels = gridLabels
    this.menuGrid.width = gridWidth
    this.menuGrid.height = gridHeight
    this.actionOnClick = actionOnClick

    this.menuGrid.horizontalAlignment = hAlignment
    this.menuGrid.verticalAlignment = vAlignment

    this.menuGrid.fontSize = this.tSize
    this.gridTitle = new BABYLON.GUI.TextBlock('', this.gridLabels.menuLabel)
    this.gridTitle.textSize = this.tSize
    this.gridTitle.color = 'white'
    this.menuGrid.addControl(this.gridTitle, 0, 0) // Le titre du menu doit être placé en position (0,0), soit le début de la grille

    // Build all buttons
    for (const [idx, title] of this.gridLabels.buttonLabels.entries()) {
      // Merci à Pierre-Yves Martin pour m'avoir proposé cette syntaxe
      this.menuGrid.addRowDefinition(1)
      const gridButton = BABYLON.GUI.Button.CreateSimpleButton('', title)
      gridButton.height = 0.9 // Taille de boutons arbitraire
      gridButton.width = 0.6
      gridButton.background = 'white'

      // On associe au bouton la fonction renseignée via les paramètres
      gridButton.onPointerClickObservable.add(() => {
        this.actionOnClick(title) // On passe le label du bouton en paramètre pour que chaque menu reconnaisse l'action associée
      })
      this.menuGrid.addControl(gridButton, idx + 1, 0) // On doit placer le bouton en position idx+1 car la position 0 est prise par le menu (et idx part de 0)
    }
  }
}

export { ButtonMenu }
