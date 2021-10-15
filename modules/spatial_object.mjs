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

  /**
   * Creates a spatial object (no specific classification).
   * @param {object} spatialObjectParams - Multiple paramaters needed for any spatial object.
   * @param {scene} scene - The current scene.
   */

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
    this.mesh = BABYLON.MeshBuilder.CreateSphere('celestialBody', {
      diameter: diameter,
      updatable: true
    })
    this.texture = texture
    this.color = color
    this.objectMat = new BABYLON.StandardMaterial('cbMat', scene)
    this.texture = new BABYLON.Texture(texture, scene)
    this.distanceToParent = distanceToParent
    this.mesh.position = originalPosition
  }
}

class Star extends SpatialObject {
  /**
   * Creates a spatial object : a star.
   * @param {object} spatialObjectParams - Multiple paramaters needed for any spatial object.
   * @param {scene} scene - The current scene.
   */
  constructor(spatialObjectParams, scene) {
    super(spatialObjectParams, scene)
    this.objectMat.diffuseTexture = this.texture // Applies both texture and color, only for the star
    this.objectMat.emissiveColor = this.color
    this.mesh.material = this.objectMat
  }
}

class Planet extends SpatialObject {
  /**
   * Creates a spatial object : a planet or a satellite.
   * @param {object} spatialObjectParams - Multiple paramaters needed for any spatial object.
   * @param {scene} scene - The current scene.
   */
  constructor(spatialObjectParams, scene) {
    super(spatialObjectParams, scene)
    if (this.texture) {
      this.objectMat.diffuseTexture = this.texture // Applies either texture or color to the planet, texture by default (if existing)
    } else {
      this.objectMat.emissiveColor = this.color
    }
    this.mesh.material = this.objectMat
  }
}

export { Star, Planet }
