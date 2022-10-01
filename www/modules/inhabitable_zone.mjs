import { colorInhabitable } from '../exo3d.mjs'

/**
 * The pair of spheres delimiting the inhabitable zone (IZ) of a system.
 * @property {BABYLON.Mesh} innerSphere - The inner border of the IZ.
 * @property {BABYLON.Mesh} outerSphere - The outer border of the IZ.
 */
class InhabitableSphere {
  /**
   * @param {number} innerRadius - The radius of the inner border.
   * @param {number} outerRadius - The radius of the outer border.
   * @param {BABYLON.Scene} scene - The current scene.
   */
  constructor(innerRadius, outerRadius, scene) {
    this.innerSphere = new BABYLON.MeshBuilder.CreateSphere('innerSphere', {
      segments: 8,
      diameter: 2 * innerRadius
    })

    this.innerSphere.material = new BABYLON.StandardMaterial(
      'innerSphereMat',
      scene
    )
    this.innerSphere.material.emissiveColor = BABYLON.Color3.Yellow()
    this.innerSphere.material.wireframe = true
    this.innerSphere.material.useLogarithmicDepth = true

    this.outerSphere = new BABYLON.MeshBuilder.CreateIcoSphere('outerSphere', {
      subdivisions: 3,
      radius: outerRadius
    })

    this.outerSphere.material = new BABYLON.StandardMaterial(
      'outerSphereMat',
      scene
    )
    this.outerSphere.material.emissiveColor = BABYLON.Color3.Green()
    this.outerSphere.material.wireframe = true
    this.outerSphere.material.useLogarithmicDepth = true
  }
}

/**
 * Highlights the planets depending on their position relative to the IZ
 * (green : in, orange : partially in, red : out).
 * @param {SpatialObject[]} planets - The planets of the system.
 * @param {number} innerRadius - The radius of the inner border.
 * @param {number} outerRadius - The radius of the outer border.
 */
function highlightPlanets(planets, innerRadius, outerRadius) {
  planets.forEach((planet) => {
    const highlightColor = colorInhabitable(
      planet.trajectory.a,
      planet.trajectory.e,
      innerRadius,
      outerRadius
    )
    planet.mesh.renderOutline = true
    planet.mesh.outlineColor = new BABYLON.Color3(
      highlightColor.red,
      highlightColor.green,
      0
    )
  })
}

export { InhabitableSphere, highlightPlanets }
