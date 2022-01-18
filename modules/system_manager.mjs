/**
 * @module SystemManager
 * @description Every "magic number" appearing in the parameters of the planets is actually
 * calculated from data on the different values of every planet (sideral day,
 * revolution period, distance to the sun, size...) You can find the detail of
 * those calculations in the [detailed documentation]().
 */

import {
  CameraModes,
  AnimManager,
  EllipticalTrajectory,
  DebugUI,
  ScalingControls,
  addPlanetRadioButtons,
  modifyPlanetSpeedSlider,
  NumberOfDaysUpdater,
  SystemBuilder
} from '../exo3d.mjs'

const PI = Math.PI

/**
 * The handler for any gravitational system. It instantiates every spatial
 * object, the cameras, the background and the light.
 * @property {BABYLON.PointLight} light - The light source of the planetary system.
 * @property {BABYLON.PhotoDome} skybox - The skybox of the planetary system.
 * @property {CameraModes} cameras - The different cameras we use to watch the system.
 * @property {AnimManager} animManager - The animation manager for all spatial objects.
 * @property {Object} gravitationalSystem - Contains the star and the planets of the system.
 *  @property {Star} gravitationalSystem.star - The star of the system.
 *  @property {Planet[]} gravitationalSystem.planets - The list of planets of the system.
 */
class GravitationalSystemManager {
  constructor() {}

