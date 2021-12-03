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
  ScalingControls
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
    const EARTH_REVOLUTION_PERIOD = 365.25 // The length of the Earth revolution (in seconds !!!)
    /* 0.997 / 365.25 is the ratio of a sideral day (in solar days) compared to
    the Earth Revolution (also in solar days). */
    const EARTH_SIDERAL_DAY_DURATION =
      (0.997 / 365.25) * EARTH_REVOLUTION_PERIOD

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

    this.animManager = new AnimManager()

    const sunColor = new BABYLON.Color3(1, 0.6, 0.5) // Arbitrary color (orange), not in caps because it will depend on other parameters
    const sunOptions = {
      name: 'Sun',
      diameter: 109.179 * EARTH_DIAMETER, // Approximative real size of the Sun relative to the Earth
      texture: SUN_TEXTURE,
      distanceToParent: 0,
      color: sunColor,
      inclinationAngle: 0,
      temperature: 5000, // Kelvin degrees
      trajectory: new EllipticalTrajectory({ a: 0, e: 0 }, false),
      rotationPeriod: 27 * EARTH_SIDERAL_DAY_DURATION,
      revolutionPeriod: 27 * EARTH_SIDERAL_DAY_DURATION,
      originalPosition: V_ORIGIN_SUN,
      showStaticTrajectory: false,
      animatable: this.animManager.animatable
    }

    const planetColor = new BABYLON.Color3(0.5, 0.3, 0.3) // Arbitrary color (brown), not in caps because it will depend on other parameters

    const mercuryOptions = {
      name: 'Mercury',
      diameter: 0.383 * EARTH_DIAMETER, // Approximative real size of Mercury relative to the Earth
      texture: MERCURY_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      inclinationAngle: 0,
      temperature: 0, // May seem cold, but it's not as cold as my office right now
      trajectory: new EllipticalTrajectory(
        { a: 0.387 * ASTRONOMICAL_UNIT, e: 0.206 },
        true
      ),
      rotationPeriod: 58.7 * EARTH_SIDERAL_DAY_DURATION,
      revolutionPeriod: 0.241 * EARTH_REVOLUTION_PERIOD,
      showStaticTrajectory: true,
      animatable: this.animManager.animatable
    }

    const venusOptions = {
      name: 'Venus',
      diameter: 0.95 * EARTH_DIAMETER, // Approximative real size of Venus relative to the Earth
      texture: VENUS_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      inclinationAngle: 0,
      temperature: 0,
      trajectory: new EllipticalTrajectory(
        { a: 0.723 * ASTRONOMICAL_UNIT, e: 0.00678 },
        true
      ),
      rotationPeriod: 243 * EARTH_SIDERAL_DAY_DURATION,
      revolutionPeriod: 0.615 * EARTH_REVOLUTION_PERIOD,
      showStaticTrajectory: true,
      animatable: this.animManager.animatable
    }

    const earthOptions = {
      name: 'Earth',
      diameter: EARTH_DIAMETER,
      texture: EARTH_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      inclinationAngle: 0,
      temperature: 0,
      trajectory: new EllipticalTrajectory(
        { a: ASTRONOMICAL_UNIT, e: 0.0167 },
        true
      ),
      rotationPeriod: EARTH_SIDERAL_DAY_DURATION,
      revolutionPeriod: EARTH_REVOLUTION_PERIOD,
      showStaticTrajectory: true,
      animatable: this.animManager.animatable
    }

    const moonOptions = {
      name: 'Moon',
      diameter: 0.273 * EARTH_DIAMETER,
      texture: MOON_TEXTURE,
      distanceToParent: 0.00257 * ASTRONOMICAL_UNIT, // Position relative to the Earth
      color: planetColor,
      inclinationAngle: 0,
      temperature: 0,
      trajectory: new EllipticalTrajectory(
        { a: 0.00257 * ASTRONOMICAL_UNIT, e: 0.0549 },
        true
      ),
      rotationPeriod: 1,
      revolutionPeriod: 0.0748 * EARTH_REVOLUTION_PERIOD,
      showStaticTrajectory: false,
      animatable: this.animManager.animatable
    }

    const marsOptions = {
      name: 'Mars',
      diameter: 0.533 * EARTH_DIAMETER, // Approximative real size of Mars relative to the Earth
      texture: MARS_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      inclinationAngle: 0,
      temperature: 0,
      trajectory: new EllipticalTrajectory(
        { a: 1.523 * ASTRONOMICAL_UNIT, e: 0.0939 },
        true
      ),
      rotationPeriod: 1.029 * EARTH_SIDERAL_DAY_DURATION,
      revolutionPeriod: 1.881 * EARTH_REVOLUTION_PERIOD,
      showStaticTrajectory: true,
      animatable: this.animManager.animatable
    }

    const jupiterOptions = {
      name: 'Jupiter',
      diameter: 10.973 * EARTH_DIAMETER,
      texture: JUPITER_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      inclinationAngle: 0,
      temperature: 0,
      trajectory: new EllipticalTrajectory(
        { a: 5.203 * ASTRONOMICAL_UNIT, e: 0.0483 },
        true
      ),
      rotationPeriod: 0.498 * EARTH_SIDERAL_DAY_DURATION,
      revolutionPeriod: 11.86 * EARTH_REVOLUTION_PERIOD,
      showStaticTrajectory: true,
      animatable: this.animManager.animatable
    }

    const saturnOptions = {
      name: 'Saturn',
      diameter: 9.014 * EARTH_DIAMETER,
      texture: SATURN_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      inclinationAngle: 0,
      temperature: 0,
      trajectory: new EllipticalTrajectory(
        { a: 9.537 * ASTRONOMICAL_UNIT, e: 0.0539 },
        true
      ),
      rotationPeriod: 0.445 * EARTH_SIDERAL_DAY_DURATION,
      revolutionPeriod: 29.44 * EARTH_REVOLUTION_PERIOD,
      showStaticTrajectory: true,
      animatable: this.animManager.animatable
    }

    const RING_TEXTURE = 'resources/saturn_rings.png'
    const ringOptions = {
      diameter: 2.5 * saturnOptions.diameter,
      texture: RING_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      originalPosition: new BABYLON.Vector3(0, 0, 0),
      inclinationAngle: PI / 2 - PI / 48,
      temperature: 0,
      trajectory: new EllipticalTrajectory({ a: 0, e: 0 }, false),
      rotationPeriod: 100,
      revolutionPeriod: 30,
      showStaticTrajectory: false,
      animatable: this.animManager.animatable
    }

    const uranusOptions = {
      name: 'Uranus',
      diameter: 3.981 * EARTH_DIAMETER,
      texture: URANUS_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      inclinationAngle: 0,
      temperature: 0,
      trajectory: new EllipticalTrajectory(
        { a: 19.189 * ASTRONOMICAL_UNIT, e: 0.0472 },
        true
      ),
      rotationPeriod: 0.585 * EARTH_SIDERAL_DAY_DURATION,
      revolutionPeriod: 84.05 * EARTH_REVOLUTION_PERIOD,
      showStaticTrajectory: true,
      animatable: this.animManager.animatable
    }

    const neptuneOptions = {
      name: 'Neptune',
      diameter: 3.865 * EARTH_DIAMETER,
      texture: NEPTUNE_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      inclinationAngle: 0,
      temperature: 0,
      trajectory: new EllipticalTrajectory(
        { a: 30.07 * ASTRONOMICAL_UNIT, e: 0.00859 },
        true
      ),
      rotationPeriod: 0.673 * EARTH_SIDERAL_DAY_DURATION,
      revolutionPeriod: 164.86 * EARTH_REVOLUTION_PERIOD,
      showStaticTrajectory: true,
      animatable: this.animManager.animatable
    }

    const sun = new Star(sunOptions, scene)
    const mercury = new Planet(mercuryOptions, scene)
    const venus = new Planet(venusOptions, scene)
    const earth = new Planet(earthOptions, scene)
    const moon = new Planet(moonOptions, scene) // Satellite is considered a planet because it has the same parameters right now
    const mars = new Planet(marsOptions, scene)
    const saturn = new Planet(saturnOptions, scene)
    const ring = new Ring(ringOptions, scene)
    const jupiter = new Planet(jupiterOptions, scene)
    const uranus = new Planet(uranusOptions, scene)
    const neptune = new Planet(neptuneOptions, scene)

    this.gravitationalSystemPlanets = [
      mercury,
      venus,
      earth,
      mars,
      jupiter,
      saturn,
      uranus,
      neptune
    ]

    moon.mesh.parent = earth.mesh
    moon.mesh.position = new BABYLON.Vector3(moon.distanceToParent, 0, 0)
    earth.satellites.push(moon)

    ring.mesh.parent = saturn.mesh

    /* Change the focus of the planetCamera by entering anything else than
    "earth" for the third parameter of the CameraModes constructor */
    this.cameras = new CameraModes(
      scene,
      sun,
      this.gravitationalSystemPlanets,
      canvas,
      this.animManager.animatable,
      ASTRONOMICAL_UNIT
    )

    this.scalingControls = new ScalingControls(
      {
        planets: this.gravitationalSystemPlanets,
        star: sun,
        cameras: [this.cameras.planetCamera, this.cameras.starCamera]
      },
      scene
    )

    /* The light of the scene, it need to come from the star. It also need a
    glow effect applied on the star. */

    this.light = new BABYLON.PointLight('light', V_ORIGIN_SUN)
    this.light.diffuse = sun.color // The color diffused on other objects
    this.light.specular = new BABYLON.Color3.Black() // Avoids white reflections on objects
    this.light.range = 5000 * ASTRONOMICAL_UNIT // How far the light affects the scene
    this.light.intensity = 4 // The brightness of the light

    const gl = new BABYLON.GlowLayer('glow', scene)
    gl.intensity = 1.25
    gl.referenceMeshToUseItsOwnMaterial(sun.mesh)

    const SKYBOX_SIZE = 37500 // Arbitrary factor for the size of the skybox (quite large at 3 though)
    this.skybox = new BABYLON.PhotoDome('skybox', SKYBOX_TEXTURE, {}, scene)
    this.skybox.scaling = new BABYLON.Vector3(
      SKYBOX_SIZE,
      SKYBOX_SIZE,
      SKYBOX_SIZE
    ) // Need to enlarge the skybox so the user doesn't zoom out into the skybox limit too early
    this.skybox.mesh.checkCollisions = true // Ensures that the user can't go out of the universe (forbidden by physicists)

    const ALL_SPATIAL_OBJECTS = [
      sun,
      mercury,
      venus,
      earth,
      mars,
      jupiter,
      saturn,
      uranus,
      neptune
    ]

    // this.debugUI = new DebugUI(UI, (value) => {
    //   ALL_SPATIAL_OBJECTS.forEach((spObj) => {
    //     spObj.mesh.scaling = new BABYLON.Vector3(value, value, value)
    //   })
    // })
  }
}

export { GravitationalSystemManager }
