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

  /* WebXR experience launcher. Doesn't need much lines to run, but it works
  fine as is. */

  // Ad hoc values, for testing purposes
  const ground = BABYLON.MeshBuilder.CreateGround(
    'ground',
    { width: 1000, height: 1000 },
    scene
  )
  ground.checkCollisions = true
  ground.material = new BABYLON.GridMaterial('mat', scene)
  ground.position.y = 10000 // Ad hoc value, for testing purposes
  const xr = await scene.createDefaultXRExperienceAsync({
    floorMeshes: [ground]
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
