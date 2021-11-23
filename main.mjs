import { GravitationalSystemManager } from './exo3d.mjs'

/* Basic creation of a scene with Babylon. */
const createScene = function (engine, canvas) {
  const scene = new BABYLON.Scene(engine)
  const generalUI =
    BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('generalUI')
  /* Canvas has to be passed as a parameter for any module that needs it (for
  the cameras here) */
  const _ = new GravitationalSystemManager(scene, generalUI, canvas)

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
const scene = createScene(engine, canvas)

engine.runRenderLoop(function () {
  scene.render()
})

window.addEventListener('resize', function () {
  engine.resize()
})
