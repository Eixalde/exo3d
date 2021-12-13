import { convertTemperatureToRGB } from '../exo3d.mjs'
import { AnimManager } from './anim_manager.mjs'

/**
 * About the movement animation : tangents and interpolation. I am using
 * Babylon's animation system with keys. Give it some vectors each linked to a
 * frame (it doesn't have to be an integer though) and it will return a smooth
 * animation between all those vectors. By default, the transition is made
 * linearly, so with eight points in the space, you make an 8-sided polygon
 * path. But we want elliptical trajectories, so either we increase the number
 * of points really high, or we make Babylon transitions a bit more curved. The
 * first option will suffer through any 10000/1 ratio trajectory (meaning there
 * are two trajectories in the same system and one is 10k times larger), so we
 * have to take the second option. Babylon has pre-made functions to interpolate
 * movement between two vectors, given proper parameters and setup. If you
 * provide the tangent of the vector alongside itself and its frame, Babylon
 * automatically uses a Hermite method to curve the transition. So we had to get
 * the tangents in the first place. We calculated them with the Runge-Kutta
 * method, considering the formula for the vector i :
 *
 * (i+1th vector - i-1th vector) / 2*deltaT
 *
 * (deltaT being the time between two keys of animation).
 */

/**
 * Builds a system with a star, several planets and - if existing - their rings
 * and satellites.
 */
class SystemBuilder {
  #scene
  #starOptions
  #planetsOptions
  #ringOptions
  #satelliteOptions

  /**
   * @param {BABYLON.Scene} scene - The current scene.
   * @returns {SystemBuilder}
   */
  setScene(scene) {
    this.#scene = scene
    return this
  }
  /**
   * @param {Object} starOptions - Parameters needed for the creation of a star.
   * @returns {SystemBuilder}
   */
  setStarOptions(starOptions) {
    this.#starOptions = starOptions
    return this
  }

  /**
   * @param {Object} ringOptions - Parameters needed for the creation of a ring.
   * @returns {SystemBuilder}
   */
  setRingOptions(ringOptions) {
    this.#ringOptions = ringOptions
    return this
  }

  /**
   * @param {Object} satelliteOptions - Parameters needed for the creation of a satellite.
   * @returns {SystemBuilder}
   */
  setSatelliteOptions(satelliteOptions) {
    this.#satelliteOptions = satelliteOptions
    return this
  }

  /**
   * @param {Array} planetsOptions - The array of the parameters need for several planets.
   * @returns {SystemBuilder}
   */
  setPlanetsOptions(planetsOptions, simulationTime) {
    this.#planetsOptions = planetsOptions

    /* Every period given in days is adapted relative to the first planet (which
    has the lowest period of revolution). We then multiply it by the
    simulationTime variable, which is the wanted duration of the revolution/spin
    (in seconds) for that first planet. Every other planet will then have its
    revolve/spin period scaled around that simulation time. */
    const FIRST_PLANET_REVOLUTION_PERIOD =
      this.#planetsOptions[0].revolutionPeriod

    this.#starOptions.normalizedSpin =
      (simulationTime * this.#starOptions.spin) / FIRST_PLANET_REVOLUTION_PERIOD

    this.#satelliteOptions.normalizedRevolutionPeriod =
      (simulationTime * this.#satelliteOptions.revolutionPeriod) /
      FIRST_PLANET_REVOLUTION_PERIOD

    this.#planetsOptions.forEach((planetOptions) => {
      planetOptions.normalizedRevolutionPeriod =
        (simulationTime * planetOptions.revolutionPeriod) /
        FIRST_PLANET_REVOLUTION_PERIOD

      planetOptions.normalizedSpin =
        (simulationTime * planetOptions.spin) / FIRST_PLANET_REVOLUTION_PERIOD
    })
    return this
  }

