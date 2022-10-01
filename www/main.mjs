import { EngineManager, XRLauncher } from './exo3d.mjs'

/* Basic creation of a scene with Babylon. */
const createScene = async function (engine, canvas) {
  const scene = new BABYLON.Scene(engine)
  const generalUI =
    BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('generalUI')

  /* Canvas has to be passed as a parameter for any module that needs it (for
  the cameras here). */
  const engineManager = new EngineManager()
  await engineManager.initialize(scene, canvas)

  /* WebXR part here. */
  // const xr = new XRLauncher(engineManager)
  // await xr.initialize(scene)

  /* The Babylon lib gives access to an inspector, that allows a lot of good
  options for debugging. Activate only for debugging ! */
  scene.debugLayer.show({
    embedMode: true,
    overlay: true
  })
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
