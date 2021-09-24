import { objectVisuals, emulSpeed, cameraModes } from "../modules.mjs";

const planetsRevolving = function (scene, UI, canvas) {

    const starOptions = {
        diameter: 2,
        updatable: true
    };

    const planetOptions = {
        diameter: 1,
        updatable: true
    };

    const satelliteOptions = {
        diameter: 0.3,
        updatable: true
    };

    const TRAJECTORY_RADIUS = 8;
    const PRECISION_STEPS = 100;

    const V_ORIGIN = new BABYLON.Vector3(0,0,0);    //Origine du repère

    const star = BABYLON.MeshBuilder.CreateSphere("star", starOptions);

    //Planet is now an object so it can handle properties, like the fact that it is from the solar system or not, or its diameter
    //This shall be applied to star as well, especially for camera settings and other dimension-dependant features in general
    const planet = { 
        mesh: BABYLON.MeshBuilder.CreateSphere("planet", planetOptions),
        isFromSolarSystem : true,
        diameter: planetOptions.diameter
    } 

    const satellite = {
        mesh: BABYLON.MeshBuilder.CreateSphere("satellite",satelliteOptions),
        diameter: satelliteOptions.diameter,
        distance: 2      //Arbitrary position relative to the planet
    }

    satellite.mesh.parent = planet.mesh;
    satellite.mesh.position = new BABYLON.Vector3(satellite.distance, 0, 0);
    
    const trajectory = new Array(PRECISION_STEPS+1);    //Il faut compter un point supplémentaire pour fermer la trajectoire

    // TODO : faire une fonction qui calcule n'importe quelle trajectoire elliptique, pas juste un cercle
    for (const i of trajectory.keys()) {
        trajectory[i] = new BABYLON.Vector3(TRAJECTORY_RADIUS * Math.cos((Math.PI / (PRECISION_STEPS/2)) * i), 0, TRAJECTORY_RADIUS * Math.sin((Math.PI / (PRECISION_STEPS/2)) * i));
    }
    let trajectoryLine = BABYLON.MeshBuilder.CreateLines("trajectory", {points: trajectory});
    trajectoryLine.color = new BABYLON.Color4(1,0,0,1);

    const PLANET_POSITION = new BABYLON.Vector3(TRAJECTORY_RADIUS,0,0);
    planet.mesh.position = PLANET_POSITION;
    
    planet.mesh.animations = [];
    const ANIM_SPEED = 6;   //Custom parameter : define the number of frames needed between two keys of animation. Higher = slower animation

    //De nouveaux paramètres pourront être ajoutés pour les visuels, comme la température de l'étoile (pour sa couleur) ou la luminosité souhaitée
    const visualsParameters = {
        star: star, 
        planet: planet, 
        satellite: satellite,
        originLight: V_ORIGIN,
        animationSpeed: ANIM_SPEED
    };
    objectVisuals (scene, visualsParameters);
    
    //Inspiré du tutoriel de babylon.js sur l'animation avec clés : https://doc.babylonjs.com/start/chap3/animation
    const animPlanet = new BABYLON.Animation ("xPlanet","position",60,BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    const planetKeys = new Array(PRECISION_STEPS+1);    //Il faut compter une position supplémentaire pour boucler l'animation
    for (const i of planetKeys.keys()){
        planetKeys[i] = {
            frame: ANIM_SPEED*i,
            value: trajectory[i]
        };
    }
    animPlanet.setKeys(planetKeys);
    planet.mesh.animations.push(animPlanet);

    let animatable;     //Inspiré de l'exemple suivant : https://www.babylonjs-playground.com/#14EGUT#26
    animatable = scene.beginAnimation(planet.mesh,0,ANIM_SPEED*PRECISION_STEPS, true);   //From first frame "0" to last "ANIM_SPEED*PRECISION_STEPS"
    emulSpeed(scene, UI, animatable, canvas);   //giving canvas as parameter for emulSpeed
    cameraModes(scene,UI,star,planet);
};

export {planetsRevolving};