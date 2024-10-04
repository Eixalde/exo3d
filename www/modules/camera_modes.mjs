/**
 * @module CameraModes
 */

import { ASTRONOMICAL_UNIT, EARTH_SIZE, Planet } from "../exo3d.mjs"

const PI = Math.PI

/**
 * Manages all cameras and views for the user.
 * @property {BABYLON.ArcRotateCamera} starCamera - A camera focused on the center of the system (the star, mostly).
 * @property {BABYLON.ArcRotateCamera} planetCamera - A camera focused on the planet.
 * @property {BABYLON.UniversalCamera} freeCamera - A camera controlled by the user, can move anywhere in the system.
 * @property {Number} cameraFarSight - The distance the camera needs to see up to.
 */
class CameraModes {
	/**
	 * @param {BABYLON.Scene} scene - The current scene.
	 * @param {Star} star - The star of the system observed.
	 * @param {Planet[]} planets - The group of planets we want to look at.
	 * @param {HTMLElement} canvas - The current canvas.
	 * @param {Number} skyboxSize - The size of the skybox in the scene.
	 */
	constructor(scene, star, planets, canvas, skyboxSize) {
		const HIT_BOX_RADIUS = planets[0].getVisualDiameter()
		const BASE_PLANET = planets[0] // The planet pointed by the planetCamera by default
		// Placing the camera far from the star to see the entire system (2 times the largest trajectory is enough)
		const STAR_CAM_DIST = 2 * planets.at(-1).trajectory.a
		const MIN_SYSTEM_CAM_DIST = 2 * star.getVisualDiameter() // Ad hoc value for the minimum distance of the camera to the system
		const MIN_PLANET_CAM_DIST = 2 * BASE_PLANET.getVisualDiameter() // Ad hoc value for the minimum distance of the camera to the planet

		const DEFAULT_STAR_CAM_ALPHA = -PI / 2
		const DEFAULT_STAR_CAM_BETA = 0

		const DEFAULT_PLANET_CAM_ALPHA = -PI / 2
		const DEFAULT_PLANET_CAM_BETA =
			PI / 2 + BASE_PLANET.eclipticInclinationAngle // Makes the planetCamera parallel to the ecliptic

		/* The farthest distance the camera can see up to. It needs to be at least
    more than the skybox' size, though there is nothing to see beyond it. Twice
    the size is quite enough then. Also, this has to be an attribute and not a
    constant, because the external module xr_launch needs that exact value
    for the XR Camera. */
		this.cameraFarSight = skyboxSize * 2

		/* Represents how much the camera will modify its distance when zooming
    in/out (e.g. 0.1 = 10% of the distance). */
		const CAMERA_WHEEL_PERCENTAGE = 0.01

		// Star-centered camera
		this.starCamera = new BABYLON.ArcRotateCamera(
			"starCamera",
			DEFAULT_STAR_CAM_ALPHA,
			DEFAULT_STAR_CAM_BETA,
			STAR_CAM_DIST,
			star.mesh.position
		)
		this.starCamera.attachControl(canvas, true)
		this.starCamera.maxZ = this.cameraFarSight
		this.starCamera.wheelDeltaPercentage = CAMERA_WHEEL_PERCENTAGE

		// Planet-centered camera
		const PLANET_CAM_DIST = 3 * BASE_PLANET.getVisualDiameter() // Ad hoc value for the placement of the camera

		/* Since the implementation of the spinAxisParent attribute (which holds the
    movement animation), the planetCamera must points to that object. */
		this.planetCamera = new BABYLON.ArcRotateCamera(
			"planetCamera",
			DEFAULT_PLANET_CAM_ALPHA,
			DEFAULT_PLANET_CAM_BETA,
			PLANET_CAM_DIST,
			BASE_PLANET.spinAxisParent.position
		)
		this.planetCamera.parent = BASE_PLANET.revolutionAxisParent
		/* Large angles for the Beta value of planetCamera allows a better placement
    of itself when larger angles are involved (dependant of the planets'
    inclination, in particular). */
		this.planetCamera.lowerBetaLimit = -2 * PI
		this.planetCamera.upperBetaLimit = 2 * PI

		/* Sets the near plane of the camera (no planet shall ever be smaller than
    0.01 so that is the appropriate value). */
		this.planetCamera.minZ = 0.01
		this.planetCamera.maxZ = this.cameraFarSight
		this.planetCamera.wheelDeltaPercentage = CAMERA_WHEEL_PERCENTAGE

		// Free camera

		// TODO : include a tutorial for the controls of the free camera
		// Arbitrary starting point of the free camera
		const FREE_CAM_POS = new BABYLON.Vector3(
			0,
			star.getVisualDiameter(),
			-4 * star.getVisualDiameter()
		)

		this.freeCamera = new BABYLON.UniversalCamera(
			"freeCamera",
			FREE_CAM_POS,
			scene
		)

		/* Mouse wheel can be used to move but it is really slow. I couldn't
    configure it to match the system's scale, so consider using only keys (for
    movement) and mouse drag (for camera orientation). */
		const FREE_CAMERA_SPEED = ASTRONOMICAL_UNIT * 0.1 // Ad hoc value
		const FREE_CAMERA_ANGULAR = 500 // Ad hoc value
		this.freeCamera.inputs.addMouseWheel()
		this.freeCamera.angularSensibility = FREE_CAMERA_ANGULAR
		this.freeCamera.speed = FREE_CAMERA_SPEED
		this.freeCamera.maxZ = this.cameraFarSight

		/* Collisions and movement restrictions for the cameras */
		scene.collisionsEnabled = true
		this.starCamera.lowerRadiusLimit = MIN_SYSTEM_CAM_DIST // Prevents the camera from going into the mesh
		this.planetCamera.lowerRadiusLimit = MIN_PLANET_CAM_DIST // Prevents the camera from going into the mesh
		this.freeCamera.checkCollisions = true
		this.starCamera.checkCollisions = true
		this.freeCamera.ellipsoid = new BABYLON.Vector3(
			HIT_BOX_RADIUS,
			HIT_BOX_RADIUS,
			HIT_BOX_RADIUS
		)
		star.mesh.checkCollisions = true
		BASE_PLANET.mesh.checkCollisions = true

		const allCameras = [this.starCamera, this.planetCamera, this.freeCamera]

		const CAMERA_MODES_LABELS = ["star", "planet", "free"]
		CAMERA_MODES_LABELS.forEach((camLabel, idx) => {
			document.querySelector(`.btn-group #${camLabel}`).onclick = () => {
				if (camLabel !== CAMERA_MODES_LABELS[1]) {
					/* Hides the planet selection menu if any other camera is selected. */
					const collapseNode = document.querySelector(".collapse")
					const collapseElement =
						bootstrap.Collapse.getOrCreateInstance(collapseNode)
					collapseElement.hide()
					document.getElementById("planet-information").hidden = true
				} else {
					document.getElementById("planet-information").hidden = false
					this.fillPlanetInformation(planets)
				}
				this.changeCameraMode(allCameras[idx], scene, allCameras, canvas)
			}
		})

		const PLANET_CAMERA_LABELS = new Array(planets.length)
		planets.forEach((planet, idx) => {
			PLANET_CAMERA_LABELS[idx] = planet.name
		})
		for (const camLabel of PLANET_CAMERA_LABELS) {
			document.querySelector(`.controls #${camLabel}`).onclick = () => {
				if (scene.activeCamera !== this.planetCamera) {
					return
				}

				this.changeCameraToNearbyPlanet(camLabel, PLANET_CAMERA_LABELS, planets)
			}
		}
	}

