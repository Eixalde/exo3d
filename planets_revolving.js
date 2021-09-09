const planetsRevolving = function (scene) {

    let starOptions = {
        diameter: 2,
        updatable: true
    };

    let planetOptions = {
        diameter: 1,
        updatable: true
    };

    const star = BABYLON.MeshBuilder.CreateSphere("star", starOptions);
    const planet = BABYLON.MeshBuilder.CreateSphere("planet", planetOptions);  
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 5, new BABYLON.Vector3(0, 0, 0));
    
    const trajectoryRadius = 4;
    const precisionSteps = 50;
    let trajectory = [];

    // TODO : faire une fonction qui calcule n'importe quelle trajectoire elliptique, pas juste un cercle
    for (let i = 0; i <= precisionSteps*2; i++) {
        trajectory.push(new BABYLON.Vector3(trajectoryRadius * Math.cos((Math.PI / precisionSteps) * i), 0, trajectoryRadius * Math.sin((Math.PI / precisionSteps) * i)));
    }
    let trajectoryLine = BABYLON.MeshBuilder.CreateLines("trajectory", {points: trajectory});
    trajectoryLine.color = new BABYLON.Color4(1,0,0,1);

    const pos = new BABYLON.Vector3(trajectoryRadius,0,0);
    planet.position = pos;
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(4, 4, 0));
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