import {
  Animations,
  CameraModes,
  AnimManager,
  Star,
  Planet,
  EllipticalTrajectory
} from '../exo3d.mjs'

class GravitationalSystemManager {
  light
  skybox
  constructor(scene, UI, canvas) {
    const PRECISION_STEPS = 300 // Number of points for the static trajectory
    const a = 8 // Semi major axis, because it is a very important parameter, I choose to give it its original name "a"
    const e = 0 // Excentricty, can be anything between 0 included and 1 excluded
    const b = Math.sqrt(Math.pow(a, 2) * (1 - Math.pow(e, 2))) // Value of b based on a and e
    const V_ORIGIN_STAR = new BABYLON.Vector3(-2 * a * e, 0, 0) // Position of the star, also it is the left focus of the ellipse

    // Textures' source : https://www.solarsystemscope.com/textures/
    // BUG : earth texture is upside down for some reason, need to be fixed but it can wait the fake svg textures fix
    const STAR_TEXTURE = 'resources/2k_sun.svg'
    const PLANET_TEXTURE = 'resources/2k_earth.svg'
    const SATELLITE_TEXTURE = 'resources/2k_moon.jpg'
    const SKYBOX_TEXTURE = 'resources/8k_stars.jpg'

    const starColor = new BABYLON.Color3(1, 0.6, 0.5) // Arbitrary color (orange), not in caps because it will depend on other parameters
    const starOptions = {
      diameter: 2,
      texture: STAR_TEXTURE,
      distanceToParent: 0,
      color: starColor,
      originalPosition: V_ORIGIN_STAR,
      inclinationAngle: 0, // Inclination and temperature aren't important now, but they're ready for the next features
      temperature: 5000
    }

    const planetColor = new BABYLON.Color3(0.5, 0.3, 0.3) // Arbitrary color (brown), not in caps because it will depend on other parameters
    const PLANET_POSITION = new BABYLON.Vector3(a, 0, 0)
    const planetOptions = {
      diameter: 1,
      texture: PLANET_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      originalPosition: PLANET_POSITION,
      inclinationAngle: 0,
      temperature: 0 // May seem cold, but it's not as cold as my office right now
    }

    const satelliteOptions = {
      diameter: 0.3,
      texture: SATELLITE_TEXTURE,
      distanceToParent: 2, // Arbitrary position relative to the planet
      color: undefined, // Satellite does not need a color, only a texture
      originalPosition: undefined, // Same for its original position, as it will be modified just as it becomes a child of the planet
      inclinationAngle: 0,
      temperature: 0
    }

    const star = new Star(starOptions, scene)
    const planet = new Planet(planetOptions, scene)
    const satellite = new Planet(satelliteOptions, scene) // Satellite is considered a planet because it has the same parameters right now

    satellite.mesh.parent = planet.mesh
    satellite.mesh.position = new BABYLON.Vector3(
      satellite.distanceToParent,
      0,
      0
    )

    const trajectory = new EllipticalTrajectory({
      a: a,
      b: b
    })
    const staticTrajectory = trajectory.staticTrajectory(PRECISION_STEPS)

    let trajectoryLine = BABYLON.MeshBuilder.CreateLines('trajectory', {
      points: staticTrajectory
    })
    trajectoryLine.color = new BABYLON.Color3(1, 0, 0)

    const animationParameters = {
      path: staticTrajectory,
      planet: planet,
      satellite: satellite,
      steps: PRECISION_STEPS
    }

    const anims = new Animations(scene, animationParameters)

    const animManager = new AnimManager(anims.animatable)
    const cameras = new CameraModes(scene, star, planet, canvas)
    UI.addControl(animManager.menu.menuGrid)
    UI.addControl(cameras.menu.menuGrid)

    // Partie lumière/brillance de l'étoile

    this.light = new BABYLON.PointLight('light', V_ORIGIN_STAR)
    this.light.diffuse = star.color // Couleur projetée sur les objets autour de l'étoile
    this.light.specular = new BABYLON.Color3.Black() // Empêche les reflets de type "boule de billard"
    this.light.range = 100 // Ce paramètre doit être soigneusement retenu, c'est ce qui permettra d'éclairer - ou pas - les objets éloignés de l'étoile

    const gl = new BABYLON.GlowLayer('glow', scene)
    gl.intensity = 1.25
    gl.referenceMeshToUseItsOwnMaterial(star.mesh)

    const SKYBOX_SIZE = 3 // Arbitrary factor for the size of the skybox (quite large at 3 though)
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
