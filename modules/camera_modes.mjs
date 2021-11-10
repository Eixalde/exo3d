const DEFAULT_STAR_CAM_ALPHA = -Math.PI / 2
const DEFAULT_STAR_CAM_BETA = Math.PI / 3

const DEFAULT_PLANET_CAM_ALPHA = -Math.PI / 2
const DEFAULT_PLANET_CAM_BETA = (11 * Math.PI) / 24 // Almost flat angle

/**
 * Manages all cameras and views for the user.
 *
 * @member {BABYLON.ArcRotateCamera} starCamera - A camera focused on the center of the system (the star, mostly).
 * @member {BABYLON.ArcRotateCamera} planetCamera - A camera focused on the planet.
 * @member {BABYLON.UniversalCamera} freeCamera - A camera controlled by the user, can move anywhere in the system.
 */
class CameraModes {
  /**
   * @param {BABYLON.Scene} scene - The current scene.
   * @param {Star} star - The star of the system observed.
   * @param {Array} planets - The group of planets we want to look at.
   * @param {canvas} canvas - The current canvas.
   * @param {BABYLON.Animatable} animatable - The array containing all animations of the scene.
   */
  constructor(scene, star, planets, canvas, animatable) {
    const HIT_BOX_RADIUS = planets[0].diameter
    const BASE_PLANET = planets[0] // The planet pointed by the planetCamera by default
    const STAR_CAM_DIST = 2 * star.diameter
    const PLANET_CAM_DIST = 2 * BASE_PLANET.diameter

    // Star-centered camera
    this.starCamera = new BABYLON.ArcRotateCamera(
      'starCamera',
      DEFAULT_STAR_CAM_ALPHA,
      DEFAULT_STAR_CAM_BETA,
      STAR_CAM_DIST,
      star.mesh.position
    )
    this.starCamera.attachControl(canvas, true)

    // Planet-centered camera
    const planetCamDist = 3 * BASE_PLANET.diameter
    this.planetCamera = new BABYLON.ArcRotateCamera(
      'planetCamera',
      DEFAULT_PLANET_CAM_ALPHA,
      DEFAULT_PLANET_CAM_BETA,
      planetCamDist,
      BASE_PLANET.mesh.position
    )

    // Free camera

    // TODO : include a tutorial for the controls of the free camera
    // Arbitrary starting point of the free camera
    const FREE_CAM_POS = new BABYLON.Vector3(
      0,
      star.diameter,
      -4 * star.diameter
    )

    this.freeCamera = new BABYLON.UniversalCamera(
      'freeCamera',
      FREE_CAM_POS,
      scene
    )
    this.freeCamera.inputs.addMouseWheel() // NOTE : should change the camera movement easing (may be too strong)

    /* Collisions and movement restrictions for the cameras */
    scene.collisionsEnabled = true
    this.starCamera.lowerRadiusLimit = STAR_CAM_DIST // Prevents the camera from going into the mesh
    this.planetCamera.lowerRadiusLimit = PLANET_CAM_DIST // Prevents the camera from going into the mesh
    this.freeCamera.checkCollisions = true
    this.freeCamera.ellipsoid = new BABYLON.Vector3(
      HIT_BOX_RADIUS,
      HIT_BOX_RADIUS,
      HIT_BOX_RADIUS
    )
    star.mesh.checkCollisions = true
    BASE_PLANET.mesh.checkCollisions = true

    const allCameras = [this.starCamera, this.planetCamera, this.freeCamera]

    const CAMERA_MODES_LABELS = ['star', 'planet', 'free']
    CAMERA_MODES_LABELS.forEach((camLabel, idx) => {
      document.querySelector('.btn-group #' + camLabel).onclick = () => {
        this.changeCameraMode(
          allCameras[idx],
          scene,
          allCameras,
          animatable,
          canvas
        )
      }
    })

    const PLANET_CAMERA_LABELS = ['prev', 'next']
    PLANET_CAMERA_LABELS.forEach((camLabel) => {
      document.querySelector('.controls #' + camLabel).onclick = () => {
        if (scene.activeCamera !== this.planetCamera) {
          return
        }

        this.changeCameraToNearbyPlanet(
          camLabel,
          PLANET_CAMERA_LABELS,
          planets,
          scene,
          animatable
        )
      }
    })
  }

  changeCameraMode(toCamera, scene, allCameras, animatable, canvas) {
    // We do something only if the selected camera isn't the already active one
    if (scene.activeCamera === toCamera) {
      return
    }
    document
      .querySelector('.controls#cameraPlanetSwitch')
      .classList.add('invisible')

    allCameras.forEach((cam) => cam.detachControl()) // Locking all cameras controls

    this.addSmoothCameraTransition(
      scene,
      scene.activeCamera,
      toCamera,
      () => {
        scene.activeCamera = toCamera // Switching the active camera to the selected one
        toCamera.attachControl(canvas, true) // Giving controls for the selected camera only
        if (scene.activeCamera === this.planetCamera) {
          document
            .querySelector('.controls#cameraPlanetSwitch')
            .classList.remove('invisible')
        }
      },
      animatable
    )
  }

