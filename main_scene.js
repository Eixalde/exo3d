const createScene = function (engine) {
    const scene = new BABYLON.Scene(engine); 
    planetsRevolving(scene);
    debugUI(scene);
    return scene;
};