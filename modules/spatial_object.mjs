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
 * The base class for any spatial object. It shall not be instantiated as such,
 * because it has no signification otherwise.
 *
 * @member {String} name - The name of the object.
 * @member {number} diameter - The diameter of the object (no units).
 * @member {number} distanceToParent - The distance to any parent object (no units).
 * @member {String} texture - The link for the texture of the object.
 * @member {BABYLON.Color3} color - The color of the object.
 * @member {number} inclinationAngle - The inclination of the object relative to its star (rad).
 * @member {number} temperature - The temperature of the object.
 * @member {EllipticalTrajectory} trajectory - The trajectory of the object.
 * @member {number} omega - The speed at which the object rotate on itself (rad/s).
 * @member {number} revolutionPeriod - The time needed for the object to revolve around its star (seconds).
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
   * @param {number} omega - The speed at which the object rotate on itself (rad/s).
   * @param {number} revolutionPeriod - The time needed for the object to revolve around its star (seconds).
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
      trajectory,
      omega,
      revolutionPeriod,
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
    this.objectMat = new BABYLON.StandardMaterial(this.name + 'Mat', scene)
    if (texture) {
      this.texture = new BABYLON.Texture(texture, scene)
    }
    this.distanceToParent = distanceToParent
    this.trajectory = trajectory
    this.omega = omega
    this.rotationPeriod = Math.abs((2 * Math.PI) / this.omega)
    this.revolutionPeriod = revolutionPeriod
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

      const deltaT = (this.revolutionPeriod / steps) * FRAMERATE
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
          frame: current * (this.revolutionPeriod / steps) * FRAMERATE,
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
        frame: i * (this.rotationPeriod / steps) * FRAMERATE,
        value: (i * 2 * Math.PI) / steps
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
        this.revolutionPeriod * Math.pow(FRAMERATE, 2) * this.rotationPeriod,
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
    const nbFrame = this.revolutionPeriod * FRAMERATE
    const evalTraj = new Array(1000)

    for (let i = 0; i < evalTraj.length; i++) {
      const curFrame = (nbFrame / (evalTraj.length - 1)) * i
      evalTraj[i] = animation.evaluate(curFrame)
    }

    const actualTraj = new BABYLON.Path3D(evalTraj)
    const actualTrajCurve = actualTraj.getCurve()
    const line = new BABYLON.CreateLines('li', {
      points: actualTrajCurve,
      scene: scene
    })
    line.color = new BABYLON.Color3(1, 0, 0)
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
    this.objectMat.emissiveColor = this.color
    this.mesh.material = this.objectMat
    this.buildAnimation(
      20,
      scene,
      spatialObjectParams.showStaticTrajectory,
      spatialObjectParams.animatable
    )
  }
}

/**
 * The class used for planets and satellites.
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
    if (this.texture) {
      this.objectMat.diffuseTexture = this.texture // Applies either texture or color to the planet, texture by default (if existing)
    } else {
      this.objectMat.diffuseColor = this.color
    }
    this.mesh.material = this.objectMat
    this.buildAnimation(
      20,
      scene,
      spatialObjectParams.showStaticTrajectory,
      spatialObjectParams.animatable
    )
  }
}

export { Star, Planet }
