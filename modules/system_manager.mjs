/**
 * Every "magic number" appearing in the parameters of the planets is actually
 * calculated from data on the different values of every planet (sideral day,
 * revolution period, distance to the sun, size...) You can find the detail of
 * those calculations in [INSERT LINK TO A DOCUMENT WITH THE RIGHT VALUES]
 */

import {
  CameraModes,
  AnimManager,
  Star,
  Planet,
  EllipticalTrajectory,
  Ring,
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
 *
 * @member {BABYLON.PointLight} light - The light source of the planetary system.
 * @member {BABYLON.PhotoDome} skybox - The skybox of the planetary system.
 * @member {CameraModes} cameras - The different cameras we use to watch the system.
 * @member {AnimManager} animManager - The animation manager for all spatial objects.
 * @member {Object} gravitationalSystem - Contains the star and the planets of the system.
 */
class GravitationalSystemManager {
  /**
   * @param {BABYLON.Scene} scene - The current scene.
   * @param {BABYLON.GUI} UI - The global Babylon UI for the application.
   * @param {canvas} canvas - The canvas used by the engine.
   */
  constructor(scene, UI, canvas) {
    /* For exact scale purposes, ASTRONOMICAL_UNIT is equal to the ratio between
    1 AU and the diameter of the Earth. This way, the size of the Earth can be
    set to 1 unit of the Babylon engine. */
    const ASTRONOMICAL_UNIT = 11727.647 // Semi major axis of the Earth
    const e = 0 // Excentricty, can be anything between 0 included and 1 excluded
    const V_ORIGIN_SUN = new BABYLON.Vector3(-2 * ASTRONOMICAL_UNIT * e, 0, 0) // Position of the sun, also it is the left focus of the ellipse
    const EARTH_DIAMETER = 1
    const SIMULATION_TIME = 5 // The length of the revolution relative to a specific planet (in seconds)
    const MOON_REVOLUTION_PERIOD = 27.322
    const SUN_SPIN = 27.28

    // Textures' source : https://www.solarsystemscope.com/textures/
    const SUN_TEXTURE = 'resources/512_sun.jpg'
    const MERCURY_TEXTURE = 'resources/512_mercury.jpg'
    const VENUS_TEXTURE = 'resources/512_venus.jpg'
    const EARTH_TEXTURE = 'resources/512_earth.jpg'
    const MOON_TEXTURE = 'resources/512_moon.jpg'
    const MARS_TEXTURE = 'resources/512_mars.jpg'
    const SATURN_TEXTURE = 'resources/512_saturn.jpg'
    const JUPITER_TEXTURE = 'resources/512_jupiter.jpg'
    const URANUS_TEXTURE = 'resources/512_uranus.jpg'
    const NEPTUNE_TEXTURE = 'resources/512_neptune.jpg'
    const SKYBOX_TEXTURE = 'resources/8k_stars.jpg'

    const sunColor = new BABYLON.Color3(1, 0.6, 0.5) // Arbitrary color (orange), not in caps because it will depend on other parameters
    const sunOptions = {
      name: 'Sun',
      diameter: 109.179 * EARTH_DIAMETER, // Approximative real size of the Sun relative to the Earth
      texture: SUN_TEXTURE,
      distanceToParent: 0,
      color: sunColor,
      eclipticInclinationAngle: 0,
      selfInclinationAngle: 0,
      temperature: 5000, // Kelvin degrees
      trajectory: new EllipticalTrajectory({ a: 0, e: 0 }, false),
      spin: SUN_SPIN,
      normalizedRevolutionPeriod: SUN_SPIN, // Sun does not revolve but it has to specify a value here (could be anything strictly positive)
      originalPosition: V_ORIGIN_SUN,
      showStaticTrajectory: false
    }

    const planetColor = new BABYLON.Color3(0.5, 0.3, 0.3) // Arbitrary color (brown), not in caps because it will depend on other parameters

    const mercuryOptions = {
      name: 'Mercury',
      diameter: 0.383 * EARTH_DIAMETER, // Approximative real size of Mercury relative to the Earth
      texture: MERCURY_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      eclipticInclinationAngle: (7 * PI) / 180,
      selfInclinationAngle: (0.035 * PI) / 180,
      temperature: 0, // May seem cold, but it's not as cold as my office right now
      trajectory: new EllipticalTrajectory(
        { a: 0.387 * ASTRONOMICAL_UNIT, e: 0.206 },
        true
      ),
      revolutionPeriod: 87.969,
      spin: 58.846,
      showStaticTrajectory: true
    }

    const venusOptions = {
      name: 'Venus',
      diameter: 0.95 * EARTH_DIAMETER, // Approximative real size of Venus relative to the Earth
      texture: VENUS_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      eclipticInclinationAngle: (3.395 * PI) / 180,
      selfInclinationAngle: (177.36 * PI) / 180,
      temperature: 0,
      trajectory: new EllipticalTrajectory(
        { a: 0.723 * ASTRONOMICAL_UNIT, e: 0.00678 },
        true
      ),
      revolutionPeriod: 224.667,
      spin: -243.023,
      showStaticTrajectory: true
    }

    const earthOptions = {
      name: 'Earth',
      diameter: EARTH_DIAMETER,
      texture: EARTH_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      eclipticInclinationAngle: 0,
      selfInclinationAngle: (23.437 * PI) / 180,
      temperature: 0,
      trajectory: new EllipticalTrajectory(
        { a: ASTRONOMICAL_UNIT, e: 0.0167 },
        true
      ),
      revolutionPeriod: 365.25,
      spin: 0.997,
      showStaticTrajectory: true
    }

    const moonOptions = {
      name: 'Moon',
      diameter: 0.273 * EARTH_DIAMETER,
      texture: MOON_TEXTURE,
      distanceToParent: 0.00257 * ASTRONOMICAL_UNIT, // Position relative to the Earth
      color: planetColor,
      eclipticInclinationAngle: 0,
      selfInclinationAngle: 0,
      temperature: 0,
      trajectory: new EllipticalTrajectory(
        { a: 0.00257 * ASTRONOMICAL_UNIT, e: 0.0549 },
        true
      ),
      spin: MOON_REVOLUTION_PERIOD,
      revolutionPeriod: MOON_REVOLUTION_PERIOD,
      showStaticTrajectory: false
    }

    const marsOptions = {
      name: 'Mars',
      diameter: 0.533 * EARTH_DIAMETER, // Approximative real size of Mars relative to the Earth
      texture: MARS_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      eclipticInclinationAngle: (1.85 * PI) / 180,
      selfInclinationAngle: (25.19 * PI) / 180,
      temperature: 0,
      trajectory: new EllipticalTrajectory(
        { a: 1.523 * ASTRONOMICAL_UNIT, e: 0.0939 },
        true
      ),
      revolutionPeriod: 686.885,
      spin: 1.026,
      showStaticTrajectory: true
    }

    const jupiterOptions = {
      name: 'Jupiter',
      diameter: 10.973 * EARTH_DIAMETER,
      texture: JUPITER_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      eclipticInclinationAngle: (1.304 * PI) / 180,
      selfInclinationAngle: (3.12 * PI) / 180,
      temperature: 0,
      trajectory: new EllipticalTrajectory(
        { a: 5.203 * ASTRONOMICAL_UNIT, e: 0.0483 },
        true
      ),
      revolutionPeriod: 4332.01,
      spin: 0.414,
      showStaticTrajectory: true
    }

    const saturnOptions = {
      name: 'Saturn',
      diameter: 9.014 * EARTH_DIAMETER,
      texture: SATURN_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      eclipticInclinationAngle: (2.486 * PI) / 180,
      selfInclinationAngle: (26.73 * PI) / 180,
      temperature: 0,
      trajectory: new EllipticalTrajectory(
        { a: 9.537 * ASTRONOMICAL_UNIT, e: 0.0539 },
        true
      ),
      revolutionPeriod: 10754,
      spin: 0.448,
      showStaticTrajectory: true
    }

    const RING_TEXTURE = 'resources/saturn_rings.png'
    const ringOptions = {
      diameter: 2.5 * saturnOptions.diameter,
      texture: RING_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      originalPosition: new BABYLON.Vector3(0, 0, 0),
      eclipticInclinationAngle: PI / 2, // Must stay at PI/2, otherwise the rings would be vertically aligned and not horizontally
      selfInclinationAngle: 0,
      temperature: 0,
      trajectory: new EllipticalTrajectory({ a: 0, e: 0 }, false),
      spin: 100, //Ad hoc value
      revolutionPeriod: 30, //Ad hoc value
      showStaticTrajectory: false
    }

    const uranusOptions = {
      name: 'Uranus',
      diameter: 3.981 * EARTH_DIAMETER,
      texture: URANUS_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      eclipticInclinationAngle: (0.773 * PI) / 180,
      selfInclinationAngle: (97.8 * PI) / 180,
      temperature: 0,
      trajectory: new EllipticalTrajectory(
        { a: 19.189 * ASTRONOMICAL_UNIT, e: 0.0472 },
        true
      ),
      revolutionPeriod: 30698,
      spin: -0.718,
      showStaticTrajectory: true
    }

    const neptuneOptions = {
      name: 'Neptune',
      diameter: 3.865 * EARTH_DIAMETER,
      texture: NEPTUNE_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      eclipticInclinationAngle: (1.77 * PI) / 180,
      selfInclinationAngle: (28.32 * PI) / 180,
      temperature: 0,
      trajectory: new EllipticalTrajectory(
        { a: 30.07 * ASTRONOMICAL_UNIT, e: 0.00859 },
        true
      ),
      revolutionPeriod: 60216,
      spin: 0.671,
      showStaticTrajectory: true
    }

    const allPlanetsOptions = [
      mercuryOptions,
      venusOptions,
      earthOptions,
      marsOptions,
      jupiterOptions,
      saturnOptions,
      uranusOptions,
      neptuneOptions
    ]

    /* The use of a builder is needed because the star and planets need the
    existence of an animManager, but with the new relative speed controls, the
    animManager needs the existence of the planets. The system is therefore
    created in two steps, with most of the essential parameters introduced into
    the builder, then the animManager is created based on those parameters, and
    finally achieving the system by giving the animManager to the planets.  */
    const systemBuilder = new SystemBuilder()
      .setScene(scene)
      .setStarOptions(sunOptions)
      .setRingOptions(ringOptions)
      .setSatelliteOptions(moonOptions)
      .setPlanetsOptions(allPlanetsOptions)
      .setNormalizedPeriods(SIMULATION_TIME)
      .setSystemCenter(V_ORIGIN_SUN)
      .setSatelliteOfPlanet(earthOptions)
      .setRingOfPlanet(saturnOptions)

    this.animManager = new AnimManager(allPlanetsOptions)

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
      mercuryOptions.revolutionPeriod
    )

    this.cameras = new CameraModes(
      scene,
      this.gravitationalSystem.star,
      this.gravitationalSystem.planets,
      canvas,
      ASTRONOMICAL_UNIT
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

    this.light = new BABYLON.PointLight('light', V_ORIGIN_SUN)
    this.light.diffuse = this.gravitationalSystem.star.color // The color diffused on other objects
    this.light.specular = new BABYLON.Color3.Black() // Avoids white reflections on objects
    this.light.range = 5000 * ASTRONOMICAL_UNIT // How far the light affects the scene
    this.light.intensity = 4 // The brightness of the light

    const gl = new BABYLON.GlowLayer('glow', scene)
    gl.intensity = 1
    gl.referenceMeshToUseItsOwnMaterial(this.gravitationalSystem.star.mesh)

    const SKYBOX_SIZE = 37500 // Arbitrary factor for the size of the skybox (quite large at 3 though)
    this.skybox = new BABYLON.PhotoDome('skybox', SKYBOX_TEXTURE, {}, scene)
    this.skybox.scaling = new BABYLON.Vector3(
      SKYBOX_SIZE,
      SKYBOX_SIZE,
      SKYBOX_SIZE
    ) // Need to enlarge the skybox so the user doesn't zoom out into the skybox limit too early
    this.skybox.mesh.checkCollisions = true // Ensures that the user can't go out of the universe (forbidden by physicists)
  }
}

export { GravitationalSystemManager }