  changeCameraToNearbyPlanet(
    btnLabel,
    planetCamLabels,
    planets,
    scene,
    animatable
  ) {
    // Checking which button was clicked
    const idx = planetCamLabels.findIndex((label) => label === btnLabel)

    // Identifying the index of the planet the camera is currently looking at
    const current = planets.findIndex(
      (planet) => planet.mesh.position === this.planetCamera.getTarget()
    )

    const previous = current ? current - 1 : planets.length - 1
    const next = current !== planets.length - 1 ? current + 1 : 0

    let changePlanetIndex
    if (idx) {
      changePlanetIndex = next
    } else {
      changePlanetIndex = previous
    }

    /* Here we need to create a second camera, because the transition
    camera needs a starting camera and an ending camera. What we do here
    is cloning the planetCamera, teleportating the planetCamera to the
    planet we want to look at next, and then applying the transition. */
    const fakePlanetCamera = this.planetCamera.clone('fakePlanetCamera')
    scene.activeCamera = fakePlanetCamera
    this.planetCamera.target = planets[changePlanetIndex].mesh.position
    this.planetCamera.radius = 3 * planets[changePlanetIndex].diameter
    this.planetCamera.lowerRadiusLimit = 2 * planets[changePlanetIndex].diameter

    /* The function launched at the end of the transition between cameras */
    const changePlanetCamera = () => {
      scene.activeCamera = this.planetCamera // Switching back the active camera to planetCamera
      fakePlanetCamera.dispose() // Destroying the fake camera
    }

    this.addSmoothCameraTransition(
      scene,
      scene.activeCamera,
      this.planetCamera,
      changePlanetCamera,
      animatable
    )
  }

