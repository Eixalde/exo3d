class InhabitableSphere {
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

export { InhabitableSphere }
