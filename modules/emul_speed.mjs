/* global BABYLON */

import { generateButtonMenu } from "../modules.mjs"

const emulSpeed = function (scene, UI, animatable) {
  const EMUL_SPEED_LABELS = {
    menuLabel: "Vitesse de l'animation :", // Nom de l'interface
    buttonLabels: ["Pause", "Ralenti", "Normal"], // Nom des boutons
  }

  const ANIMATION_SPEEDS = [0, 0.4, 1]

  const gridParameters = {
    UI: UI,
    gridLabels: EMUL_SPEED_LABELS,
    hAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
    vAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
    gridWidth: 0.15,
    gridHeight: 0.1,
    actionOnClick: (btnLabel) => {
      for (const [idx, title] of EMUL_SPEED_LABELS.buttonLabels.entries()) {
        if (title === btnLabel) {
          animatable.speedRatio = ANIMATION_SPEEDS[idx]
        }
      }
    },
  }

  generateButtonMenu(gridParameters)
}

export { emulSpeed }
