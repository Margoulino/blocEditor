//Div où s'affichent tous les blocs
var previewDisplay = document.getElementById("previewDisplay");

//ID de tous les blocs contenus dans des colonnes d'un autre bloc
var blockNoDisplay = [];

blocks.forEach(block => {
    var blockUnit = document.createElement("div");
    blockUnit.setAttribute("id", block.id);
    blockUnit.innerHTML = block.content;
    previewDisplay.appendChild(blockUnit);
});

$(document).ready(function () {
    blocks.forEach(block => {
        if(block.innerBlocks != "") {
            var innerTab = JSON.parse(block.innerBlocks);
            var cols = document.getElementById(block.id).childNodes[0].childNodes;
            Object.keys(innerTab).forEach(function (k) {
                var node = document.getElementById(innerTab[k]);
                cols.forEach(col => {
                    if(col.getAttribute('id') == k) {
                        col.innerHTML = node.innerHTML;
                    }
                });
                node.parentElement.removeChild(node);
            });
        }
    });
});