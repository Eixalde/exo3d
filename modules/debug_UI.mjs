// NOTE : quite the same thing as Animations, I didn't touch anything besides making some fields. Also DebugUI is super old, almost nothing here will be used
// The UI debug rework will make this class usable (and used)
class DebugUI {
  descUI
  buttons
  constructor(scene) {
    let advancedTexture =
      BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI')
    this.buttons = []
    let meshIndex = 0,
      tSize = 20
    this.descUI = new BABYLON.GUI.TextBlock(
      '',
      "Liste des Mesh à l'écran (cliquer pour masquer/afficher) :"
    )
    this.descUI.textHorizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    this.descUI.textVerticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    this.descUI.left = tSize
    this.descUI.textSize = tSize * 1.5
    this.descUI.color = 'white'
    advancedTexture.addControl(this.descUI)

    scene.meshes.forEach((e) => {
      this.buttons[meshIndex] = BABYLON.GUI.Button.CreateSimpleButton(
        '',
        e.name
      )
      this.buttons[meshIndex].horizontalAlignment =
        BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
      this.buttons[meshIndex].verticalAlignment =
        BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
      this.buttons[meshIndex].left = tSize
      this.buttons[meshIndex].top = (meshIndex + 1) * tSize
      this.buttons[meshIndex].color = 'black'
      this.buttons[meshIndex].background = 'white'
      this.buttons[meshIndex].width = (4 * tSize) / window.innerWidth
      this.buttons[meshIndex].height = tSize / window.innerHeight
      this.buttons[meshIndex].onPointerClickObservable.add(function () {
        if (e.isEnabled()) {
          e.setEnabled(false)
        } else {
          e.setEnabled(true)
        }
      })
      advancedTexture.addControl(this.buttons[meshIndex])
      meshIndex++
    })
  }
}

export { DebugUI }
