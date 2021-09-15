const objectVisuals = function (scene, {star, planet, originLight}){
    // Texture de la Lune (le seul résultat en noir et blanc qui s'accorde avec l'aspect que l'on veut donner à l'étoile pour l'instant)
    // TODO : trouver/faire une vraie texture d'étoile en noir et blanc
    const STAR_TEXTURE =  "https://lh3.googleusercontent.com/proxy/sUOBaBXqE3pCFrG9jqwHYB1K_q0i5tQnvMapmex3fr7VhXOhsEP80-Hu77Dbwckq0zQlNt2hAhXV_Yd9sCpBwv8HmFHHzHy_vlY";
    
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