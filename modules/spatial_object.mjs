// Base class for the Star and Planet classes
class SpatialObject {
  diameter
  distanceToParent // in case there is any need to link the object to another (also useful for inclined planets)
  inclinationAngle // inclined planets as well
  temperature // will be used with color
  mesh
  originalPosition
  texture
  color
  objectMat
  constructor(
    {
      diameter,
      distanceToParent,
      originalPosition,
      texture,
      color,
      inclinationAngle,
      temperature
    },
    scene
  ) {
    this.texture = texture
    this.color = color
    this.objectMat = new BABYLON.StandardMaterial('cbMat', scene)
    this.texture = new BABYLON.Texture(texture, scene)
    this.distanceToParent = distanceToParent
  }
}

class Star extends SpatialObject {
  constructor(spatialObjectParams, scene) {
    super(spatialObjectParams, scene)
    this.mesh = BABYLON.CreateSphere('celestialBody', {
      diameter: this.diameter,
      updatable: true
    })
    this.mesh.position = spatialObjectParams.originalPosition
    this.objectMat.diffuseTexture = this.texture // Applies both texture and color, only for the star
    this.objectMat.emissiveColor = this.color
    this.mesh.material = this.objectMat
  }
}

class Planet extends SpatialObject {
  constructor(spatialObjectParams, scene) {
    super(spatialObjectParams, scene)
    this.mesh = BABYLON.CreateSphere('celestialBody', {
      diameter: spatialObjectParams.diameter,
      updatable: true
    })
    this.mesh.position = spatialObjectParams.originalPosition
    if (this.texture) {
      this.objectMat.diffuseTexture = this.texture // Applies either texture or color to the planet, texture by default (if existing)
    } else {
      this.objectMat.emissiveColor = this.color
    }
    this.mesh.material = this.objectMat
  }
}

class Ring extends SpatialObject {
  constructor(spatialObjectParams, scene) {
    super(spatialObjectParams, scene)
    this.mesh = BABYLON.CreateDisc('disc', {
      radius: spatialObjectParams.diameter / 2,
      sideOrientation: BABYLON.Mesh.DOUBLESIDE
    })
    this.texture.hasAlpha = true
    this.objectMat.diffuseTexture = this.texture
    this.objectMat.useAlphaFromDiffuseTexture = true
    this.mesh.material = this.objectMat
    this.mesh.rotation.x = Math.PI / 2 - Math.PI / 9
  }
}

export { Star, Planet, Ring }
