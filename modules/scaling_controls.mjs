import { compareOrbits, compareSystemOrbits } from '../exo3d.mjs'

/**
 * Provides an asymetric scaling for all objects in the system, making the
 * planets bigger (still at scale with each other) and then applying a different
 * scaling to the star. This allows to see effectively all planets from a large
 * perspective. Most of this class consists of the transition for all scaled
 * objects, so they can grow/shrink gradually.
 *
 * @member {Array} systemCompareParameters - The set of parameters needed for every comparison between planets.
 */
class ScalingControls {
  /**
   * @param {Array} planets - The set of all planets in the system.
   * @param {Star} star - The star of the system.
   * @param {Array} cameras - Some of the cameras used in the scene.
   * @param {BABYLON.Scene} scene - The current scene.
   */
  constructor({ planets, star, cameras }, scene) {
    this.systemCompareParameters = new Array(planets.length - 1)

    /* Takes every object but the last one, and get its trajectory and size as
		well as those from its direct neighbour */
    for (const idx of this.systemCompareParameters.keys()) {
      this.systemCompareParameters[idx] = {
        currentObjTraj: planets[idx].trajectory,
        neighbourObjTraj: planets[idx + 1].trajectory,
        currentObjDiameter: planets[idx].diameter,
        neighbourObjDiameter: planets[idx + 1].diameter
      }
    }

    /* A factor of 1 in front of compareSystemOrbits means at least two objects
		will touch each other. 0.5 is quite fine for the solar system. */
    const PLANET_SCALING_FACTOR =
      0.5 * compareSystemOrbits(this.systemCompareParameters)

    /* Stars need a special treatment because they can be static (and they're
		also often much bigger than any other planet in their system). We let the
		star expand as much as possible, until they hit the new size of the first
		planet. A fake trajectory is necessary to avoid making a dedicated function
		for the stars (see the detailled documentation). */
    let fakeFirstPlanetTrajectory = planets[0].trajectory
    fakeFirstPlanetTrajectory.a -=
      (planets[0].diameter * PLANET_SCALING_FACTOR) / 2

    /* Makes the sun takes up to 90% of the space between itself and the first
    planet. */
    const STAR_SCALING_FACTOR =
      0.9 *
      compareOrbits({
        currentObjTraj: star.trajectory,
        neighbourObjTraj: fakeFirstPlanetTrajectory,
        currentObjDiameter: star.diameter,
        neighbourObjDiameter: 0
      })

    /* Triggering scaling functions with the buttons */

    const SCALING_CONTROLS_LABELS = ['realistic', 'didactic']
    SCALING_CONTROLS_LABELS.forEach((scalingLabel, idx) => {
      document.querySelector(`.btn-group #${scalingLabel}`).onclick = () => {
        /* Hiding satellites when entering didactic scaling. */
        planets.forEach((planet) => {
          planet.satellites.forEach((satellite) => {
            satellite.mesh.isVisible = 1 - idx
          })
        })

        /* HACK : the formula used below allows to handle switching between the
        scaling factors and the normal scaling of 1. When the realistic view is
        active, idx is equal to 0, so (0 times factors + (1 - 0)) = 1. When the
        didactic view is active instead, idx is now equal to 1 so (1 times
        factors + (1 - 1)) = factors. This prevents using if or switch
        statements when using two buttons. */
        const CHANGE_PLANET_FACTOR = idx * PLANET_SCALING_FACTOR + (1 - idx)
        const CHANGE_STAR_FACTOR = idx * STAR_SCALING_FACTOR + (1 - idx)

        /* About the scaling : Babylon has indeed many options for smooth
        transitions, including for mesh scaling purposes. But we had a completly
        new issue, probably never encountered before on Babylon : scaling
        animation can't exist at the same time alongside pre-existing
        animations. Or at least it can't exist on one timeline that works for
        both. Scaling needs to stop when the correct size is reached, but the
        objects have to stay moving and rotating ! After spending a lot of time
        thinking about animations tweaks, we came to the conclusion that it is
        impossible to introduce a new transient animation for scaling without
        erasing/breaking all the permanent movement & rotation animations. This
        is why we use periodic timeouts instead. */

        const SCALING_TRANSITION_LENGTH = 1000 // Number of steps for the scaling "animation"
        const SCALING_PLANET_STEP =
          (CHANGE_PLANET_FACTOR - planets[0].mesh.scaling.x) /
          SCALING_TRANSITION_LENGTH
        const SCALING_STAR_STEP =
          (CHANGE_STAR_FACTOR - star.mesh.scaling.x) / SCALING_TRANSITION_LENGTH

        /* Sets periodic timeouts over exactly one second, then actually
        increases/decreases the scaling when that timeout is reached. */
        for (let i = 1; i <= SCALING_TRANSITION_LENGTH; i++) {
          const SECOND_IN_MS = 1000 // 1000 ms
          setTimeout(() => {
            planets.forEach((planet) => {
              /* Addition assignment is impossible for Vector3 objects, so it is
              shorter to apply the step to each component individually. */
              planet.mesh.scaling.x += SCALING_PLANET_STEP
              planet.mesh.scaling.y += SCALING_PLANET_STEP
              planet.mesh.scaling.z += SCALING_PLANET_STEP
            })
            star.mesh.scaling.x += SCALING_STAR_STEP
            star.mesh.scaling.y += SCALING_STAR_STEP
            star.mesh.scaling.z += SCALING_STAR_STEP
          }, (SECOND_IN_MS / SCALING_TRANSITION_LENGTH) * i)
        }

        document.querySelector(
          `#starScale`
        ).innerHTML = `${CHANGE_STAR_FACTOR.toFixed(0)}:1`
        document.querySelector(
          `#planetsScale`
        ).innerHTML = `${CHANGE_PLANET_FACTOR.toFixed(0)}:1`

        /* Zooms in/out with the cameras if the scaling changes. This avoids
        being inside the object you are looking at (or very far from it). The
        logic behind the calculation is similar to the earlier one. If the scale
        goes up, you multiply the radius of the cameras by the amount of
        scaling. If it goes down instead, you divide the radius by that same
        scaling value. The animation has to be synced with the scaling, it must
        then be one second long. */

        const FRAMERATE = 60

        const cameraPlanetRadAnimation = new BABYLON.Animation(
          'cameraPlanetRadAnimation',
          'radius',
          FRAMERATE,
          BABYLON.Animation.ANIMATIONTYPE_FLOAT
        )
        const cameraPlanetLRLAnimation = new BABYLON.Animation(
          'cameraPlanetLRLAnimation',
          'lowerRadiusLimit',
          FRAMERATE,
          BABYLON.Animation.ANIMATIONTYPE_FLOAT
        )

        cameraPlanetRadAnimation.setKeys([
          {
            frame: 0,
            value: cameras[0].radius
          },
          {
            frame: FRAMERATE,
            value:
              (cameras[0].radius * CHANGE_PLANET_FACTOR) /
              ((1 - idx) * PLANET_SCALING_FACTOR + idx)
          }
        ])
        cameraPlanetLRLAnimation.setKeys([
          {
            frame: 0,
            value: cameras[0].lowerRadiusLimit
          },
          {
            frame: FRAMERATE,
            value:
              (cameras[0].lowerRadiusLimit * CHANGE_PLANET_FACTOR) /
              ((1 - idx) * PLANET_SCALING_FACTOR + idx)
          }
        ])

        cameras[0].animations = []
        cameras[0].animations.push(cameraPlanetRadAnimation)
        cameras[0].animations.push(cameraPlanetLRLAnimation)
        scene.beginAnimation(cameras[0], 0, FRAMERATE, false)

        const cameraStarRadAnimation = new BABYLON.Animation(
          'cameraStarRadAnimation',
          'radius',
          FRAMERATE,
          BABYLON.Animation.ANIMATIONTYPE_FLOAT
        )
        const cameraStarLRLAnimation = new BABYLON.Animation(
          'cameraStarLRLAnimation',
          'lowerRadiusLimit',
          FRAMERATE,
          BABYLON.Animation.ANIMATIONTYPE_FLOAT
        )

        cameraStarRadAnimation.setKeys([
          {
            frame: 0,
            value: cameras[1].radius
          },
          {
            frame: FRAMERATE,
            value:
              (cameras[1].radius * CHANGE_STAR_FACTOR) /
              ((1 - idx) * STAR_SCALING_FACTOR + idx)
          }
        ])
        cameraStarLRLAnimation.setKeys([
          {
            frame: 0,
            value: cameras[1].lowerRadiusLimit
          },
          {
            frame: FRAMERATE,
            value:
              (cameras[1].lowerRadiusLimit * CHANGE_STAR_FACTOR) /
              ((1 - idx) * STAR_SCALING_FACTOR + idx)
          }
        ])

        cameras[1].animations = []
        cameras[1].animations.push(cameraStarRadAnimation)
        cameras[1].animations.push(cameraStarLRLAnimation)
        scene.beginAnimation(cameras[1], 0, FRAMERATE, false)
      }
    })
  }
}

export { ScalingControls }
