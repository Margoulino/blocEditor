//Div où s'affichent tous les blocs
var previewDisplay = document.getElementById("previewDisplay");

//ID de tous les blocs contenus dans des colonnes d'un autre bloc
var blockNoDisplay = [];

//Parcours de tous les blocs
for (var i = 0; i < blocks.length; i++) {

    //ID du bloc courrant
    var idBlock = blocks[i].id;

    var blockUnit = document.createElement("div");
    blockUnit.setAttribute("id", idBlock);

    //Si d'id du bloc courrant est dans le tab de ceux qu'on doit pas afficher on l'affiche pas
    if(blockNoDisplay.includes(blocks[i].id)) {
        //Affichage bloc 'normal'
        if (blocks[i].innerBlocks === "") {
            blockUnit.innerHTML = blocks[i].content;
            previewDisplay.appendChild(blockUnit);
        } else {
            //Recherche des blocs à afficher dans les colonnes
            blocks.forEach(block => {
                if(blocks[i].innerBlocks.values().includes(block.id)) {
                    blockNoDisplay.push(block.id);
                }
            });
        }
    }
}
