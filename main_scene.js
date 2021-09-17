const createScene = function (engine) {
    const scene = new BABYLON.Scene(engine); 
    const generalUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("generalUI");
    planetsRevolving(scene,generalUI);
    scene.debugLayer.show({ // L'inspector fourni par babylon.js, permet de manipuler assez largement la scène pendant son exécution
        embedMode: true
    });
    //Pour afficher l'UI debug, il faut insérer "debugUI(scene);", sinon seul l'inspector sera actif
    return scene;
};