  /**
   * @param {AnimManager.animatable} animatable - Contains every animation of every object.
   * @returns {SystemBuilder}
   */
  setAnimatable(animatable) {
    this.#starOptions.animatable = animatable
    this.#planetsOptions.forEach(
      (planetOptions) => (planetOptions.animatable = animatable)
    )
    this.#ringOptions.animatable = animatable
    this.#satelliteOptions.animatable = animatable
    return this
  }

  /**
   * @param {Object} planetOptions - Parameters needed for the creation of a planet.
   * @returns {SystemBuilder}
   */
  setSatelliteOfPlanet(planetOptions) {
    this.#satelliteOptions.parentName = planetOptions.name
    return this
  }

  /**
   * @param {Object} planetOptions - Parameters needed for the creation of a planet.
   * @returns {SystemBuilder}
   */
  setRingOfPlanet(planetOptions) {
    this.#ringOptions.parentName = planetOptions.name
    return this
  }

  /* NOTE : this method does not consider the fact that there can be more (or
  less) than one satellite and one ring. I will fix this in a future issue. */
  build() {
    const star = new Star(this.#starOptions, this.#scene)
    const planets = new Array(this.#planetsOptions.length)
    const ring = new Ring(this.#ringOptions, this.#scene)
    const satellite = new Planet(this.#satelliteOptions, this.#scene)

    this.#planetsOptions.forEach((planetOptions, idx) => {
      planets[idx] = new Planet(planetOptions, this.#scene)
      if (planetOptions.name === this.#satelliteOptions.parentName) {
        satellite.mesh.parent = planets[idx].mesh
        satellite.mesh.position = new BABYLON.Vector3(
          satellite.distanceToParent,
          0,
          0
        )
        planets[idx].satellites.push(satellite)
      }
      if (planetOptions.name === this.#ringOptions.parentName) {
        ring.mesh.parent = planets[idx].mesh
      }
    })
    return { star: star, planets: planets }
  }
}

/**
 * The base class for any spatial object. It shall not be instantiated as such,
 * because it has no signification otherwise.
 *
 * @member {String} name - The name of the object.
 * @member {number} diameter - The diameter of the object (no units).
 * @member {number} distanceToParent - The distance to any parent object (no units).
 * @member {String} texture - The link for the texture of the object.
 * @member {BABYLON.Color3} color - The color of the object.
 * @member {number} inclinationAngle - The inclination of the object relative to its star (rad).
 * @member {number} temperature - The temperature of the object (K).
 * @member {EllipticalTrajectory} trajectory - The trajectory of the object.
 * @member {number} normalizedSpin - The time needed for the object to revolve around itself (seconds).
 * @member {number} normalizedRevolutionPeriod - The time needed for the object to revolve around its star (seconds).
 */
class SpatialObject {
  /**
   * @param {String} name - The name of the object.
   * @param {number} diameter - The diameter of the object (no units).
   * @param {number} distanceToParent - The distance to any parent object (no units).
   * @param {String} texture - The link for the texture of the object.
   * @param {BABYLON.Color3} color - The color of the object.
   * @param {number} inclinationAngle - The inclination of the object relative to its star (rad).
   * @param {number} temperature - The temperature of the object.
   * @param {EllipticalTrajectory} trajectory - The trajectory of the object.
   * @param {number} normalizedSpin - The time needed for the object to revolve around itself (seconds).
   * @param {number} normalizedRevolutionPeriod - The time needed for the object to revolve around its star (seconds).
   * @param {BABYLON.Vector3} originalPosition - The position the object should appear at.
   * @param {boolean} showStaticTrajectory - Defines if the static trajectory appears or not.
   * @param {BABYLON.Animatable} animatable - Contains all animations.
   * @param {BABYLON.Scene} scene - The current scene.
   */
  constructor(
    {
      name,
      diameter,
      distanceToParent,
      texture,
      color,
      inclinationAngle,
      temperature,
      normalizedSpin,
      trajectory,
      normalizedRevolutionPeriod,
      originalPosition,
      showStaticTrajectory,
      animatable
    },
    scene
  ) {
    this.name = name
    this.diameter = diameter
    this.texture = texture
    this.color = color
    this.temperature = temperature
    this.objectMat = new BABYLON.StandardMaterial(this.name + 'Mat', scene)
    this.objectMat.useLogarithmicDepth = true
    if (texture) {
      this.texture = new BABYLON.Texture(texture, scene)
    }
    this.distanceToParent = distanceToParent
    this.trajectory = trajectory
    this.normalizedSpin = normalizedSpin
    this.normalizedRevolutionPeriod = normalizedRevolutionPeriod
    this.nu = 0
  }

  /**
   * Creates the 'rotate on itself' animation, and the movement animation if the
   * object does move.
   *
   * @param {number} steps - The number of steps required for the animation.
   * @param {BABYLON.Scene} scene - The current scene.
   * @param {boolean} showStaticTrajectory - Defines if the static trajectory appears or not.
   * @constant {number} FRAMERATE - The framerate wanted (30 or 60 if possible).
   */
  buildAnimation(steps, scene, showStaticTrajectory, animatable) {
    const FRAMERATE = 30
    //Checks if the object is supposed to move, eventually creates its movement animation
    if (this.trajectory.canMove) {
      const moveAnimation = new BABYLON.Animation(
        this.name + 'AnimMove',
        'position',
        FRAMERATE,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
      )

      /* NOTE : the staticTrajectory method is supposed to show the actual
      trajectory but many changes in the animation system made it obsolete.
      Despite its name, it is the animationShow method that does this specific
      feature right now, but it needs to be corrected in the future */
      const staticTrajectory = this.trajectory.staticTrajectory(steps, false)
      const animMoveKeys = new Array(staticTrajectory.length)

      const deltaT = (this.normalizedRevolutionPeriod / steps) * FRAMERATE
      const outTangents = new Array(animMoveKeys.length)
      for (const i of animMoveKeys.keys()) {
        const current = i
        const previous = i ? i - 1 : animMoveKeys.length - 2
        const next = i !== animMoveKeys.length - 1 ? i + 1 : 1
        outTangents[current] = new BABYLON.Vector3(
          (staticTrajectory[next].x - staticTrajectory[previous].x) /
            (2 * deltaT),
          0,
          (staticTrajectory[next].z - staticTrajectory[previous].z) /
            (2 * deltaT)
        )
      }
      /* The first vector is always equal to the last vector of the trajectory,
      so we also have to manually set their tangent equal. */
      outTangents[0] = outTangents.at(-1)

      for (const current of animMoveKeys.keys()) {
        animMoveKeys[current] = {
          frame:
            current * (this.normalizedRevolutionPeriod / steps) * FRAMERATE,
          outTangent: outTangents[current],
          inTangent: outTangents[current],
          value: staticTrajectory[current]
        }
      }

      moveAnimation.setKeys(animMoveKeys)

      if (showStaticTrajectory) {
        this.animationShow(moveAnimation, FRAMERATE, scene)
      }

      this.mesh.animations.push(moveAnimation)
    }

    /* The motion direction factor allows to know if the planet has a prograde
    or a retrograde movement. If the spin value is negative, then the
    rotation is retrograde and the factor is equal to 1. Otherwise if it is
    prograde, the factor is equal to -1. */
    const motionDirectionFactor =
      -1 * (Math.abs(this.normalizedSpin) / this.normalizedSpin)
    const rotateAnimation = new BABYLON.Animation(
      this.name + 'AnimRotate',
      'rotation.y',
      FRAMERATE,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    )

    const animRotateKeys = new Array(steps + 1)

    for (const i of animRotateKeys.keys()) {
      animRotateKeys[i] = {
        frame: i * (Math.abs(this.normalizedSpin) / steps) * FRAMERATE,
        value: (i * motionDirectionFactor * 2 * Math.PI) / steps
      }
    }

    rotateAnimation.setKeys(animRotateKeys)
    this.mesh.animations.push(rotateAnimation)

    /* Add the animation of the spatial object to the animatable variable. This
     lets the animation manager affect every animation by accessing animatable. */
    animatable.push(
      scene.beginAnimation(
        this.mesh,
        0,
        this.normalizedRevolutionPeriod * FRAMERATE,
        true
      )
    )
  }

  /**
   * Used to debug animations by showing multiple details, especially interpolation between keys.
   *
   * @param {BABYLON.Animation} animation - The animation of which we want to see the trajectory.
   * @param {number} FRAMERATE - The framerate of the animation.
   * @param {BABYLON.Scene} scene - The Current scene.
   */
  animationShow(animation, FRAMERATE, scene) {
    const nbFrame = this.normalizedRevolutionPeriod * FRAMERATE
    const evalTraj = new Array(1000)

    for (let i = 0; i < evalTraj.length; i++) {
      const curFrame = (nbFrame / (evalTraj.length - 1)) * i
      evalTraj[i] = animation.evaluate(curFrame)
    }

    const actualTraj = new BABYLON.Path3D(evalTraj)
    const actualTrajCurve = actualTraj.getCurve()
    const line = new BABYLON.CreateLines(this.name + 'Trajectory', {
      points: actualTrajCurve,
      scene: scene
    })
    line.color = new BABYLON.Color3(1, 0, 0)
  }

  getVisualDiameter() {
    return this.diameter * this.mesh.scaling.x
  }
}

/**
 * The class used for any star.
 *
 * @extends SpatialObject
 */
class Star extends SpatialObject {
  /**
   * @param {object} spatialObjectParams - The multiple paramaters needed for any spatial object.
   * @param {scene} scene - The current scene.
   */
  constructor(spatialObjectParams, scene) {
    super(spatialObjectParams, scene)
    this.mesh = BABYLON.MeshBuilder.CreateSphere(this.name, {
      diameter: this.diameter,
      updatable: true
    })
    this.mesh.position = new BABYLON.Vector3(this.trajectory.a, 0, 0)
    this.mesh.animations = []
    this.objectMat.diffuseTexture = this.texture // Applies both texture and color, only for the star
    const tempToRGB = convertTemperatureToRGB(this.temperature)
    this.color = new BABYLON.Color3(
      tempToRGB.red,
      tempToRGB.green,
      tempToRGB.blue
    )
    this.objectMat.emissiveColor = this.color
    this.mesh.material = this.objectMat
    this.buildAnimation(
      100,
      scene,
      spatialObjectParams.showStaticTrajectory,
      spatialObjectParams.animatable
    )
  }
}

/**
 * The class used for planets and satellites.
 * @member {Array} satellites - Planet-exclusive member, dedicated to the list of its satellites (if any).
 *
 * @extends SpatialObject
 */
class Planet extends SpatialObject {
  /**
   * @param {object} spatialObjectParams - The multiple paramaters needed for any spatial object.
   * @param {scene} scene - The current scene.
   */
  constructor(spatialObjectParams, scene) {
    super(spatialObjectParams, scene)
    this.mesh = BABYLON.MeshBuilder.CreateSphere(this.name, {
      diameter: this.diameter,
      updatable: true
    })
    this.mesh.position = new BABYLON.Vector3(this.trajectory.a, 0, 0)
    this.mesh.animations = []
    this.satellites = []
    if (this.texture) {
      this.objectMat.diffuseTexture = this.texture // Applies either texture or color to the planet, texture by default (if existing)
    } else {
      this.objectMat.diffuseColor = this.color
    }
    this.mesh.material = this.objectMat
    this.buildAnimation(
      100,
      scene,
      spatialObjectParams.showStaticTrajectory,
      spatialObjectParams.animatable
    )
  }
}

/**
 * The planetary disc support (for objects like Saturn rings e.g.)
 * @extends SpatialObject
 */
class Ring extends SpatialObject {
  /**
   * @param {object} spatialObjectParams - Parameters needed for the creation of a SpatialObject.
   * @param {BABYLON.Scene} scene - The current scene.
   */
  constructor(spatialObjectParams, scene) {
    super(spatialObjectParams, scene)
    this.mesh = BABYLON.CreateDisc('disc', {
      radius: spatialObjectParams.diameter / 2,
      sideOrientation: BABYLON.Mesh.DOUBLESIDE
    })
    this.texture.hasAlpha = true
    this.objectMat.diffuseTexture = this.texture
    this.objectMat.useAlphaFromDiffuseTexture = true // Using the alpha included in the texture (for spaces between rings)
    this.mesh.material = this.objectMat
    this.mesh.rotation.x = spatialObjectParams.inclinationAngle
  }
}

export { Star, Planet, Ring, SystemBuilder }
