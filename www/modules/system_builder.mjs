import {
	Star,
	Planet,
	Ring,
	Satellite,
	EllipticalTrajectory,
	ASTRONOMICAL_UNIT,
	EXO_TYPES,
} from "../exo3d.mjs"

/**
 * @module SystemBuilder
 * @description A design pattern of a builder, it generates the Spatial Objects contained in the system.
 */

const PI = Math.PI

/**
 * Builds a system with a star, several planets and - if existing - their rings
 * and satellites.
 */
class SystemBuilder {
	#scene
	#defaultOptions
	#systemOptions

	/**
	 * @param {BABYLON.Scene} scene - The current scene.
	 * @returns {SystemBuilder}
	 */
	setScene(scene) {
		this.#scene = scene
		return this
	}

	/**
	 * @param {Object} defaultOptions
	 * @returns {SystemBuilder}
	 */
	setDefaultOptions(defaultOptions) {
		this.#defaultOptions = defaultOptions
		/* Takes the default model of object for each exotype, and gives a default
		value if the selected key has an undefined value or doesn't exist. */
		for (const exotype in EXO_TYPES) {
			if (this.#systemOptions[exotype]) {
				for (const option of this.#systemOptions[exotype]) {
					for (const [key, value] of Object.entries(
						this.#defaultOptions[exotype]
					)) {
						option[key] = option?.[key] ?? value
					}
				}
			}
		}
		return this
	}

	/**
	 * @param {Object} systemOptions - Parameters needed for the creation of a system.
	 * @returns {SystemBuilder}
	 */
	setSystemOptions(systemOptions) {
		this.#systemOptions = {}
		for (const [exotype, options] of Object.entries(systemOptions)) {
			this.#systemOptions[exotype] = new Array(options.length).fill({})

			for (const [idx, option] of options.entries()) {
				this.#systemOptions[exotype][idx] = option
			}
		}
		return this
	}

	/**
	 * @returns {Object} - Returns the internal system options.
	 */
	getSystemOptions() {
		return this.#systemOptions
	}

	/**
	 * @param {Number} simulationTime - The time needed for a given planet to revolve.
	 * @returns {SystemBuilder}
	 */
	normalizeParameters(simulationTime) {
		/* Several modifications are done to the parameters contained in the spObj,
    because they are not in the correct format to be treated by the system
    builder. This includes - but is not limited to - converting degrees to
    radians, creating the trajectory, creating the Babylon color or positioning
    the object. */
		const DEG_TO_RAD = PI / 180
		const EARTH_DIAMETER = 1
		const FIRST_PLANET_REVOLUTION_PERIOD =
			this.#systemOptions[EXO_TYPES.planet][0].revolutionPeriod

		for (const options of Object.values(this.#systemOptions)) {
			for (const spObj of options) {
				const CAN_MOVE = spObj.exo_type !== EXO_TYPES.star
				spObj.trajectory = new EllipticalTrajectory(
					{
						a: spObj.trajectory.a * ASTRONOMICAL_UNIT,
						e: spObj.trajectory.e,
					},
					CAN_MOVE
				)

				spObj.diameter *= EARTH_DIAMETER
				spObj.distanceToParent *= ASTRONOMICAL_UNIT
				spObj.eclipticInclinationAngle *= DEG_TO_RAD
				spObj.selfInclinationAngle *= DEG_TO_RAD

				if (spObj.color) {
					spObj.color = new BABYLON.Color3(
						spObj.color.r,
						spObj.color.g,
						spObj.color.b
					)
				}

				if (spObj.originalPosition) {
					spObj.originalPosition = new BABYLON.Vector3(
						spObj.originalPosition.x,
						spObj.originalPosition.y,
						spObj.originalPosition.z
					)
				}

				/* Periods are normalized based on the revolution of the first planet.
				See the detailed documentation. */
				spObj.normalizedRevolutionPeriod =
					(simulationTime * spObj.revolutionPeriod) /
					FIRST_PLANET_REVOLUTION_PERIOD
				spObj.normalizedSpin =
					(simulationTime * spObj.spin) / FIRST_PLANET_REVOLUTION_PERIOD
			}
		}
		return this
	}

	/**
	 * @param {BABYLON.Vector3} systemCenter - The position of reference for the center of the system.
	 * @returns {SystemBuilder}
	 */
	setSystemCenter(systemCenter) {
		for (const planetOptions of this.#systemOptions[EXO_TYPES.planet]) {
			planetOptions.systemCenter = systemCenter
		}
		return this
	}

	/**
	 * @param {BABYLON.Animatable[]} animatable - Contains every animation of every object.
	 * @returns {SystemBuilder}
	 */
	setAnimatable(animatable) {
		for (const options of Object.values(this.#systemOptions)) {
			for (const spObj of options) {
				spObj.animatable = animatable
			}
		}
		return this
	}

	build() {
		const system = {}
		for (const exotype in EXO_TYPES) {
			system[exotype] = new Array(this.#systemOptions[exotype].length)
			this.#systemOptions[exotype].forEach((spObjOptions, idx) => {
				switch (exotype) {
					case EXO_TYPES.star:
						system[exotype][idx] = new Star(spObjOptions, this.#scene)
						break
					case EXO_TYPES.planet:
						system[exotype][idx] = new Planet(spObjOptions, this.#scene)
						break
					case EXO_TYPES.satellite:
						system[exotype][idx] = new Satellite(spObjOptions, this.#scene)
						this.setParentToObject(
							system[exotype][idx],
							system[EXO_TYPES.planet]
						)
						break
					case EXO_TYPES.rings:
						system[exotype][idx] = new Ring(spObjOptions, this.#scene)
						this.setParentToObject(
							system[exotype][idx],
							system[EXO_TYPES.planet]
						)
						break
				}
			})
		}

		/* NOTE : Several stars can be created but only the first one will be
		treated. More testing is needed to see what may really happen. */
		return {
			star: system[EXO_TYPES.star][0],
			planets: system[EXO_TYPES.planet],
		}
	}

	/**
	 * @param {SpatialObject} spObj - A spatial object that needs a parent.
	 * @param {Planet[]} planetList - A list of the planets in the system.
	 */
	setParentToObject(spObj, planetList) {
		spObj.mesh.parent = planetList.find(
			(planet) => planet.name === spObj.parentName
		).mesh
		spObj.position = new BABYLON.Vector3(spObj.distanceToParent, 0, 0)

		/* If the spatial object is a satellite, we must add it to the list of
		satellites of its planet. */
		if (spObj.exo_type === EXO_TYPES.satellite) {
			planetList
				.find((planet) => planet.name === spObj.parentName)
				.satellites.push(spObj)
		}
	}
}

export { SystemBuilder }
