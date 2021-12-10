/**
 * About the speed management : there used to be only the global speed ratio to
 * control the animations, but this implies that any animation can only be at 2x
 * speed maximum. For planets that have really high revolutions periods compared
 * to the nearest planets, you would see them move extremely slowly. Thus we
 * made a relative speed ratio, that allows to change the speed to larger
 * scales. In particular, the relative speed ratio takes a specific planet and
 * accelerates its movement to make it revolve in a definite amount of time
 * (mostly 5 seconds, see the constant BASE_REVOLUTION_PERIOD in the
 * system_manager). Then, every other planet will have to follow that new
 * reference, i.e. if the Earth revolves in 5 secondes, Mars would take around 9
 * seconds to revolve.
 */

/**
 * The object that manages every animation - their speed in particular.
 *
 * @member {number} globalSpeedRatio - The speed ratio independant of any object.
 * @member {number} relativeSpeedRatio - The speed ratio relative to a specific planet.
 * @member {BABYLON.Animatable} animatable - Contains all animations.
 */
class AnimManager {
  /**
   * @param {Array} planetsOptions - The parameters of the planets in the system.
   * @constant {Object} GENERAL_SPEED_PARAMS - General speed values and labels.
   * @constant {Array} RELATIVE_SPEED_PARAMS - Relative speed values (no labels needed).
   */
  constructor(planetsOptions) {
    this.globalSpeedRatio = 1
    this.relativeSpeedRatio = 1
    this.animatable = []

    const GENERAL_SPEED_PARAMS = [
      { name: 'pause', ratio: 0 },
      { name: 'slow', ratio: 0.5 },
      { name: 'normal', ratio: 1 },
      { name: 'fast', ratio: 2 }
    ]
    const RELATIVE_SPEED_PARAMS = new Array(planetsOptions.length)

    /* Calculates the ratio between the periods of all planets, relative to the
    first one. */
    planetsOptions.forEach((planet, idx) => {
      RELATIVE_SPEED_PARAMS[idx] =
        planet.revolutionPeriod / planetsOptions[0].revolutionPeriod
    })

    GENERAL_SPEED_PARAMS.forEach((speed) => {
      document.querySelector(`.btn-group #${speed.name}`).onclick = () => {
        /* Global and relative speed ratios are interdependant, they need to
        know each other's value when they change individually. This is why they
        are updated, which wasn't the case when only the global existed. */
        this.globalSpeedRatio = speed.ratio
        this.animatable.forEach(
          (anim) => (anim.speedRatio = speed.ratio * this.relativeSpeedRatio)
        )
      }
    })

    const speedSlider = document.querySelector(`.planet-speed`)
    speedSlider.onchange = () => {
      this.relativeSpeedRatio = RELATIVE_SPEED_PARAMS[speedSlider.value]
      this.animatable.forEach(
        (anim) =>
          (anim.speedRatio =
            this.globalSpeedRatio * RELATIVE_SPEED_PARAMS[speedSlider.value])
      )
    }
  }
}

export { AnimManager }
