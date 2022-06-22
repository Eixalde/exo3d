/**
 * @module XRLauncher
 */

import { SPACESHIP_POSITION, SpaceshipManager } from '../exo3d.mjs'

/**
 * Manages the launch of the XR-mode.
 * @property {BABYLON.GroundMesh} ground - The platform where the user stands on.
 * @property {BABYLON.WebXRDefaultExperience} xrHandler - The XR experience handler for the application.
 * @property {BABYLON.Vector3} xrCamPos - The default position to set for the XR Camera.
 * @property {BABYLON.Vector3} xrCamRot - The default rotation to set for the XR Camera.
 * @property {EngineManager} engineManager - The engine manager used for the application.
 * @property {SpaceshipManager} spaceshipManager - The spaceship manager used in the XR mode.
 */
class XRLauncher {
  /**
   * @param {EngineManager} engineManager - The engine manager created in the main module.
   */
  constructor(engineManager) {
    /* Sets the XR Camera at the spaceship's position. */
    this.xrCamPos = new BABYLON.Vector3(
      SPACESHIP_POSITION.x,
      SPACESHIP_POSITION.y,
      SPACESHIP_POSITION.z
    )
    this.xrCamRot = new BABYLON.Vector3.Zero()
    this.engineManager = engineManager
  }

  /**
   * Start up a basic XR configuration on a platform, far above the star.
   * @param {BABYLON.Scene} scene - The current scene.
   */
  async initialize(scene) {
    this.spaceshipManager = new SpaceshipManager()
    await this.spaceshipManager.buildSpaceship(
      scene,
      this.engineManager.glowLayer
    )

    /* WebXR experience launcher. Doesn't need much lines to run, and it works
    immediately with the engine manager. */
    this.xrHandler = await scene
      .createDefaultXRExperienceAsync({
        floorMeshes: this.spaceshipManager.spaceship.meshes
      })
      .then((xr) => {
        /* Preemptively hides the spaceship until being in XR mode. */
        this.spaceshipManager.spaceship.meshes[0].setEnabled(false)
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

    /* Reveals the spaceship in XR mode. */
    this.spaceshipManager.spaceship.meshes[0].setEnabled(true)
  }

  /**
   * Set various actions each time the XR session has ended.
   * @param {BABYLON.Scene} scene - The current scene.
   */
  onLeavingXR(scene) {
    /* Setting back the star camera as the active camera. */
    scene.activeCamera = this.engineManager.cameras.starCamera

    /* Hides the spaceship outside of XR mode. */
    this.spaceshipManager.spaceship.meshes[0].setEnabled(false)
  }
}

export { XRLauncher }
