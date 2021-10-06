import { ButtonMenu } from '../exo3d.mjs'

class AnimManager {
  currentAnimRatio
  menu
  // Note : the animatable parameter will be removed when the whole trajectory/animation shift will be effective
  constructor(animatable) {
    this.currentAnimRatio = 1
    const ALL_ANIM_RATIOS = [0, 0.5, 1, 2]

    const EMUL_SPEED_LABELS = {
      menuLabel: "Vitesse de l'animation :", // Nom de l'interface
      buttonLabels: ['Pause', 'Ralenti', 'Normal', 'Accéléré'], // Nom des boutons
    }

    const gridParameters = {
      gridLabels: EMUL_SPEED_LABELS,
      hAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
      vAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
      gridWidth: 0.15,
      gridHeight: 0.1,
      actionOnClick: (btnLabel) => {
        for (const [idx, title] of EMUL_SPEED_LABELS.buttonLabels.entries()) {
          if (title === btnLabel) {
            animatable.speedRatio = ALL_ANIM_RATIOS[idx] // animatable.speedRatio will become 'this.currentAnimRatio' after the shift
          }
        }
      },
    }

    this.menu = new ButtonMenu(gridParameters)
  }
}

export { AnimManager }
