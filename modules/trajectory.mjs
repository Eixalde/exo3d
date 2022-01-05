const sin = Math.sin
const cos = Math.cos
const pow = Math.pow
const sqrt = Math.sqrt
const abs = Math.abs
/**
 * @module Trajectory
 * @description The trajectory is mainly focused around its component called
 * 'staticTrajectory'. This represents what the user will see of the trajectory
 * in general : its path. For the most part, the SpatialObject handles well the
 * imprecision of the defined, limited amount of points in the trajectory (by
 * making interpolations). But the actual representation cannot use any of that,
 * it has to use straight lines between a strict amount of points. This wasn't
 * an issue when the precision was barely respected, but it became a real
 * problem when we started to scale the system at really high distances. So our
 * almost perfect circles got back to what they actually are : ugly polygones.
 * We needed to improve the precision without calculating a trillion of points,
 * so we had an idea : short interpolation at short scale. When we look at one
 * specific object (and only that one), we add points between the pre-existing
 * ones, we make one of those points follow the SpatialObject while they're near
 * from each other, and we re-draw the line of the trajectory to include that
 * point. This isn't still really precise, but it is visually way better than
 * before - where the trajectory not matching the actual movement of the object
 * was genuinely the only thing you would notice.
 */

/**
 * An object that mathematically represents an elliptical trajectory. It also
 * provides functions to compute single positions on this trajectory, and ways
 * to show them to the user.
 * @property {Number} a - The semi-major axis.
 * @property {Number} e - The excentricity.
 * @property {Number} b - The semi-minor axis.
 * @property {Boolean} canMove - States if the object attached to the trajectory can move or not.
 * @property {BABYLON.Vector3[]} staticTrajectory - The actual representation of the trajectory in the simulation.
 */
class EllipticalTrajectory {
  /**
   * @param {Number} a
   * @param {Number} e
   * @param {Boolean} canMove
   */
  constructor({ a, e }, canMove) {
    const STATIC_TRAJECTORY_LENGTH = 100
    this.a = a
    this.e = e
    this.canMove = canMove
    if (canMove) {
      this.b = sqrt(pow(this.a, 2) * (1 - pow(this.e, 2)))
    }
    this.staticTrajectory = this.buildStaticTrajectory(STATIC_TRAJECTORY_LENGTH)
  }

  /**
   * Computes a position (on the ellipse) based on the true anomaly.
   *
   * @param {Number} nu - The true anomaly : angle between the direction of
   * periapsis and the position, as seen from the main focus of the ellipse.
   * @return {{x: Number, y: Number, r: Number}} The coordinates of a 2D-point and its distance to the focus.
   */
  positionWithNu(nu) {
    const r = this.a * ((1 - pow(this.e, 2)) / (1 + this.e * cos(nu)))
    return {
      x: r * cos(nu),
      y: r * sin(nu),
      r: r
    }
  }

  /**
   * Creates a static trajectory.
   *
   * @param {Number} steps - Number of points to use.
   * @return {Array} The 3D-points contained in the static trajectory.
   */
  buildStaticTrajectory(steps) {
    const stTraj = new Array(steps + 1)

    for (const i of stTraj.keys()) {
      stTraj[i] = new BABYLON.Vector3(
        this.positionWithNu((2 * i * Math.PI) / steps).x,
        0,
        this.positionWithNu((2 * i * Math.PI) / steps).y
      )
    }
    return stTraj
  }

  /**
   * Creates lines to approach the real trajectory of the object.
   * @param {BABYLON.Animatable[]} animatable - The animation of which we want to see the trajectory.
   * @param {Number} framerate - The framerate of the animation.
   * @param {BABYLON.Scene} scene - The current scene.
   * @param {SpatialObject} spObj - The spatial object of reference for the trajectory.
   */
  showStaticTrajectory(animatable, framerate, scene, spObj) {
    const SHOW_STAT_TRAJ_LENGTH = 1000
    const evalTraj = this.buildStaticTrajectory(SHOW_STAT_TRAJ_LENGTH)
    let line = new BABYLON.CreateLines(`${spObj.name}Trajectory`, {
      points: evalTraj,
      scene: scene,
      updatable: true
    })
    line.color = new BABYLON.Color3(1, 0, 0)

    /* Allows the static trajectory to tilt alongside the real trajectory of the
    planet (see setEclipticInclination in spatial_object). */
    line.parent = spObj.revolutionAxisParent

    /* Updates the trajectory to make it more precise when looking at its
    specific object. See the detailled documentation for more explanations. */
    scene.registerBeforeRender(() => {
      let isPointedToPlanet = () =>
        scene.activeCamera.target === spObj.spinAxisParent.position
      let isInRealisticView = () => abs(spObj.mesh.scaling.x - 1) < 0.001
      if (isPointedToPlanet() && isInRealisticView()) {
        let currentFrame =
          animatable[spObj.animatableIndex].getAnimations()[0].currentFrame
        this.fixStaticTrajectory(
          scene,
          spObj,
          currentFrame,
          framerate,
          evalTraj,
          line
        )
      }
    })
  }

  /**
   * Adds more precision to the static trajectory line by artificially moving
   * some points alongside its spatial object.
   * @param {BABYLON.Scene} scene - The current scene.
   * @param {SpatialObject} spObj - The spatial object associated to the static trajectory.
   * @param {Number} curFrame - The current frame of the animation of the spatial object.
   * @param {Number} framerate - The framerate of the animation.
   * @param {BABYLON.Vector3[]} stTraj - The points of the static trajectory.
   * @param {BABYLON.LinesMesh} line - The line representing the static trajectory.
   */
  fixStaticTrajectory(scene, spObj, curFrame, framerate, stTraj, line) {
    /* Calculates where the object is on its revolution (scaled from 0 to 1). */
    const REVOLUTION_RATIO =
      curFrame / (spObj.normalizedRevolutionPeriod * framerate)

    /* Matches the position with the nearest point of the static trajectory. */
    const idx = Math.floor(REVOLUTION_RATIO * (stTraj.length - 1))

    /* We only move half the points so we choose exclusively odd numbered indexes. */
    const halfPointIndex = idx % 2 === 1 ? idx : idx + 1

    /* Copy the points to reset the trajectory once the object moves further. */
    const stTrajCpy = stTraj.slice()

    /* Places the wanted point exactly on the planet, and updates the line. */
    stTrajCpy[halfPointIndex] = spObj.spinAxisParent.position
    line = BABYLON.CreateLines(null, {
      points: stTrajCpy,
      updatable: true,
      instance: line,
      scene: scene
    })
  }
}

export { EllipticalTrajectory }
