const debugUI = function (scene){
    let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    let buttons = [];
    let meshIndex = 0, tSize = 20;
    let descUI = new BABYLON.GUI.TextBlock("","Liste des Mesh à l'écran (cliquer pour masquer/afficher) :");
    descUI.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    descUI.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    descUI.left = tSize;
    descUI.textSize = tSize*1.5;
    descUI.color = "white";
    advancedTexture.addControl(descUI);

    scene.meshes.forEach((e => {
        buttons[meshIndex] = BABYLON.GUI.Button.CreateSimpleButton("",e.name);
        buttons[meshIndex].horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        buttons[meshIndex].verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        buttons[meshIndex].left = tSize;
        buttons[meshIndex].top = (meshIndex+1)*tSize;
        buttons[meshIndex].color = "black";
        buttons[meshIndex].background = "white";
        buttons[meshIndex].width = 4*tSize/window.innerWidth;
        buttons[meshIndex].height = tSize/window.innerHeight;
        buttons[meshIndex].onPointerClickObservable.add(function(){
            if (e.isEnabled()){
                e.setEnabled(false);
            } else {
                e.setEnabled(true);
            }
            
        });
        advancedTexture.addControl(buttons[meshIndex]);
        meshIndex++;
    }));    
};