  /**
   * Initializes the gravitational system. Because of JSON files, we have to use
   * some `await` with it : thus the async function. Everything in there used to
   * be the constructor actually, but JSONs really messed up the whole
   * application. For God sake, it shouldn't be that hard to read compatible
   * local objects, fix JavaScript please.
   * @param {BABYLON.Scene} scene - The current scene.
   * @param {HTMLElement} canvas - The canvas used by the engine.
   */
  async initialize(scene, canvas) {
    /* For exact scale purposes, ASTRONOMICAL_UNIT is equal to the ratio between
    1 AU and the diameter of the Earth. This way, the size of the Earth can be
    set to 1 unit of the Babylon engine. */
    const ASTRONOMICAL_UNIT = 11727.647 // Semi major axis of the Earth
    const e = 0 // Excentricty, can be anything between 0 included and 1 excluded
    const V_ORIGIN = new BABYLON.Vector3(-2 * ASTRONOMICAL_UNIT * e, 0, 0) // Position of the sun, also it is the left focus of the ellipse
    const EARTH_DIAMETER = 1
    const SIMULATION_TIME = 5 // The length of the revolution relative to a specific planet (in seconds)

    // Textures' source : https://www.solarsystemscope.com/textures/
    const SKYBOX_TEXTURE = 'resources/8k_stars.jpg'

    const starColor = new BABYLON.Color3(1, 0.6, 0.5) // Arbitrary color (orange)

    const planetColor = new BABYLON.Color3(0.5, 0.3, 0.3) // Arbitrary color (brown), not in caps because it will depend on other parameters
    const DEG_TO_RAD = PI / 180

    const SYSTEM_JSON_NAME = 'solar_system'

    const systemOptions = {
      star: undefined,
      planets: [],
      satellites: [],
      rings: []
    }

    /* Gets the system's spatial objects contained in the JSON file. */
    const systemJson = await fetch(`../system_json/${SYSTEM_JSON_NAME}.json`)
      .then((response) => response.json())
      .then((data) => {
        return data.system
      })

    /* Adds or completes data comprised in the spatial objects, and sort them by
    exo type (star, planet, satellite or ring). */
    for (const [_, spObj] of Object.entries(systemJson)) {
      const CAN_MOVE = spObj.exo_type === `star` ? false : true
      spObj.trajectory = new EllipticalTrajectory(
        {
          a: spObj.trajectory.a * ASTRONOMICAL_UNIT,
          e: spObj.trajectory.e
        },
        CAN_MOVE
      )
      spObj.diameter *= EARTH_DIAMETER
      spObj.distanceToParent *= ASTRONOMICAL_UNIT
      spObj.eclipticInclinationAngle *= DEG_TO_RAD
      spObj.selfInclinationAngle *= DEG_TO_RAD

      switch (spObj.exo_type) {
        case 'star':
          spObj.originalPosition = new BABYLON.Vector3(
            spObj.originalPosition.x,
            spObj.originalPosition.y,
            spObj.originalPosition.z
          )
          spObj.color = starColor
          systemOptions.star = spObj
          break
        case 'planet':
          spObj.color = planetColor
          systemOptions.planets.push(spObj)
          break
        case 'satellite':
          systemOptions.satellites.push(spObj)
          break
        case 'ring':
          spObj.originalPosition = new BABYLON.Vector3(
            spObj.originalPosition.x,
            spObj.originalPosition.y,
            spObj.originalPosition.z
          )
          systemOptions.rings.push(spObj)
      }
    }

    /* Sorts planets by their semi-major axis, lowest to highest. This is
    especially important because every module interacting with planets needs
    them to be in ascending order in the system. */
    systemOptions.planets.sort((x, y) => {
      return x.trajectory.a - y.trajectory.a
    })

    /* The use of a builder is needed because the star and planets need the
    existence of an animManager, but with the new relative speed controls, the
    animManager needs the existence of the planets. The system is therefore
    created in two steps, with most of the essential parameters introduced into
    the builder, then the animManager is created based on those parameters, and
    finally achieving the system by giving the animManager to the planets.  */
    const systemBuilder = new SystemBuilder()
      .setScene(scene)
      .setStarOptions(systemOptions.star)
      .setRingOptions(systemOptions.rings[0])
      .setSatelliteOptions(systemOptions.satellites[0])
      .setPlanetsOptions(systemOptions.planets)
      .setNormalizedPeriods(SIMULATION_TIME)
      .setSystemCenter(V_ORIGIN)
      .setSatelliteOfPlanet(systemOptions.planets[2])
      .setRingOfPlanet(systemOptions.planets[5])

    this.animManager = new AnimManager(systemOptions.planets)

    systemBuilder.setAnimatable(this.animManager.animatable)

    /* gravitationalSystem itself has two fields : the Star 'star' and the array
    of Planet 'planets' */
    this.gravitationalSystem = systemBuilder.build()

    /* HTML modifier methods to implement planets' based controls. */
    addPlanetRadioButtons(this.gravitationalSystem.planets)
    modifyPlanetSpeedSlider(this.gravitationalSystem.planets)
    new NumberOfDaysUpdater(
      this.animManager,
      SIMULATION_TIME,
      systemOptions.planets[0].revolutionPeriod
    )

    /* Makes the skybox 25 times larger than the largest trajectory of the
    system. Keep in mind that `a` is the semi-major axis which is only half the
    width of the ellipse. */
    const farthestTrajectoryWidth =
      2 * this.gravitationalSystem.planets.at(-1).trajectory.a
    const SKYBOX_SIZE = 25 * farthestTrajectoryWidth
    this.skybox = new BABYLON.PhotoDome(
      'skybox',
      SKYBOX_TEXTURE,
      { size: SKYBOX_SIZE },
      scene
    )
    this.skybox.mesh.checkCollisions = true // Ensures that the user can't go out of the universe (forbidden by physicists)
    this.skybox.mesh.material.useLogarithmicDepth = true // Avoids "holes" in the skybox when reaching large sizes

    this.cameras = new CameraModes(
      scene,
      this.gravitationalSystem.star,
      this.gravitationalSystem.planets,
      canvas,
      ASTRONOMICAL_UNIT,
      SKYBOX_SIZE
    )

    this.scalingControls = new ScalingControls(
      {
        planets: this.gravitationalSystem.planets,
        star: this.gravitationalSystem.star,
        cameras: [this.cameras.planetCamera, this.cameras.starCamera]
      },
      scene
    )

    /* The light of the scene, it need to come from the star. It also need a
    glow effect applied on the star. */

    this.light = new BABYLON.PointLight('light', V_ORIGIN)
    this.light.diffuse = this.gravitationalSystem.star.color // The color diffused on other objects
    this.light.specular = new BABYLON.Color3.Black() // Avoids white reflections on objects
    this.light.range = 5000 * ASTRONOMICAL_UNIT // How far the light affects the scene
    this.light.intensity = 4 // The brightness of the light

    const gl = new BABYLON.GlowLayer('glow', scene)
    gl.intensity = 0.5
    gl.blurKernelSize = 48

    /* For occlusion reasons - to ensure that glowing objects are correctly
    rendered relative to the not-glowing objects - we include every planet in
    the glow effect as well as the star itself. */
    gl.addIncludedOnlyMesh(this.gravitationalSystem.star.mesh)
    this.gravitationalSystem.planets.forEach((planet) => {
      gl.addIncludedOnlyMesh(planet.mesh)
    })
  }
}

export { GravitationalSystemManager }
