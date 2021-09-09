const createScene = function (engine) {
    const scene = new BABYLON.Scene(engine); 
    planetsRevolving(scene);
    return scene;
};