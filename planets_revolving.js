const planetsRevolving = function (scene) {

    const starOptions = {
        diameter: 2,
        updatable: true
    };

    const planetOptions = {
        diameter: 1,
        updatable: true
    };

    const trajectoryRadius = 4;
    const precisionSteps = 50;

    const V_ORIGIN = new BABYLON.Vector3(0,0,0);    //Origine du repère

    const star = BABYLON.MeshBuilder.CreateSphere("star", starOptions);
    const planet = BABYLON.MeshBuilder.CreateSphere("planet", planetOptions);  
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 5, V_ORIGIN);
    
    
    let trajectory = [];

    // TODO : faire une fonction qui calcule n'importe quelle trajectoire elliptique, pas juste un cercle
    for (let i = 0; i <= precisionSteps*2; i++) {
        trajectory.push(new BABYLON.Vector3(trajectoryRadius * Math.cos((Math.PI / precisionSteps) * i), 0, trajectoryRadius * Math.sin((Math.PI / precisionSteps) * i)));
    }
    let trajectoryLine = BABYLON.MeshBuilder.CreateLines("trajectory", {points: trajectory});
    trajectoryLine.color = new BABYLON.Color4(1,0,0,1);

    const PLANET_POSITION = new BABYLON.Vector3(trajectoryRadius,0,0);
    planet.position = PLANET_POSITION;
    camera.attachControl(canvas, true);

    //De nouveaux paramètres pourront être ajoutés pour les visuels, comme la température de l'étoile (pour sa couleur) ou la luminosité souhaitée
    const visualsParameters = {
        star: star, 
        planet: planet, 
        originLight: V_ORIGIN
    };

    objectVisuals (scene, visualsParameters);

    let frame = 0;
    //Partie animation de la planète
    scene.onBeforeRenderObservable.add(()=> {
        planet.position = trajectory[frame];     //La planète suivra toujours les coordonées utilisées pour créer la trajectoire, garder absolument ce système
        if (frame==trajectory.length - 1){
            frame = 0;
        } else {
            frame++;
        }
    });
};