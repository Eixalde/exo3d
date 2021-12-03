/**
 * The object that manages every animation - their speed in particular.
 *
 * @member {BABYLON.Animatable} animatable - Contains all animations.
 */
class AnimManager {
  /**
   * @constant {Array} ALL_ANIM_RATIOS - The possible speeds for all animations (1 is default, normal speed).
   * @constant {Array} EMUL_SPEED_LABELS - The labels for the button menu.
   */
  constructor() {
    const ALL_ANIM_RATIOS = [0, 0.5, 1, 2] // 0 : pause, 0.5 : half-speed, 1 : normal, 2 : double speed
    this.animatable = []
    const EMUL_SPEED_LABELS = ['pause', 'slow', 'normal', 'fast']
    EMUL_SPEED_LABELS.forEach((speedLabel, idx) => {
      document.querySelector(`.btn-group #${speedLabel}`).onclick = () => {
        this.animatable.forEach(
          (anim) => (anim.speedRatio = ALL_ANIM_RATIOS[idx])
        )
      }
    })
  }
}

export { AnimManager }