	/**
	 * Switches the view between the system, any planet of a free view.
	 * @param {BABYLON.Camera} toCamera - The camera we want to switch to.
	 * @param {BABYLON.Scene} scene - The current scene.
	 * @param {BABYLON.Camera[]} allCameras - All the cameras in the scene.
	 * @param {HTMLElement} canvas - The canvas of the page.
	 */
	changeCameraMode(toCamera, scene, allCameras, canvas) {
		// We do something only if the selected camera isn't the already active one
		if (scene.activeCamera === toCamera) {
			return
		}

		if (toCamera === this.freeCamera) {
			toCamera.position = scene.activeCamera.position
			toCamera.target = scene.activeCamera.target
		}

		for (const cam of allCameras) cam.detachControl() // Locking all cameras controls
		scene.activeCamera = toCamera // Switching the active camera to the selected one
		toCamera.attachControl(canvas, true) // Giving controls for the selected camera only
	}

	/**
	 *
	 *  @param {Planet[]} planets - All the planets of the system.
	 */
	fillPlanetInformation(planets) {
		let currentPlanet = {
			name: "",
			revolutionPeriod: 0,
			spin: 0,
			diameter: 0,
			distanceToSun: 0,
		}
		for (const planet of planets) {
			if (this.planetCamera.parent === planet.revolutionAxisParent) {
				currentPlanet = {
					name: planet.name,
					revolutionPeriod: planet.revolutionPeriod,
					spin: planet.spin,
					diameter: planet.diameter * EARTH_SIZE,
					distanceToSun: planet.trajectory.a / ASTRONOMICAL_UNIT,
				}
			}
		}
		document.querySelector("#planet-name").innerHTML = currentPlanet.name
		document.querySelector("#planet-diameter").innerHTML =
			currentPlanet.diameter.toFixed(0)
		document.querySelector("#planet-rotation").innerHTML =
			currentPlanet.spin.toFixed(2)
		document.querySelector("#planet-revolution").innerHTML =
			currentPlanet.revolutionPeriod.toFixed(2)
		document.querySelector("#planet-distance").innerHTML =
			currentPlanet.distanceToSun.toFixed(4)
	}

