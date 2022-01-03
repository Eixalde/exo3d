const sin = Math.sin
const cos = Math.cos
const pow = Math.pow
const sqrt = Math.sqrt
/**
 * @module Trajectory
 */

/**
 * An object that mathematically represents an elliptical trajectory. It also
 * provides functions to compute single positions on this trajectory.
 * @property {Number} a - The semi-major axis.
 * @property {Number} e - The excentricity.
 * @property {Number} b - The semi-minor axis.
 * @property {Boolean} canMove - States if the object attached to the trajectory can move or not.
 */
class EllipticalTrajectory {
  /**
   * @param {Number} a
   * @param {Number} e
   * @param {Boolean} canMove
   */
  constructor({ a, e }, canMove) {
    this.a = a
    this.e = e
    this.canMove = canMove
    if (canMove) {
      this.b = sqrt(pow(this.a, 2) * (1 - pow(this.e, 2)))
    }
  }

  /**
   * Computes a position (on the ellipse) based on the true anomaly.
   *
   * @param {Number} nu - The true anomaly : angle between the direction of
   * periapsis and the position, as seen from the main focus of the ellipse.
   * @return {{x: Number, y: Number, r: Number}} The coordinates of a 2D-point and its distance to the focus.
   */
  posInNu(nu) {
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
  staticTrajectory(steps) {
    const stTraj = new Array(steps + 1)

    for (const i of stTraj.keys()) {
      stTraj[i] = new BABYLON.Vector3(
        this.posInNu((2 * i * Math.PI) / steps).x,
        0,
        this.posInNu((2 * i * Math.PI) / steps).y
      )
    }

    return stTraj
  }
}

export { EllipticalTrajectory }
