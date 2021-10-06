import { GravitationalSystemManager } from './exo3d.mjs'

const createScene = function (engine, canvas) {
  const scene = new BABYLON.Scene(engine)
  const generalUI =
    BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('generalUI')
  const _ = new GravitationalSystemManager(scene, generalUI, canvas) //canvas now has to be passed as a parameter for any module that needs it, unlike before (for "emulSpeed" here)
  scene.debugLayer.show({
    // L'inspector fourni par babylon.js, permet de manipuler assez largement la scène pendant son exécution
    embedMode: true,
  })
  //Pour afficher l'UI debug, il faut insérer "debugUI(scene);", sinon seul l'inspector sera actif
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
