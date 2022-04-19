/**
 * @module XRLauncher
 */

/**
 * Manages the launch of the XR-mode.
 * @property {BABYLON.GroundMesh} ground - The platform where the user stands on.
 * @property {BABYLON.WebXRDefaultExperience} xrHandler - The XR experience handler for the application.
 * @property {BABYLON.Vector3} xrCamPos - The default position to set for the XR Camera.
 * @property {BABYLON.Vector3} xrCamRot - The default rotation to set for the XR Camera.
 * @property {EngineManager} engineManager - The engine manager used for the application.
 */
class XRLauncher {
  /**
   * @param {EngineManager} engineManager - The engine manager created in the main module.
   */
  constructor(engineManager) {
    const PLATFORM_HEIGHT = 10000 // Ad hoc value, for testing purposes
    this.xrCamPos = new BABYLON.Vector3(0, PLATFORM_HEIGHT, 0)
    this.xrCamRot = new BABYLON.Vector3.Zero()
    this.engineManager = engineManager
  }

  /**
   * Start up a basic XR configuration on a platform, far above the star.
   * @param {BABYLON.Scene} scene - The current scene.
   */
  async initialize(scene) {
    /* A ground of 10 units per 10 units is just enough to move around a bit and
    still see the majority of the system. */
    const PLATFORM_SIZE = 10
    this.ground = new BABYLON.CreateGround(
      'ground',
      { width: PLATFORM_SIZE, height: PLATFORM_SIZE },
      scene
    )
    this.ground.checkCollisions = true
    this.ground.material = new BABYLON.GridMaterial('mat', scene)
    this.ground.position.y = this.xrCamPos.y // Ground placed at the same height as the camera

    /* WebXR experience launcher. Doesn't need much lines to run, and it works
    immediately with the engine manager. */
    this.xrHandler = await scene
      .createDefaultXRExperienceAsync({
        floorMeshes: [this.ground]
      })
      .then((xr) => {
        /* Doing some specific actions on either entering or leaving the
        XR-mode (see the respective functions). */
        xr.baseExperience.onStateChangedObservable.add((state) => {
          switch (state) {
            case BABYLON.WebXRState.ENTERING_XR:
              this.onEnteringXR(scene, xr)
              break
            case BABYLON.WebXRState.NOT_IN_XR:
              this.onLeavingXR(scene)
              break
            default:
              // Nothing to trigger by default
              break
          }
        })
        return xr
      })

    /* Setting the far sight of the XR camera identical as the cameras of the
    engineManager. */
    const CAMERA_FAR_SIGHT = this.engineManager.cameras.cameraFarSight
    this.xrHandler.baseExperience.camera.maxZ = CAMERA_FAR_SIGHT
  }

  /**
   * Set various actions each time the XR session is enabled.
   * @param {BABYLON.Scene} scene - The current scene.
   * @param {BABYLON.WebXRDefaultExperience} xr - The XR experience handler for the application.
   */
  onEnteringXR(scene, xr) {
    /* Changing the active camera to the XR Camera, and resetting its
    position/rotation. */
    const xrCamera = xr.baseExperience.camera
    scene.activeCamera = xrCamera
    xrCamera.position = this.xrCamPos
    xrCamera.rotation = this.xrCamRot
  }

  /**
   * Set various actions each time the XR session has ended.
   * @param {BABYLON.Scene} scene - The current scene.
   */
  onLeavingXR(scene) {
    /* Setting back the star camera as the active camera. */
    scene.activeCamera = this.engineManager.cameras.starCamera
  }
}

export { XRLauncher }
