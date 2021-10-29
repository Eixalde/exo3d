const sin = Math.sin
const cos = Math.cos
const pow = Math.pow
const sqrt = Math.sqrt

/**
 * An object that mathematically represents an elliptical trajectory. It also
 * provides functions to compute single positions on this trajectory.
 *
 * @member {number} a - The semi-major axis.
 * @member {number} e - The excentricity.
 * @member {boolean} canMove - States if the object attached to the trajectory can move or not.
 */
class EllipticalTrajectory {
  /**
   * @param {number} a
   * @param {number} e
   * @param {boolean} canMove
   */
  constructor({ a, e }, canMove) {
    this.a = a
    this.e = e
    this.canMove = canMove
    if (canMove) {
      this.b = sqrt(pow(a, 2) * (1 - pow(e, 2)))
    }
  }

  /**
   * Computes a position (on the ellipse) based on the true anomaly.
   *
   * @param {number} nu - The true anomaly : angle between the direction of
   * periapsis and the position, as seen from the main focus of the ellipse.
   * @constant {number} r - The distance between the focus and the position.
   * @return {object} The coordinates of a 2D-point.
   */
  posInNu(nu) {
    const r = this.a * ((1 - pow(this.e, 2)) / (1 + this.e * cos(nu)))
    return {
      x: r * cos(nu),
      y: r * sin(nu)
    }
  }

  /**
   * Creates a static trajectory.
   *
   * @param {number} steps - Number of points to use.
   * @param {boolean} showTrajectory - Determines if the trajectory is printed or not.
   * @constant {Array} stTraj - The static trajectory.
   * @return {object} The 3D-points contained in the static trajectory.
   */
  staticTrajectory(steps, showTrajectory) {
    const stTraj = new Array(steps + 1)

    for (const i of stTraj.keys()) {
      stTraj[i] = new BABYLON.Vector3(
        this.posInNu((2 * i * Math.PI) / steps).x,
        0,
        this.posInNu((2 * i * Math.PI) / steps).y
      )
    }

    if (showTrajectory) {
      let trajectoryLine = BABYLON.MeshBuilder.CreateLines('trajectory', {
        points: stTraj
      })
      trajectoryLine.color = new BABYLON.Color3(1, 0, 0)
    }

    return stTraj
  }
}

export { EllipticalTrajectory }
