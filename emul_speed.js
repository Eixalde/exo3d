const emulSpeed = function (scene,UI,animatable){
    let emulGrid = new BABYLON.GUI.Grid();

    for (let i = 0; i<4; i++){
        emulGrid.addRowDefinition(1);
    }
    emulGrid.height = 0.1;      //La taille de l'UI est arbitraire pour l'instant
    emulGrid.width = 0.15;
    emulGrid.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    emulGrid.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

    btnTitles = ["Pause",
                "Ralenti",
                "Normal"];
    const ANIMATION_SPEED = [0, 0.2, 0.5];   //Les vitesses d'animation sont aussi arbitraires, à l'exception du zéro (arrêt)

    for (const [idx, title] of btnTitles.entries()) {    //Merci à Pierre-Yves Martin pour m'avoir proposé cette syntaxe
        const spdButton = BABYLON.GUI.Button.CreateSimpleButton("",title);
        spdButton.height = 0.9;         //Taille de boutons arbitraire
        spdButton.width = 0.6;
        spdButton.background = "white";
        emulGrid.addControl(spdButton, idx+1, 0);
        spdButton.onPointerClickObservable.add(() => {
            animatable.speedRatio = ANIMATION_SPEED[i];
        });
    }

    const tSize = (window.innerWidth/window.innerHeight)*7;       //Taille de police arbitraire également
    const descEmulSpeed = new BABYLON.GUI.TextBlock("descEmulSpeed","Vitesse de l'animation :");
    descEmulSpeed.textSize = tSize;
    descEmulSpeed.color = "white";
    emulGrid.addControl(descEmulSpeed);
    emulGrid.fontSize = tSize;
    UI.addControl(emulGrid);
};