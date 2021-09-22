const objectVisuals = function (scene, {star, planet, originLight, animationSpeed}){
    // Source de la texture : https://www.solarsystemscope.com/textures/
    const STAR_TEXTURE =  "resources/2k_sun.svg";
    const PLANET_TEXTURE = "resources/2k_earth.svg";
    const SKYBOX_TEXTURE = "resources/8k_stars.jpg";
    
    let starColor = new BABYLON.Color3(1,0.6,0.5);
    let starMat = new BABYLON.StandardMaterial("starMat",scene);    
    starMat.diffuseTexture = new BABYLON.Texture (STAR_TEXTURE, scene);
    starMat.emissiveColor = starColor;
    star.material = starMat;

    const planetColor = new BABYLON.Color3(0.5, 0.3, 0.3);             //Arbitrary color (brown), not in caps because it will depend on other parameters
    let planetMat = new BABYLON.StandardMaterial("planetMat",scene);
    if (planet.isFromSolarSystem){
        planetMat.diffuseTexture = new BABYLON.Texture (PLANET_TEXTURE, scene, {invertY: false});
    } else {
        planetMat.diffuseColor = planetColor;
    }
    planet.mesh.material = planetMat;

    //Reminder : 60 is the fps value, no need to use a variable to stock it
    const planetRotateAnim = new BABYLON.Animation("rotateAnim", "rotation.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    const REVOLUTION_PERIOD = 50;  //Arbitrary period of revolution (in frames) !! Warning : do not make it equal to PRECISION_STEPS (see planets_revolving.js)
    const planetRotateKeys = [{frame: 0, value: 2 * Math.PI},                       //Counterclockwise rotation, from 2*pi to 0
                              {frame: animationSpeed*REVOLUTION_PERIOD, value: 0}];

    planetRotateAnim.setKeys(planetRotateKeys);
    planet.mesh.animations.push(planetRotateAnim);
    scene.beginAnimation(planet.mesh,0,animationSpeed*REVOLUTION_PERIOD,true);

    // Partie lumière/brillance de l'étoile

    const light = new BABYLON.PointLight("light", originLight);
    light.diffuse = starColor; // Couleur projetée sur les objets autour de l'étoile
    light.specular = new BABYLON.Color3.Black; //Empêche les reflets de type "boule de billard"
    light.range = 100; // Ce paramètre doit être soigneusement retenu, c'est ce qui permettra d'éclairer - ou pas - les objets éloignés de l'étoile 
    
    let gl = new BABYLON.GlowLayer("glow", scene);
    gl.intensity = 1.25;
    gl.referenceMeshToUseItsOwnMaterial(star);

    const SKYBOX_SIZE = 3;      //Arbitrary factor for the size of the skybox (quite large at 3 though)
    let starsSkybox = new BABYLON.PhotoDome("skybox", SKYBOX_TEXTURE, {}, scene);
    starsSkybox.scaling = new BABYLON.Vector3(SKYBOX_SIZE, SKYBOX_SIZE, SKYBOX_SIZE);   //Need to enlarge the skybox so the user doesn't zoom out into the skybox limit too early
    starsSkybox.mesh.checkCollisions = true;    //Ensures that the user can't go out of the universe (forbidden by physicists)
};