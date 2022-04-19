import { GravitationalSystemManager } from './exo3d.mjs'

/* Basic creation of a scene with Babylon. */
const createScene = async function (engine, canvas) {
  const scene = new BABYLON.Scene(engine)
  const generalUI =
    BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('generalUI')

  /* Canvas has to be passed as a parameter for any module that needs it (for
  the cameras here) */
  const gsm = new GravitationalSystemManager()
  await gsm.initialize(scene, canvas)

  /* The Babylon lib gives access to an inspector, that allows a lot of good
  options for debugging. Activate only for debugging ! */
  scene.debugLayer.show({
    embedMode: true,
    overlay: true
  })

  /* WebXR part, still in PoC. */

  const PLATFORM_HEIGHT = 10000 // Ad hoc value, for testing purposes
  const VR_CAM_POS = new BABYLON.Vector3(0, PLATFORM_HEIGHT, 0)

  /* A ground of 10 units per 10 units is just enough to move around a bit and
  still see the majority of the system. */
  const ground = BABYLON.MeshBuilder.CreateGround(
    'ground',
    { width: 10, height: 10 },
    scene
  )
  ground.checkCollisions = true
  ground.material = new BABYLON.GridMaterial('mat', scene)
  ground.position.y = PLATFORM_HEIGHT

  /* WebXR experience launcher. Doesn't need much lines to run, but it works
  fine as is. */
  const xr = await scene
    .createDefaultXRExperienceAsync({
      floorMeshes: [ground]
    })
    .then((xr) => {
      /* It is necessary to manipulate the cameras upon entering and leaving the
      XR mode. When entering, we force the WebXR camera to be the active one,
      and we have to modify its position at this exact moment (before would not
      work, after would "teleport" the user). Leaving WebXR implies switching to
      any non-XR camera. */
      xr.baseExperience.onStateChangedObservable.add((state) => {
        switch (state) {
          case BABYLON.WebXRState.ENTERING_XR:
            scene.activeCamera = xr.baseExperience.camera
            xr.baseExperience.camera.position = VR_CAM_POS
            break
          case BABYLON.WebXRState.NOT_IN_XR:
            scene.activeCamera = gsm.cameras.starCamera
            break
          default:
            // Nothing to trigger by default
            break
        }
      })
      return xr
    })

  /* NOTE : this is kind of a magic number, but it must be equal to twice the
  value of SKYBOX_SIZE, a constant that appears in the system_manager. Shall
  that one become an attribute of the GSM ? */
  const CAMERA_FAR_SIGHT = 4000000
  xr.baseExperience.camera.maxZ = CAMERA_FAR_SIGHT
  return scene
}

const canvas = document.getElementById('renderCanvas')
const engine = new BABYLON.Engine(canvas, true)
const scene = await createScene(engine, canvas)

engine.runRenderLoop(function () {
  scene.render()
})

window.addEventListener('resize', function () {
  engine.resize()
})
