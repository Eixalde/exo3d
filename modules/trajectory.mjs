const sin = Math.sin
const cos = Math.cos

class EllipticalTrajectory {
  a // Semi major axis
  b // Semi minor axis
  e // Excentricity

  /**
   * Create a trajectory.
   * @param {number} a - The semi-major axis.
   * @param {number} b - The semi-minor axis.
   */
  constructor({ a, b }) {
    this.a = a
    this.b = b
    this.e = Math.sqrt(1 - Math.pow(b, 2) / Math.pow(a, 2))
  }

  /**
   * Computes a position (on an ellipse) based on the true anomaly.
   * @param {number} nu - The true anomaly : angle between the direction of periapsis and the position, as seen from the main focus of the ellipse
   * @constant {number} r - The distance between the focus and the position.
   * @return {object} The coordinates of a 2D-point.
   */
  posInNu(nu) {
    const r = this.a * ((1 - Math.pow(this.e, 2)) / (1 + this.e * cos(nu)))
    return {
      x: r * cos(nu),
      y: r * sin(nu)
    }
  }

  /**
   * Creates a static trajectory
   * @param {number} steps - Number of points to use.
   * @constant {Array} stTraj - The static trajectory.
   * @return {object} The 3D-points contained in the static trajectory.
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
