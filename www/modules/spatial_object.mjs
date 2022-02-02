import { convertTemperatureToRGB } from '../exo3d.mjs'

/**
 * @module SpatialObject
 * @description About the movement animation : tangents and
 * interpolation. I am using Babylon's animation system with keys. Give it some
 * vectors each linked to a frame (it doesn't have to be an integer though) and
 * it will return a smooth animation between all those vectors. By default, the
 * transition is made linearly, so with eight points in the space, you make an
 * 8-sided polygon path. But we want elliptical trajectories, so either we
 * increase the number of points really high, or we make Babylon transitions a
 * bit more curved. The first option will suffer through any 10000/1 ratio
 * trajectory (meaning there are two trajectories in the same system and one is
 * 10k times larger), so we have to take the second option. Babylon has pre-made
 * functions to interpolate movement between two vectors, given proper
 * parameters and setup. If you provide the tangent of the vector alongside
 * itself and its frame, Babylon automatically uses a Hermite method to curve
 * the transition. So we had to get the tangents in the first place. We
 * calculated them with the Runge-Kutta method, considering the formula for the
 * vector i :
 *
 * (i+1th vector - i-1th vector) / 2*deltaT
 *
 * (deltaT being the time between two keys of animation).
 */

/**
 * @typedef {Object} SpatialObjectParams - Parameters needed for the creation of a SpatialObject.
 * @property {String} name - The name of the object.
 * @property {Number} diameter - The diameter of the object (no units).
 * @property {Number} distanceToParent - The distance to any parent object (no units).
 * @property {String} texture - The link for the texture of the object.
 * @property {BABYLON.Color3} color - The color of the object.
 * @property {Number} eclipticInclinationAngle - The inclination of the object relative to its star (rad).
 * @property {Number} selfInclinationAngle - The inclination of the object on itself (rad).
 * @property {BABYLON.Vector3} systemCenter - The point of reference for the center of the system (for inclination purposes).
 * @property {Number} temperature - The temperature of the object.
 * @property {EllipticalTrajectory} trajectory - The trajectory of the object.
 * @property {Number} normalizedSpin - The time needed for the object to revolve around itself (seconds).
 * @property {Number} normalizedRevolutionPeriod - The time needed for the object to revolve around its star (seconds).
 * @property {BABYLON.Vector3} originalPosition - The position the object should appear at.
 * @property {Boolean} showStatTraj - Defines if the static trajectory appears or not.
 * @property {BABYLON.Animatable[]} animatable - Contains all animations.
 */

/**
 * The base class for any spatial object. It shall not be instantiated as such,
 * because it has no signification otherwise.
 * @property {String} name - The name of the object.
 * @property {Number} diameter - The diameter of the object (no units).
 * @property {Number} distanceToParent - The distance to any parent object (no units).
 * @property {String} texture - The link for the texture of the object.
 * @property {BABYLON.Color3} color - The color of the object.
 * @property {BABYLON.Mesh} mesh - The mesh representing the object.
 * @property {Number} eclipticInclinationAngle - The inclination of the object relative to its star (rad).
 * @property {Number} selfInclinationAngle - The inclination of the object on itself (rad).
 * @property {BABYLON.Vector3} systemCenter -  The point of reference for the center of the system (for inclination purposes).
 * @property {BABYLON.Sphere} revolutionAxisParent - The object that allow inclination on the ecliptic plane.
 * @property {BABYLON.Sphere} spinAxisParent - The object that allow inclination on the planet itself.
 * @property {Number} temperature - The temperature of the object (K).
 * @property {EllipticalTrajectory} trajectory - The trajectory of the object.
 * @property {Number} normalizedSpin - The time needed for the object to revolve around itself (seconds).
 * @property {Number} normalizedRevolutionPeriod - The time needed for the object to revolve around its star (seconds).
 * @property {Number} animatableIndex - The position of the animations in the animatable array.
 */
