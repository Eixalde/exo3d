/**
 * Takes two neighbouring objects (their trajectory and size) and compare them.
 * The result is a scaling factor by which each object can be enlarged so they
 * touch each other.
 *
 * @param {Trajectory} currentObjTraj - The trajectory of the first object we want to make bigger.
 * @param {Trajectory} neighbourObjTraj - The trajectory of the neighbour of the first object.
 * @param {number} currentObjDiameter - The diameter of the object.
 * @param {number} neighbourObjDiameter - The diameter of the neighbour.
 * @returns {number} - The scaling factor for the two objects.
 */
function compareOrbits({
  currentObjTraj,
  neighbourObjTraj,
  currentObjDiameter,
  neighbourObjDiameter
}) {
  const PRECISION = 100 // Number of points for the comparison of trajectories
  const TRAJECTORIES_DISTANCES = new Array(PRECISION + 1)

  /* We need to estimate where the two trajectories have the smallest distance
  to each other. This will be our reference for making the two planets fill up
  the space between them. To do that, we calculate again the position of the
  points of each trajectory, given the same angle. Then we compare their
  distance to the common focus of their ellipses (the star). */
  for (const i of TRAJECTORIES_DISTANCES.keys()) {
    TRAJECTORIES_DISTANCES[i] = Math.abs(
      currentObjTraj.posInNu((2 * i * Math.PI) / PRECISION).r -
        neighbourObjTraj.posInNu((2 * i * Math.PI) / PRECISION).r
    )
  }

  const SMALLEST_DISTANCE = Math.min(...TRAJECTORIES_DISTANCES)

  /* We return the ratio of that smallest distance to the sum of each object
  radius, thus the 2 factor. */
  return (2 * SMALLEST_DISTANCE) / (currentObjDiameter + neighbourObjDiameter)
}

/**
 * Applies the compareOrbits function to an entire system (star excluded). The
 * result is a factor adapted for the smallest scaling ratio in the system, this
 * way only two planets may touch each other and there is no overlap.
 *
 * @param {Array} systemCompareParameters - An array of multiple objects containing the parameters for the compareOrbits function.
 * @returns {number} - The smallest scaling ratio to apply to an entire system.
 */
function compareSystemOrbits(systemCompareParameters) {
  const ALL_SCALING_RATIOS = new Array(systemCompareParameters.length)
  for (const [idx, params] of systemCompareParameters.entries()) {
    ALL_SCALING_RATIOS[idx] = compareOrbits(params)
  }
  return Math.min(...ALL_SCALING_RATIOS)
}

export { compareOrbits, compareSystemOrbits }
