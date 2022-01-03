import { SpatialObjectParams } from './spatial_object.mjs'

/**
 * @module CelestialMaths
 * @description About the function 'convertTemperature to RGB' : we found the
 * code on [GitHub](https://github.com/sergiomb2/ufraw/blob/1aec313/ufraw_routines.c#L246-L294).
 *
 * We also refered to the following stackoverflow thread : [Calculate colour temperature in K](https://stackoverflow.com/questions/13975917/calculate-colour-temperature-in-k/13982347#13982347).
 */

const pow = Math.pow
const floor = Math.floor
/**
 * Calculate the RGB coding of a given temperature.
 * @param {Number} temperature - The temperature of a celestial body (in K).
 * @returns {{red: Number, green: Number, blue: Number}} Returns the RGB coding of that temperature (scaled from 0 to 1).
 */
function convertTemperatureToRGB(temperature) {
  const XYZ_to_RGB = [
    [3.24071, -0.969258, 0.0556352],
    [-1.53726, 1.87599, -0.203996],
    [-0.498571, 0.0415557, 1.05707]
  ]
  const RGB = [0, 0, 0]
  let xD
  if (temperature <= 4000) {
    xD =
      0.27475e9 / pow(temperature, 3) -
      0.98598e6 / pow(temperature, 2) +
      1.17444e3 / temperature +
      0.145986
  } else if (temperature <= 7000) {
    xD =
      -4.607e9 / pow(temperature, 3) +
      2.9678e6 / pow(temperature, 2) +
      0.09911e3 / temperature +
      0.244063
  } else {
    xD =
      -2.0064e9 / pow(temperature, 3) +
      1.9018e6 / pow(temperature, 2) +
      0.24748e3 / temperature +
      0.23704
  }
  const yD = -3 * pow(xD, 2) + 2.87 * xD - 0.275

  const CIE_X = xD / yD
  const CIE_Y = 1
  const CIE_Z = (1 - xD - yD) / yD

  RGB.forEach((_, index) => {
    RGB[index] =
      CIE_X * XYZ_to_RGB[0][index] +
      CIE_Y * XYZ_to_RGB[1][index] +
      CIE_Z * XYZ_to_RGB[2][index]
  })
  const rgbMax = Math.max(...RGB)

  RGB.forEach((val, index) => {
    RGB[index] = val / rgbMax
  })

  /* The returned values are mapped from 0 to 1, this is perfect for the
  BABYLON.Color3 we will use, but keep that in mind for the tests. */
  return { red: RGB[0], green: RGB[1], blue: RGB[2] }
}

/**
 * Takes two neighbouring objects (their trajectory and size) and compare them.
 * The result is a scaling factor by which each object can be enlarged so they
 * touch each other.
 * @param {Trajectory} currentObjTraj - The trajectory of the first object we want to make bigger.
 * @param {Trajectory} neighbourObjTraj - The trajectory of the neighbour of the first object.
 * @param {Number} currentObjDiameter - The diameter of the object.
 * @param {Number} neighbourObjDiameter - The diameter of the neighbour.
 * @returns {Number} The scaling factor for the two objects.
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
 * @param {SpatialObjectParams[]} systemCompareParameters - An array of multiple objects containing the parameters for the compareOrbits function.
 * @returns {Number} The smallest scaling ratio to apply to an entire system.
 */
function compareSystemOrbits(systemCompareParameters) {
  const ALL_SCALING_RATIOS = new Array(systemCompareParameters.length)
  for (const [idx, params] of systemCompareParameters.entries()) {
    ALL_SCALING_RATIOS[idx] = compareOrbits(params)
  }
  return Math.min(...ALL_SCALING_RATIOS)
}

/**
 * Convert a duration given in days into years, months and days.
 * @param {Number} daysTotal - Amount of days to convert.
 * @returns {{years: Number, months: Number, days: Number}} Structure with the different parts of the duration.
 */
function daysToDuration(daysTotal) {
  const YEAR_IN_DAYS = 365.25
  const MONTH_IN_DAYS = YEAR_IN_DAYS / 12
  const years = floor(daysTotal / YEAR_IN_DAYS)
  const months = floor((daysTotal % YEAR_IN_DAYS) / MONTH_IN_DAYS)
  const days = floor((daysTotal % YEAR_IN_DAYS) % MONTH_IN_DAYS)
  return { years: years, months: months, days: days }
}

export {
  convertTemperatureToRGB,
  compareOrbits,
  compareSystemOrbits,
  daysToDuration
}