class SpatialObject {
  /**
   * @param {SpatialObjectParams} spatialObjectParams - Parameters needed for the creation of a SpatialObject.
   * @param {BABYLON.Scene} scene - The current scene.
   */
  constructor(spatialObjectParams, scene) {
    /* Creates an attribute of the same name of every parameter passed. There
    may subsist redundant attributes, such as the original spin or revolution
    period, but this doesn't do much, and this structure will stay efficient
    even if parameters are added or changed. */
    for (const [attribute, value] of Object.entries(spatialObjectParams)) {
      switch (attribute) {
        case 'texture':
          if (value) {
            this.texture = new BABYLON.Texture(value, scene)
          }
          break
        default:
          this[attribute] = value
          break
      }
    }
    this.objectMat = new BABYLON.StandardMaterial(this.name + 'Mat', scene)
    this.objectMat.useLogarithmicDepth = true
    this.nu = 0
  }

  /**
   * Creates the 'rotate on itself' animation, and the movement animation if the
   * object does move.
   * @param {Number} steps - The number of steps required for the animation.
   * @param {BABYLON.Scene} scene - The current scene.
   * @param {Boolean} showStatTraj - Defines if the static trajectory appears or not.
   */
  buildAnimation(steps, scene, showStatTraj, animatable) {
    // The framerate wanted (30 or 60 if possible).
    const FRAMERATE = 60
    //Checks if the object is supposed to move, eventually creates its movement animation
    if (this.trajectory.canMove) {
      const moveAnimation = new BABYLON.Animation(
        this.name + 'AnimMove',
        'position',
        FRAMERATE,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
      )
      const staticTrajectory = this.trajectory.staticTrajectory
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

      if (showStatTraj) {
        this.trajectory.showStaticTrajectory(animatable, FRAMERATE, scene, this)
      }

      /* If there is any need of tilting the object on it axis, we use an
      intermediate attribute called spinAxisParent. It will use the
      movement animation in place of the spatialObject itself (because the
      spinAxisParent is defined as a parent of spObj). */
      if (this.spinAxisParent) {
        this.spinAxisParent.animations.push(moveAnimation)
        /* We stock the index of the corresponding animation in that object
        because we will need to find it later for the fixStaticTrajectory (see
        trajectory). */
        this.animatableIndex =
          animatable.push(
            scene.beginAnimation(
              this.spinAxisParent,
              0,
              this.normalizedRevolutionPeriod * FRAMERATE,
              true
            )
          ) - 1
      } else {
        this.mesh.animations.push(moveAnimation)
        this.animatableIndex =
          animatable.push(
            scene.beginAnimation(
              this.mesh,
              0,
              this.normalizedRevolutionPeriod * FRAMERATE,
              true
            )
          ) - 1
      }
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
   * Places the object in such a way that it has the correct inclination to the
   * ecliptic plane. In particular, this creates a 'revolutionAxisParent' attribute that
   * will take the role of tilting the whole plane containing the center of the
   * system and the spatial object.
   */
  setEclipticInclination() {
    if (this.spinAxisParent) {
      /* The revolutionAxisParent is an invisible object related to its
      SpatialObject only. By defining that object as the parent of the SpObj -
      to be exact, it is its grandparent, because we have to use that
      spinAxisParent as an other intermediate - any transformation
      applied to the revAxis will affect any child it has, as if their plane of
      reference was that revAxis. For example, if we rotate the revAxis on its
      X-axis by pi/2, the SpObj related will have its position and trajectory
      turned to a vertical orientation instead of an horizontal one. This is how
      we can calculate the trajectories so easily : we consider they are
      strictly in the (X,0,Z) plane because that doesn't matter as long as the
      revAxis tilts everything. */
      this.revolutionAxisParent = BABYLON.MeshBuilder.CreateSphere(
        `${this.name}revolutionAxisParent`,
        {
          diameter: 0.01,
          updatable: true
        }
      )
      this.revolutionAxisParent.isVisible = false
      this.spinAxisParent.parent = this.revolutionAxisParent
      this.revolutionAxisParent.rotation.x = this.eclipticInclinationAngle
    }
  }

  /**
   * Computes and returns the current diameter of the object, including any
   * scaling.
   * @returns {Number}
   */
  getVisualDiameter() {
    return this.diameter * this.mesh.scaling.x
  }
}

/**
 * The class used for any star.
 * @extends SpatialObject
 */
class Star extends SpatialObject {
  /**
   * @param {SpatialObjectParams} spatialObjectParams - The multiple paramaters needed for any spatial object.
   * @param {BABYLON.Scene} scene - The current scene.
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
      spatialObjectParams.showStatTraj,
      spatialObjectParams.animatable
    )
  }
}

/**
 * The class used for planets.
 * @property {Array} satellites - Planet-exclusive member, dedicated to the list of its satellites (if any).
 * @extends SpatialObject
 */
class Planet extends SpatialObject {
  /**
   * @param {SpatialObjectParams} spatialObjectParams - The multiple paramaters needed for any spatial object.
   * @param {BABYLON.Scene} scene - The current scene.
   */
  constructor(spatialObjectParams, scene) {
    super(spatialObjectParams, scene)
    this.mesh = BABYLON.MeshBuilder.CreateSphere(this.name, {
      diameter: this.diameter,
      updatable: true
    })
    this.mesh.animations = []

    /* To make the planet rotate correctly on its Y-axis, we need to use an
    intermediate object to tilt the planet in the first place. See the detailled
    documentation for more explanation on that. In any case, the
    spinAxisParent mesh replaces the planet for the movement animation,
    because it is the planet's parent and we have to make them superpose
    permanently to keep the correct self-inclination. Making the planet move on
    top of its parent already moving would cause wrong and higly disturbed
    trajectories anyway.*/
    this.spinAxisParent = new BABYLON.CreateSphere(
      `fakeSelfInclination${this.name}`,
      { diameter: 0.01, updatable: true }
    )
    this.spinAxisParent.position = new BABYLON.Vector3(this.trajectory.a, 0, 0)
    this.spinAxisParent.animations = []
    this.spinAxisParent.rotation.x = this.selfInclinationAngle
    this.spinAxisParent.isVisible = false
    this.mesh.parent = this.spinAxisParent

    this.setEclipticInclination()

    this.satellites = []
    if (this.texture) {
      this.objectMat.diffuseTexture = this.texture // Applies either texture or color to the planet, texture by default (if existing)
    } else {
      this.objectMat.diffuseColor = this.color
    }
    /* Setting emissive color of planets to black to avoid them glowing or
    letting light pass through them (because of occlusion). */
    this.objectMat.emissiveColor = BABYLON.Color3.Black()
    this.mesh.material = this.objectMat
    this.buildAnimation(
      100,
      scene,
      spatialObjectParams.showStatTraj,
      spatialObjectParams.animatable
    )
  }
}
/**
 * The class for the satellites. It is essentially the same object as a planet,
 * but it doesn't need a spinAxisParent (this also interferes with the fact that
 * the planet mesh is already the parent of the satellite mesh).
 * @extends SpatialObject
 */
class Satellite extends SpatialObject {
  /**
   * @param {SpatialObjectParams} spatialObjectParams - The multiple paramaters needed for any spatial object.
   * @param {BABYLON.Scene} scene - The current scene.
   */
  constructor(spatialObjectParams, scene) {
    super(spatialObjectParams, scene)
    this.mesh = BABYLON.MeshBuilder.CreateSphere(this.name, {
      diameter: this.diameter,
      updatable: true
    })
    this.mesh.animations = []

    if (this.texture) {
      this.objectMat.diffuseTexture = this.texture // Applies either texture or color to the satellite, texture by default (if existing)
    } else {
      this.objectMat.diffuseColor = this.color
    }
    /* Setting emissive color of satellites to black to avoid them glowing or
    letting light pass through them (because of occlusion). */
    this.objectMat.emissiveColor = BABYLON.Color3.Black()
    this.mesh.material = this.objectMat
    this.buildAnimation(
      100,
      scene,
      spatialObjectParams.showStatTraj,
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
   * @param {SpatialObjectParams} spatialObjectParams - Parameters needed for the creation of a SpatialObject.
   * @param {BABYLON.Scene} scene - The current scene.
   */
  constructor(spatialObjectParams, scene) {
    super(spatialObjectParams, scene)
    this.mesh = BABYLON.CreateDisc(`${this.parentName}Rings`, {
      radius: spatialObjectParams.diameter / 2,
      sideOrientation: BABYLON.Mesh.DOUBLESIDE
    })
    this.texture.hasAlpha = true
    this.objectMat.diffuseTexture = this.texture
    this.objectMat.useAlphaFromDiffuseTexture = true // Using the alpha included in the texture (for spaces between rings)
    this.mesh.material = this.objectMat
    this.mesh.rotation.x = spatialObjectParams.eclipticInclinationAngle
  }
}

export { Star, Planet, Ring, Satellite }
