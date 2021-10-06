import {
  Animations,
  CameraModes,
  AnimManager,
  Star,
  Planet,
} from '../exo3d.mjs'

class GravitationalSystemManager {
  light
  skybox
  constructor(scene, UI, canvas) {
    const V_ORIGIN = new BABYLON.Vector3(0, 0, 0) // Origine du repère
    const TRAJECTORY_RADIUS = 8
    const PRECISION_STEPS = 100

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
      originalPosition: V_ORIGIN,
      inclinationAngle: 0, // inclination and temperature aren't important now, but they're ready for the next features
      temperature: 5000,
    }

    const planetColor = new BABYLON.Color3(0.5, 0.3, 0.3) // Arbitrary color (brown), not in caps because it will depend on other parameters
    const PLANET_POSITION = new BABYLON.Vector3(TRAJECTORY_RADIUS, 0, 0)
    const planetOptions = {
      diameter: 1,
      texture: PLANET_TEXTURE,
      distanceToParent: 0,
      color: planetColor,
      originalPosition: PLANET_POSITION,
      inclinationAngle: 0,
      temperature: 0, // may seem cold, but it's not as cold as my office right now
    }

    const satelliteOptions = {
      diameter: 0.3,
      texture: SATELLITE_TEXTURE,
      distanceToParent: 2, // Arbitrary position relative to the planet
      color: undefined, // satellite does not need a color, only a texture
      originalPosition: undefined, // same for its original position, as it will be modified just as it becomes a child of the planet
      inclinationAngle: 0,
      temperature: 0,
    }

    const star = new Star(starOptions, scene)
    const planet = new Planet(planetOptions, scene)
    const satellite = new Planet(satelliteOptions, scene) // satellite is considered a planet because it has the same parameters right now

    satellite.mesh.parent = planet.mesh
    satellite.mesh.position = new BABYLON.Vector3(
      satellite.distanceToParent,
      0,
      0
    )

    const trajectory = new Array(PRECISION_STEPS + 1) // Il faut compter un point supplémentaire pour fermer la trajectoire

    // TODO : faire une fonction qui calcule n'importe quelle trajectoire elliptique, pas juste un cercle
    for (const i of trajectory.keys()) {
      trajectory[i] = new BABYLON.Vector3(
        TRAJECTORY_RADIUS * Math.cos((Math.PI / (PRECISION_STEPS / 2)) * i),
        0,
        TRAJECTORY_RADIUS * Math.sin((Math.PI / (PRECISION_STEPS / 2)) * i)
      )
    }
    let trajectoryLine = BABYLON.MeshBuilder.CreateLines('trajectory', {
      points: trajectory,
    })
    trajectoryLine.color = new BABYLON.Color4(1, 0, 0, 1)

    // De nouveaux paramètres pourront être ajoutés pour les visuels, comme la température de l'étoile (pour sa couleur) ou la luminosité souhaitée
    const animationParameters = {
      path: trajectory,
      planet: planet,
      satellite: satellite,
      steps: PRECISION_STEPS,
    }

    const anims = new Animations(scene, animationParameters)

    const animManager = new AnimManager(anims.animatable)
    const cameras = new CameraModes(scene, star, planet, canvas)
    UI.addControl(animManager.menu.menuGrid)
    UI.addControl(cameras.menu.menuGrid)

    // Partie lumière/brillance de l'étoile

    this.light = new BABYLON.PointLight('light', V_ORIGIN)
    this.light.diffuse = star.color // Couleur projetée sur les objets autour de l'étoile
    this.light.specular = new BABYLON.Color3.Black() //Empêche les reflets de type "boule de billard"
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
