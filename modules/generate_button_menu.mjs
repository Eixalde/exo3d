const generateButtonMenu = function ({UI, gridLabels, actionOnClick, hAlignment, vAlignment, gridWidth, gridHeight}){
    const tSize = (window.innerWidth/window.innerHeight)*7;       //Taille de police arbitraire
    let menuGrid = new BABYLON.GUI.Grid();

    menuGrid.width = gridWidth;
    menuGrid.height = gridHeight;
    
    menuGrid.horizontalAlignment = hAlignment;
    menuGrid.verticalAlignment = vAlignment;

    menuGrid.fontSize = tSize;

    const gridTitle = new BABYLON.GUI.TextBlock("",gridLabels.menuLabel);
    gridTitle.textSize = tSize;
    gridTitle.color = "white";
    menuGrid.addControl(gridTitle,0,0);  //Le titre du menu doit être placé en position (0,0), soit le début de la grille

    for (const [idx, title] of gridLabels.buttonLabels.entries()){     //Merci à Pierre-Yves Martin pour m'avoir proposé cette syntaxe
        menuGrid.addRowDefinition(1);
        const gridButton = BABYLON.GUI.Button.CreateSimpleButton("",title);
        gridButton.height = 0.9;         //Taille de boutons arbitraire
        gridButton.width = 0.6;
        gridButton.background = "white";

        //On associe au bouton la fonction renseignée via les paramètres
        gridButton.onPointerClickObservable.add(() => {
            actionOnClick(title);       //On passe le label du bouton en paramètre pour que chaque menu reconnaisse l'action associée
        });
        menuGrid.addControl(gridButton,idx+1,0);    //On doit placer le bouton en position idx+1 car la position 0 est prise par le menu (et idx part de 0)
    }
    UI.addControl(menuGrid);
};

export {generateButtonMenu};