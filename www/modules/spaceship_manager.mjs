/**
 * @module SpaceshipManager
 */

import { SPACESHIP_POSITION } from "../exo3d.mjs"

/**
 * Handles everything related to the spaceship environment used in the XR mode.
 * @property {BABYLON.Vector3} shipPos - The position of the spaceship.
 * @property {BABYLON.Mesh[]} spaceship - The meshes consisting of the spaceship (built in Blender).
 */
class SpaceshipManager {
	constructor() {
		this.shipPos = new BABYLON.Vector3(
			SPACESHIP_POSITION.x,
			SPACESHIP_POSITION.y,
			SPACESHIP_POSITION.z
		)
	}

	/**
	 * Creates and handles the spaceship for the XR session.
	 * @param {BABYLON.Scene} scene - The current scene.
	 * @param {BABYLON.GlowLayer} glowLayer - The glow effect applied to the star of the system.
	 */
	async buildSpaceship(scene, glowLayer) {
		/* Gets the glb model of the spaceship. */
		this.spaceship = await BABYLON.SceneLoader.ImportMeshAsync(
			"",
			"3d_models/",
			"spaceship.glb",
			scene
		)
		for (const mesh of this.spaceship.meshes) {
			/* Creates a new material for each mesh. Blender ones are complicated to
      work with when exported, and Babylon is fine for simple materials anyway. */
			mesh.material = new BABYLON.StandardMaterial(`${mesh.id}Mat`, scene)
			mesh.material.useLogarithmicDepth = true

			/* Does custom actions for some meshes. */
			switch (mesh.id) {
				/* The __root__ is the model in its globality. Changing its scaling and
        position affects the ship overall.*/
				case "__root__": {
					mesh.name = "spaceship" // Give it a name a bit clearer
					const SHIP_SCALING = 1.65 // Ad hoc value

					mesh.scaling = new BABYLON.Vector3(
						SHIP_SCALING,
						SHIP_SCALING,
						SHIP_SCALING
					)
					mesh.position = this.shipPos
					break
				}

				/* The glass material for the ship is taken from this Babylon playground :
        https://playground.babylonjs.com/#AQZJ4C#0. */
				case "glass":
					mesh.material.diffuseColor = new BABYLON.Color3(0, 0, 0)
					mesh.material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5)
					mesh.material.alpha = 0.2
					mesh.material.specularPower = 16

					// Fresnel
					mesh.material.reflectionFresnelParameters =
						new BABYLON.FresnelParameters()
					mesh.material.reflectionFresnelParameters.bias = 0.1

					mesh.material.emissiveFresnelParameters =
						new BABYLON.FresnelParameters()
					mesh.material.emissiveFresnelParameters.bias = 0.6
					mesh.material.emissiveFresnelParameters.power = 4
					mesh.material.emissiveFresnelParameters.leftColor =
						BABYLON.Color3.White()
					mesh.material.emissiveFresnelParameters.rightColor =
						BABYLON.Color3.Black()

					mesh.material.opacityFresnelParameters =
						new BABYLON.FresnelParameters()
					mesh.material.opacityFresnelParameters.leftColor =
						BABYLON.Color3.White()
					mesh.material.opacityFresnelParameters.rightColor =
						BABYLON.Color3.Black()
					break

				/* Some advertising for the French artist named "Blackholed". */
				case "universona": {
					const BH_TEXTURE = "./3d_models/blackholed.jpeg"
					const universonaTexture = new BABYLON.Texture(BH_TEXTURE, scene, {
						invertY: false,
					})
					universonaTexture.uScale = -1
					mesh.material.diffuseTexture = universonaTexture
					break
				}

				/* Any other part of the ship that would need generic treatment (at the
        moment : none). */
				default:
					break
			}
			glowLayer.addIncludedOnlyMesh(mesh)
		}
	}
}

export { SpaceshipManager }
