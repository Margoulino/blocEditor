document.addEventListener("DOMContentLoaded", function() {
    //Suppression des boutons ajoutés via le js dans les blocks, au chargement de la page
    var blocks = document.querySelectorAll(".block-unit");
    blocks.forEach(block => {
        var childrenBlock = [].slice.call(block.children);
        childrenBlock.forEach(child => {
            if (child.nodeName === "BUTTON") {
                child.parentElement.removeChild(child);
            }
        });
    });

    //Suppression des lignes {col...} qui apparaissent dans les colonnes des blocks colonne
    var columns = document.querySelectorAll(".row.block");
    columns.forEach(col => {
        var colChildren = [].slice.call(col.children);
        colChildren.forEach(colChild => {
            if (/^{col/.test(colChild.innerHTML.trim())) {
                colChild.innerHTML = "";
            }
        });
    });
    //Suppression des boutons "+" des colonnes vides des blocs colonnes
    var divBtn = document.querySelectorAll(".text-center");
    divBtn.forEach(divB => {
        divB.parentElement.removeChild(divB);
    });
});
