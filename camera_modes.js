const cameraModes = function (scene,UI,star,planet){

    //TODO : trouver un moyen de définir les trois variables hitboxRadius, starCamDist et planetCamDist en fonction des dimensions des corps célestes
    //Note : les constantes ci-dessous sont amenées à dépendre d'un autre paramètre et ne sont pas des constante pures, elles ne sont pas en majuscules
    const hitboxRadius = 2;    //Valeur de 2 par défaut car l'étoile a un diamètre de 2 (distance de hitbox = 1 diamètre pour voir l'étoile en entier)

    //Caméra centrée sur l'étoile/le système
    const starCamDist = 5;  //Même remarque que pour hitboxRadius, ceci devra dépendre de la taille de l'astre
    const starCamera = new BABYLON.ArcRotateCamera("starCamera", -Math.PI / 2, Math.PI / 3, starCamDist, star.position);
    starCamera.attachControl(canvas, true);    

    //Caméra centrée sur la planète
    const planetCamDist = 3;    //Devra dépendre de la taille de la planète
    const planetCamera = new BABYLON.ArcFollowCamera("planetCamera",-Math.PI / 2, Math.PI / 6, planetCamDist, planet.mesh, scene);

    //Caméra libre
    //TODO : prévoir un mini tutoriel pour les commandes
    const FREE_CAM_POS = new BABYLON.Vector3(0,1,-8);   //Position de départ arbitraire pour la caméra libre
    const freeCamera = new BABYLON.UniversalCamera("freeCamera", FREE_CAM_POS, scene);
    freeCamera.inputs.addMouseWheel();

    //Collisions pour les caméras
    scene.collisionsEnabled = true;
    starCamera.checkCollisions = true;
    starCamera.collisionRadius = new BABYLON.Vector3(hitboxRadius, hitboxRadius, hitboxRadius);
    freeCamera.checkCollisions = true;
    freeCamera.ellipsoid = new BABYLON.Vector3(hitboxRadius, hitboxRadius, hitboxRadius);
    star.checkCollisions = true;
    planet.mesh.checkCollisions = true;

    const CAMERA_MODES_LABELS = {
        menuLabel: "Type de caméra :",                          //Nom de l'interface
        buttonLabels : ["Système/étoile", "Planète", "Libre"]   //Noms des boutons
    }
                                
    const cameraGridParameters = {
        UI: UI,
        gridLabels: CAMERA_MODES_LABELS,
        hAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
        vAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
        gridWidth: 0.15,
        gridHeight: 0.1,
        actionOnClick: (btnLabel) => {                     //La fonction que l'on passera en paramètre plus bas et qui sera l'action du bouton
            switch (btnLabel){
                case CAMERA_MODES_LABELS.buttonLabels[0]:   //Bouton caméra système/étoile
                    scene.activeCamera = starCamera;
                    starCamera.attachControl(canvas, true); //Le contrôle de la caméra système/étoile doit être réactivé lorsque celle-ci devient active
                    freeCamera.detachControl();             //Donc il faut aussi désactiver le contrôle de la caméra libre
                    break;
                case CAMERA_MODES_LABELS.buttonLabels[1]:   //Bouton caméra planète
                    scene.activeCamera = planetCamera;
                    starCamera.detachControl();             //Le contrôle de la caméra système/étoile doit être désactivé lorsqu'elle n'est plus active
                    freeCamera.detachControl();             //Idem pour la caméra libre
                    break;
                case CAMERA_MODES_LABELS.buttonLabels[2]:   //Bouton caméra libre
                    scene.activeCamera = freeCamera;
                    freeCamera.attachControl(canvas, true); //On active le contrôle de la caméra libre
                    starCamera.detachControl();             //On désactive le contrôle de la caméra système/étoile
                    break;
            }
        }
    };

    generateButtonMenu(cameraGridParameters);
};