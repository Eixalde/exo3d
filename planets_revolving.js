const planetsRevolving = function (scene, UI) {

    const starOptions = {
        diameter: 2,
        updatable: true
    };

    const planetOptions = {
        diameter: 1,
        updatable: true
    };

    const TRAJECTORY_RADIUS = 8;
    const PRECISION_STEPS = 100;

    const V_ORIGIN = new BABYLON.Vector3(0,0,0);    //Origine du repère

    const star = BABYLON.MeshBuilder.CreateSphere("star", starOptions);
    const planet = BABYLON.MeshBuilder.CreateSphere("planet", planetOptions);  
    
    const trajectory = new Array(PRECISION_STEPS+1);    //Il faut compter un point supplémentaire pour fermer la trajectoire

    // TODO : faire une fonction qui calcule n'importe quelle trajectoire elliptique, pas juste un cercle
    for (const i of trajectory.keys()) {
        trajectory[i] = new BABYLON.Vector3(TRAJECTORY_RADIUS * Math.cos((Math.PI / (PRECISION_STEPS/2)) * i), 0, TRAJECTORY_RADIUS * Math.sin((Math.PI / (PRECISION_STEPS/2)) * i));
    }
    let trajectoryLine = BABYLON.MeshBuilder.CreateLines("trajectory", {points: trajectory});
    trajectoryLine.color = new BABYLON.Color4(1,0,0,1);

    const PLANET_POSITION = new BABYLON.Vector3(TRAJECTORY_RADIUS,0,0);
    planet.position = PLANET_POSITION;

    //De nouveaux paramètres pourront être ajoutés pour les visuels, comme la température de l'étoile (pour sa couleur) ou la luminosité souhaitée
    const visualsParameters = {
        star: star, 
        planet: planet, 
        originLight: V_ORIGIN
    };
    
    objectVisuals (scene, visualsParameters);
    
    //Inspiré du tutoriel de babylon.js sur l'animation avec clés : https://doc.babylonjs.com/start/chap3/animation
    const animPlanet = new BABYLON.Animation ("xPlanet","position",60,BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    const planetKeys = new Array(PRECISION_STEPS+1);    //Il faut compter une position supplémentaire pour boucler l'animation
    for (const i of planetKeys.keys()){
        planetKeys[i] = {
            frame: i,
            value: trajectory[i]
        };
    }
    animPlanet.setKeys(planetKeys);
    planet.animations = [];
    planet.animations.push(animPlanet);

    let animatable;     //Inspiré de l'exemple suivant : https://www.babylonjs-playground.com/#14EGUT#26
    const animSpeed = 0.5;
    animatable = scene.beginAnimation(planet,0,PRECISION_STEPS,true,animSpeed);   //Il faut aller jusqu'au dernier indice, donc "PRECISION_STEPS"
    emulSpeed(scene,UI,animatable);
    cameraModes(scene,UI,star,planet);
};