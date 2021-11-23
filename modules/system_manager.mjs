import {
  CameraModes,
  AnimManager,
  Star,
  Planet,
  EllipticalTrajectory,
  Ring,
  DebugUI
} from '../exo3d.mjs'

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
    const a = 60 // Semi major axis, because it is a very important parameter, I choose to give it its original name "a"
    const e = 0 // Excentricty, can be anything between 0 included and 1 excluded
    const V_ORIGIN_SUN = new BABYLON.Vector3(-2 * a * e, 0, 0) // Position of the sun, also it is the left focus of the ellipse
    const EARTH_RADIUS = 1

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
      diameter: 30 * EARTH_RADIUS,
      texture: SUN_TEXTURE,
      distanceToParent: 0,
      color: sunColor,
      inclinationAngle: 0, // Inclination and temperature aren't important now, but they're ready for the next features
      temperature: 5000,
      trajectory: new EllipticalTrajectory({ a: 0, e: 0 }, false),
      omega: Math.PI / 8,
      revolutionPeriod: 4,
      originalPosition: V_ORIGIN_SUN,
      showStaticTrajectory: false,
      animatable: this.animManager.animatable
    }

    const planetColor = new BABYLON.Color3(0.5, 0.3, 0.3) // Arbitrary color (brown), not in caps because it will depend on other parameters

    const mercuryOptions = {
      name: 'Mercury',
      diameter: 0.7 * EARTH_RADIUS,
      texture: MERCURY_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      inclinationAngle: 0,
      temperature: 0, // May seem cold, but it's not as cold as my office right now
      trajectory: new EllipticalTrajectory({ a: 0.7 * a, e: 0 }, true),
      omega: -Math.PI,
      revolutionPeriod: 1.5,
      showStaticTrajectory: true,
      animatable: this.animManager.animatable
    }

    const venusOptions = {
      name: 'Venus',
      diameter: 0.8 * EARTH_RADIUS,
      texture: VENUS_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      inclinationAngle: 0,
      temperature: 0,
      trajectory: new EllipticalTrajectory({ a: 0.9 * a, e: 0 }, true),
      omega: -Math.PI,
      revolutionPeriod: 2.7,
      showStaticTrajectory: true,
      animatable: this.animManager.animatable
    }

    const earthOptions = {
      name: 'Earth',
      diameter: 1,
      texture: EARTH_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      inclinationAngle: 0,
      temperature: 0,
      trajectory: new EllipticalTrajectory({ a: a, e: e }, true),
      omega: -Math.PI,
      revolutionPeriod: 3.65,
      showStaticTrajectory: true,
      animatable: this.animManager.animatable
    }

    const moonOptions = {
      name: 'Moon',
      diameter: 0.3 * EARTH_RADIUS,
      texture: MOON_TEXTURE,
      distanceToParent: 2, // Arbitrary position relative to the planet
      color: planetColor, // Satellite does not need a color, only a texture
      inclinationAngle: 0,
      temperature: 0,
      trajectory: new EllipticalTrajectory({ a: 2, e: 0 }, true),
      omega: Math.PI,
      revolutionPeriod: 1,
      showStaticTrajectory: false,
      animatable: this.animManager.animatable
    }

    const marsOptions = {
      name: 'Mars',
      diameter: 0.9 * EARTH_RADIUS,
      texture: MARS_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      inclinationAngle: 0,
      temperature: 0,
      trajectory: new EllipticalTrajectory({ a: 3 * a, e: 0 }, true),
      omega: -Math.PI / 18,
      revolutionPeriod: 7,
      showStaticTrajectory: true,
      animatable: this.animManager.animatable
    }

    const saturnOptions = {
      name: 'Saturn',
      diameter: 12 * EARTH_RADIUS,
      texture: SATURN_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      inclinationAngle: 0,
      temperature: 0,
      trajectory: new EllipticalTrajectory({ a: 10 * a, e: 0 }, true),
      omega: -Math.PI,
      revolutionPeriod: 30,
      showStaticTrajectory: true,
      animatable: this.animManager.animatable
    }

    const RING_TEXTURE = 'resources/saturn_rings.png'
    const ringOptions = {
      diameter: 2.2 * saturnOptions.diameter,
      texture: RING_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      originalPosition: new BABYLON.Vector3(0, 0, 0),
      inclinationAngle: Math.PI / 2 - Math.PI / 48,
      temperature: 0,
      trajectory: new EllipticalTrajectory({ a: 0, e: 0 }, false),
      omega: 0,
      revolutionPeriod: 30,
      showStaticTrajectory: false,
      animatable: this.animManager.animatable
    }

    const jupiterOptions = {
      name: 'Jupiter',
      diameter: 15 * EARTH_RADIUS,
      texture: JUPITER_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      inclinationAngle: 0,
      temperature: 0,
      trajectory: new EllipticalTrajectory({ a: 7 * a, e: e }, true),
      omega: -Math.PI / 18,
      revolutionPeriod: 20,
      showStaticTrajectory: true,
      animatable: this.animManager.animatable
    }

    const uranusOptions = {
      name: 'Uranus',
      diameter: 3 * EARTH_RADIUS,
      texture: URANUS_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      inclinationAngle: 0,
      temperature: 0,
      trajectory: new EllipticalTrajectory({ a: 14 * a, e: e }, true),
      omega: -Math.PI,
      revolutionPeriod: 40,
      showStaticTrajectory: true,
      animatable: this.animManager.animatable
    }

    const neptuneOptions = {
      name: 'Neptune',
      diameter: 3.5 * EARTH_RADIUS,
      texture: NEPTUNE_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      inclinationAngle: 0,
      temperature: 0,
      trajectory: new EllipticalTrajectory({ a: 20 * a, e: e }, true),
      omega: -Math.PI,
      revolutionPeriod: 60,
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

    ring.mesh.parent = saturn.mesh

    /* Change the focus of the planetCamera by entering anything else than
    "earth" for the third parameter of the CameraModes constructor */
    this.cameras = new CameraModes(
      scene,
      sun,
      this.gravitationalSystemPlanets,
      canvas,
      this.animManager.animatable
    )

    /* The light of the scene, it need to come from the star. It also need a
    glow effect applied on the star. */

    this.light = new BABYLON.PointLight('light', V_ORIGIN_SUN)
    this.light.diffuse = sun.color // The color diffused on other objects
    this.light.specular = new BABYLON.Color3.Black() // Avoids white reflections on objects
    this.light.range = 3000 // How far the light affects the scene
    this.light.intensity = 4 // The brightness of the light

    const gl = new BABYLON.GlowLayer('glow', scene)
    gl.intensity = 1.25
    gl.referenceMeshToUseItsOwnMaterial(sun.mesh)

    const SKYBOX_SIZE = 3 // Arbitrary factor for the size of the skybox (quite large at 3 though)
    this.skybox = new BABYLON.PhotoDome('skybox', SKYBOX_TEXTURE, {}, scene)
    this.skybox.scaling = new BABYLON.Vector3(
      SKYBOX_SIZE,
      SKYBOX_SIZE,
      SKYBOX_SIZE
    ) // Need to enlarge the skybox so the user doesn't zoom out into the skybox limit too early
    this.skybox.mesh.checkCollisions = true // Ensures that the user can't go out of the universe (forbidden by physicists)

    this.debugUI = new DebugUI(UI)
  }
}

export { GravitationalSystemManager }