  /**
   * Creates a smooth transition when changing the camera of the scene. The
   * animatable is necessary so the animations can slow down during the
   * transition only. This prevents violent movements when trying to track
   * fast-moving objects.
   *
   * @param {BABYLON.Scene} scene - The current scene.
   * @param {BABYLON.Camera} initialCamera - The current active camera.
   * @param {BABYLON.Camera} finalCamera - The camera we want to go to.
   * @param {function} onTransitionEnd - Specific actions to do when the transition is over.
   * @param {BABYLON.Animatable} animatable - The array containing all animations of the scene.
   */
  addSmoothCameraTransition(
    scene,
    initialCamera,
    finalCamera,
    onTransitionEnd,
    animatable
  ) {
    /* Transition is needed for every case besides switching to the free camera.
    In this specific case, we just overlay the starting camera and the free
    camera (see the else statement). */
    if (finalCamera !== this.freeCamera) {
      const FRAMERATE = 60
      const ANIM_LENGTH = FRAMERATE * 2
      const saveSpeedRatio = animatable[0].speedRatio // Saving the current speed ratio of the first animation (the same for all of them)
      if (saveSpeedRatio !== 0) {
        animatable.forEach((anim) => (anim.speedRatio = 0.25)) // If the animations aren't paused, we slow them down to 25% speed
        /* NOTE : 25% speed is fine at the moment I am experimenting, though it
        may be interesting to slow it even more when dealing with REALLY fast
        objects. */
      }

      /* Another particular case is when the starting camera is the free camera.
      This is because all cameras but this one use polar coordinates to place
      themselves and transition between them. The free camera uses cartesian
      coordinates instead, and while it is possible to convert values between
      those two, the generalized system of transition is based on a
      polar-coordinates camera. The solution is to create a "fake free camera"
      that overlays with the real one, but is actually compatible with the
      polar-coordinates system. This fake free camera then replaces the real one
      as the reference for the starting camera. */
      if (initialCamera === this.freeCamera) {
        const fakeFreeCamera = new BABYLON.ArcRotateCamera(
          'fakeFreeCamera',
          0,
          0,
          1,
          this.freeCamera.getTarget()
        ) // 1 is the distance to the target, and the free camera is ALWAYS 1 unit away from its target
        fakeFreeCamera.position = this.freeCamera.position
        fakeFreeCamera.rotation = this.freeCamera.rotation

        initialCamera = fakeFreeCamera
      }

      const initialTarget = initialCamera.getTarget()
      const finalTarget = finalCamera.getTarget()

      /* WHITEMAGIC : This calculation allows the transition to mostly look at
      the object it is coming at during the transition.
      TODO : make a diagram to explain this angle. */
      finalCamera.alpha =
        BABYLON.Vector3.GetAngleBetweenVectors(
          finalTarget.subtract(initialTarget),
          new BABYLON.Vector3(1, 0, 0),
          new BABYLON.Vector3(0, 1, 0)
        ) - Math.PI

      finalCamera.alpha %= 2 * Math.PI // Avoids angles over 360 degrees, it makes the camera spin sometimes

      finalCamera.beta = (11 * Math.PI) / 24 // Fairly horizontal view for the ending camera

      /* This is why we need polar coordinates only */
      const initialAlpha = initialCamera.alpha
      const initialBeta = initialCamera.beta
      const initialRadius = initialCamera.radius

      const finalAlpha = finalCamera.alpha
      const finalBeta = finalCamera.beta
      const finalRadius = finalCamera.radius

      const transitionCamera = new BABYLON.ArcRotateCamera(
        'transitionCamera',
        0,
        0,
        10,
        initialTarget
      ) // A transition camera to fake movement from the active camera to the selected one

      /* We have to create an object that the transition camera can track
      properly during the transition. This object will move from the target of
      the starting camera to the one of the ending camera. By tracking it,
      the transition camera will also move at the same speed.*/
      const transitionTarget = BABYLON.CreateBox('transitionTarget', scene)
      transitionTarget.isVisible = false
      transitionTarget.position = initialTarget

      transitionCamera.lockedTarget = transitionTarget

      /* The two cameras don't always have the same distance to their target, so
      a transition is needed for the radius as well. */
      const transitionRadiusAnimation = new BABYLON.Animation(
        'transitionRadiusAnimation',
        'radius',
        FRAMERATE,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT
      )
      transitionRadiusAnimation.setKeys([
        {
          frame: 0,
          value: initialRadius
        },
        {
          frame: ANIM_LENGTH,
          value: finalRadius
        }
      ])

      /* The transition of the target */
      const transitionPositionAnimation = new BABYLON.Animation(
        'transitionPositionAnimation',
        'position',
        FRAMERATE,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3
      )
      transitionPositionAnimation.setKeys([
        {
          frame: 0,
          value: initialTarget
        },
        {
          frame: ANIM_LENGTH,
          value: finalTarget
        }
      ])

      /* The transition of the alpha value of the camera */
      const transitionAlphaAnimation = new BABYLON.Animation(
        'transitionAlphaAnimation',
        'alpha',
        FRAMERATE,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT
      )
      transitionAlphaAnimation.setKeys([
        {
          frame: 0,
          value: initialAlpha
        },
        {
          frame: ANIM_LENGTH,
          value: finalAlpha
        }
      ])
      /* Easing the animation allows to points earlier towards the ending target */
      const alphaEaseFunction = new BABYLON.CubicEase()
      alphaEaseFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT)
      transitionAlphaAnimation.setEasingFunction(alphaEaseFunction)

      /* The transition to the beta value needs an intermediate key, that places
      the camera on the X/Z plane.
      TODO : a diagram that explains this */
      const transitionBetaAnimation = new BABYLON.Animation(
        'transitionBetaAnimation',
        'beta',
        FRAMERATE,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT
      )
      transitionBetaAnimation.setKeys([
        {
          frame: 0,
          value: initialBeta
        },
        {
          frame: (3 * ANIM_LENGTH) / 4,
          value: Math.PI / 2
        },
        {
          frame: ANIM_LENGTH,
          value: finalBeta
        }
      ])
      /* Easing the animation allows to points earlier towards the ending target */
      const betaEaseFunction = new BABYLON.CubicEase()
      betaEaseFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT)
      transitionBetaAnimation.setEasingFunction(betaEaseFunction)

      transitionCamera.animations = [
        transitionRadiusAnimation,
        transitionAlphaAnimation,
        transitionBetaAnimation
      ]
      transitionTarget.animations = [transitionPositionAnimation]
      scene.activeCamera = transitionCamera // Using the transition camera as the user view during the transition
      scene.beginAnimation(transitionTarget, 0, ANIM_LENGTH, false)
      const transitionAnimatable = scene.beginAnimation(
        transitionCamera,
        0,
        ANIM_LENGTH,
        false
      )
      transitionAnimatable.onAnimationEnd = () => {
        onTransitionEnd()
        transitionCamera.dispose() // Destroying the transition camera once its job is done
        transitionTarget.dispose() // Destroying the transition target as well
        animatable.forEach((anim) => (anim.speedRatio = saveSpeedRatio)) // Putting all animations to their original speed
      }
    } else {
      /* Placing the free camera at the exact same position and rotation gives
      the impression that the spectator has been detached from the object they
      were looking at. */
      finalCamera.position = initialCamera.position
      finalCamera.target = initialCamera.target
      onTransitionEnd()
    }
  }
}

export { CameraModes }
