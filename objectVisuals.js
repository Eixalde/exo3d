const objectVisuals = function (scene, {star, planet, originLight}){
    // Source de la texture : https://www.solarsystemscope.com/textures/
    const STAR_TEXTURE =  "resources/2k_sun.svg";
    
    let starColor = new BABYLON.Color3(1,0.6,0.5);
    let starMat = new BABYLON.StandardMaterial("starMat",scene);    
    starMat.diffuseTexture = new BABYLON.Texture (STAR_TEXTURE, scene);
    starMat.emissiveColor = starColor;
    star.material = starMat;

    // Partie lumière/brillance de l'étoile

    const light = new BABYLON.PointLight("light", originLight);
    light.diffuse = starColor; // Couleur projetée sur les objets autour de l'étoile
    light.specular = new BABYLON.Color3.Black; //Empêche les reflets de type "boule de billard"
    light.range = 100; // Ce paramètre doit être soigneusement retenu, c'est ce qui permettra d'éclairer - ou pas - les objets éloignés de l'étoile 
    
    let gl = new BABYLON.GlowLayer("glow", scene);
    gl.intensity = 1.25;
    gl.referenceMeshToUseItsOwnMaterial(star);
};