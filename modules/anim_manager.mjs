import { ButtonMenu } from '../exo3d.mjs'

/**
 * The object that manages every animation - their speed in particular.
 *
 * @member {BABYLON.Animatable} animatable - Contains all animations.
 */
class AnimManager {
  /**
   * @constant {Array} ALL_ANIM_RATIOS - The possible speeds for all animations (1 is default, normal speed).
   * @constant {Array} EMUL_SPEED_LABELS - The labels for the button menu.
   * @constant {object} menuParameters - The parameters needed for the button menu.
   */
  constructor() {
    const ALL_ANIM_RATIOS = [0, 0.5, 1, 2] // 0 : pause, 0.5 : half-speed, 1 : normal, 2 : double speed

    const EMUL_SPEED_LABELS = {
      menuLabel: "Vitesse de l'animation :", // Menu name
      buttonLabels: ['Pause', 'Ralenti', 'Normal', 'Accéléré'] // Buttons' name
    }

    this.animatable = []

    const menuParameters = {
      gridLabels: EMUL_SPEED_LABELS,
      hAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
      vAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
      gridWidth: 0.15,
      gridHeight: 0.1,
      actionOnClick: (btnLabel) => {
        const idx = EMUL_SPEED_LABELS.buttonLabels.findIndex(
          (label) => label === btnLabel
        )
        //Puts all animations' speed ratio to the same scale
        this.animatable.forEach(
          (anim) => (anim.speedRatio = ALL_ANIM_RATIOS[idx])
        )
      }
    }

    this.menu = new ButtonMenu(menuParameters)
  }
}

export { AnimManager }