	/**
	 * Changes the focus of the planet camera, switching to any planet selected by
	 * the user.
	 * @param {String} btnLabel - The name of the button.
	 * @param {String[]} planetCamLabels - The name of all buttons related to planet camera.
	 * @param {Planet[]} planets - All the planets of the system.
	 */
	changeCameraToNearbyPlanet(btnLabel, planetCamLabels, planets) {
		// Checking which button was clicked
		const idx = planetCamLabels.findIndex((label) => label === btnLabel)
		const nextPlanet = planets[idx]
		const SPAWN_RADIUS_FACTOR = 3 // Ad hoc value for the placement of the cameras (in diameters of object)
		const LOWER_RADIUS_FACTOR = 2 // Ad hoc value for the minimum distance of the camera to the object (in diameters of object)

		/* Takes the planet as the new focus, also transfers the camera in the same
    plane as the planet by attaching it to its revolutionAxisParent (see
    SpatialObject for plane-related explanations). Since the implementation of
    the spinAxisParent attribute (which holds the movement animation), the
    planetCamera must points to that object instead. */
		this.planetCamera.target = nextPlanet.spinAxisParent.position
		this.planetCamera.parent = nextPlanet.revolutionAxisParent
		this.planetCamera.radius =
			SPAWN_RADIUS_FACTOR * nextPlanet.getVisualDiameter()
		this.planetCamera.lowerRadiusLimit =
			LOWER_RADIUS_FACTOR * nextPlanet.getVisualDiameter()

		/* Following lines place the camera in a way that makes it parallel to the
    ecliptic. This allows to see the inclination of the planet. */
		this.planetCamera.alpha = -PI / 2
		this.planetCamera.beta = PI / 2 + nextPlanet.eclipticInclinationAngle
		this.fillPlanetInformation(planets)
	}
}

export { CameraModes }
