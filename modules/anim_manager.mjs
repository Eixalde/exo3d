/**
 * @module AnimManager
 * @description About the speed management : there used to be only the global
 * speed ratio to control the animations, but this implies that any animation
 * can only be at 2x speed maximum. For planets that have really high
 * revolutions periods compared to the nearest planets, you would see them move
 * extremely slowly. Thus we made a relative speed ratio, that allows to change
 * the speed to larger scales. In particular, the relative speed ratio takes a
 * specific planet and accelerates its movement to make it revolve in a definite
 * amount of time (mostly 5 seconds, see the constant BASE_REVOLUTION_PERIOD in
 * the system_manager). Then, every other planet will have to follow that new
 * reference, i.e. if the Earth revolves in 5 secondes, Mars would take around 9
 * seconds to revolve.
 */

/**
 * @typedef {Object} PlanetOptions - Initial parameters for a planet (not to confuse with SpatialObjectParams in 'SpatialObject').
 * @property {String} name - The name of the object.
 * @property {Number} diameter - The diameter of the object (no units).
 * @property {Number} distanceToParent - The distance to any parent object (no units).
 * @property {String} texture - The link for the texture of the object.
 * @property {BABYLON.Color3} color - The color of the object.
 * @property {Number} eclipticInclinationAngle - The inclination of the object relative to its star (rad).
 * @property {Number} selfInclinationAngle - The inclination of the object on itself (rad).
 * @property {Number} temperature - The temperature of the object.
 * @property {EllipticalTrajectory} trajectory - The trajectory of the object.
 * @property {Number} spin - The time needed for the object to revolve around itself (seconds).
 * @property {Number} revolutionPeriod - The time needed for the object to revolve around its star (seconds).
 * @property {BABYLON.Vector3} originalPosition - The position the object should appear at.
 * @property {Boolean} showStaticTrajectory - Defines if the static trajectory appears or not.
 */

/**
 * @typedef {Object} ButtonParams
 * @property {String} name - Name of the button.
 * @property {Number} value - Value associated to the button.
 */

/**
 * The object that manages every animation - their speed in particular.
 * @property {Number} globalSpeedRatio - The speed ratio independant of any object.
 * @property {Number} relativeSpeedRatio - The speed ratio relative to a specific planet.
 * @property {BABYLON.Animatable} animatable - Contains all animations.
 */
class AnimManager {
  /**
   * @param {PlanetOptions[]} planetsOptions - The parameters of the planets in the system.
   */
  constructor(planetsOptions) {
    this.globalSpeedRatio = 1
    this.relativeSpeedRatio = 1
    this.animatable = []

    /* General speed values and labels. */
    const GENERAL_SPEED_PARAMS = [
      { name: 'pause', value: 0 },
      { name: 'slow', value: 0.5 },
      { name: 'normal', value: 1 },
      { name: 'fast', value: 2 }
    ]

    /* Relative speed values (no labels needed). */
    const RELATIVE_SPEED_PARAMS = new Array(planetsOptions.length)

    /* Calculates the ratio between the periods of all planets, relative to the
    first one. */
    planetsOptions.forEach((planet, idx) => {
      RELATIVE_SPEED_PARAMS[idx] =
        planet.revolutionPeriod / planetsOptions[0].revolutionPeriod
    })

    const speedSlider = document.querySelector(`.planet-speed`)

    /**
     * Updates the information about the scale of time spent in the simulation.
     * @param {HTMLElement} speedSlider - The slider of the speed relative to a planet.
     */
    const updateSimulationSpeedInfo = (speedSlider) => {
      const idx = speedSlider.value
      const seconds = this.globalSpeedRatio ? 5 / this.globalSpeedRatio : 0
      const pause = seconds ? `` : `(paused)`
      document.querySelector(
        `#relative-speed`
      ).innerHTML = `Speed relative to a planet (current : ${seconds}s /${planetsOptions[
        idx
      ].revolutionPeriod.toFixed(2)} days ${pause})`
    }

    GENERAL_SPEED_PARAMS.forEach((speed) => {
      document.querySelector(`.btn-group #${speed.name}`).onclick = () => {
        /* Global and relative speed ratios are interdependant, they need to
        know each other's value when they change individually. This is why they
        are updated, which wasn't the case when only the global existed. */
        this.globalSpeedRatio = speed.value
        this.animatable.forEach(
          (anim) => (anim.speedRatio = speed.value * this.relativeSpeedRatio)
        )
        updateSimulationSpeedInfo(speedSlider)
      }
    })

    speedSlider.onchange = () => {
      this.relativeSpeedRatio = RELATIVE_SPEED_PARAMS[speedSlider.value]
      this.animatable.forEach(
        (anim) =>
          (anim.speedRatio =
            this.globalSpeedRatio * RELATIVE_SPEED_PARAMS[speedSlider.value])
      )
      updateSimulationSpeedInfo(speedSlider)
    }
  }
}

export { AnimManager }
