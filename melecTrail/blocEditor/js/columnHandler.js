//Ajout d'un block 2Cols à la fin de la page via requete xhr post
$("#2colOption").on("click", function() {
    closeNav();
    interfaceBlock.scrollIntoView({behavior: "smooth"});
    var data = JSON.stringify({
        name: nomPage + "_" + idNewBlock,
        orderBlock: idNewBlock,
        pageId: pageId,
        idBlockType: "1"
    });
    saveBlock(data).then(function() {
        location.reload();
    });
});

//Ajout d'un block 3Cols à la fin de la page via requete xhr post
$("#3colOption").on("click", function() {
    closeNav();
    interfaceBlock.scrollIntoView({behavior: "smooth"});
    var data = JSON.stringify({
        name: nomPage + "_" + idNewBlock,
        orderBlock: idNewBlock,
        pageId: pageId,
        idBlockType: "2"
    });
    saveBlock(data).then(function() {
        location.reload();
    });
});

//Renvoie l'innerHTML d'un block sans inclure les boutons de l'interface
function getInnerHTMLCol(elem) {
    return new Promise(function(resolve, reject) {
        if (elem !== undefined) {
            resolve(elem.innerHTML);
        } else {
            reject();
        }
    });
}

$(document).ready(function() {
    $(".addBlockCol").on("click", function(event) {
        var idParent = $(this)
            .closest(".block-unit-complex")
            .attr("id");
        var idColumn = $(this)
            .closest(".column")
            .attr("id");
        var idBlockParent = event.currentTarget.parentElement.parentElement.parentElement.parentElement.getAttribute("id");
        var blockParent = findBlockById(idBlockParent, previousBlocks);
        $("#innerBlockModal").modal("show");
        //Ajout d'un block text à la colonne via requete xhr post
        $("#textBlock").one("click", function(e) {
            //si le bouton n'est pas cliqué empêche le spam de l'alerte s'il est sélectionné ensuite
            e.preventDefault();
            e.stopImmediatePropagation();
            $("#innerBlockModal").modal("toggle");
            var idCol = event.currentTarget.parentElement.parentElement.getAttribute("id");
            htmlEditorInit(event.currentTarget.parentElement.parentElement, "").then(function(editor) {
                $("#innerBlockModal").modal("toggle");
                var btnSave = document.getElementById("blockSave");
                var btnDel = document.getElementById("blockDelete");
                btnSave.addEventListener("click", function() {
                    var data = {
                        name: nomPage + "_" + idNewBlock,
                        content: editor.getData(),
                        pageId: pageId,
                        orderBlock: null,
                        idBlockType: 5,
                        idParent: idBlockParent,
                        idColumn: idCol,
                        styleBlock: ""
                    };
                    //Vérification du sous niveau du block qu'on veut ajouter
                    if (subLevels[blockParent.idBlockType] > parentCounter(blockParent.id, previousBlocks)) {
                        saveBlockIntoBlock(JSON.stringify(data)).then(function() {
                            location.reload();
                        });
                    } else {
                        alert("Ajout impossible, ce bloc se situe à un sous niveau trop élevé");
                    }
                });
                btnDel.addEventListener("click", function() {
                    location.reload();
                });
            });
        });
        //Ajout d'un bloc image à la colonne via requete xhr post
        $("#imgBlock").one("click", function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $("#innerBlockModal").modal("toggle");
            $("#uploadImageModal").modal("show");
            $("#selectImg").off();
            $("#selectImg").on("click", function() {
                $("#uploadImageModal").modal("toggle");
                var data = JSON.stringify({
                    name: nomPage + "_" + idNewBlock,
                    content: $(".image_picker_selector .selected img").attr("src"),
                    idParent: idParent,
                    idColumn: idColumn,
                    orderBlock: null,
                    idBlockType: "4",
                    pageId: pageId
                });
                //Vérification du sous niveau du block qu'on veut ajouter
                if (subLevels[blockParent.idBlockType] > parentCounter(blockParent.id, previousBlocks)) {
                    saveBlock(data).then(function() {
                        location.reload();
                    });
                } else {
                    alert("Ajout impossible, ce bloc se situe à un sous niveau trop élevé");
                }
            });
        });
        //Ajout d'un bloc carousel à la colonne via requete xhr post
        $("#carouselBlock").one("click", function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $("#innerBlockModal").modal("toggle");
            $("#uploadImageModal").modal("show");
            $("select").attr("multiple", "multiple");
            $("select").imagepicker();
            $("#selectImg").off();
            $("#selectImg").on("click", function() {
                $("#uploadImageModal").modal("toggle");
                var imgSrc = [];
                $(".image_picker_selector .selected img").each(function(index) {
                    imgSrc.push($(this).attr("src"));
                });
                var data = JSON.stringify({
                    name: nomPage + "_" + idNewBlock,
                    content: imgSrc.join(" ; "),
                    idParent: idParent,
                    idColumn: idColumn,
                    orderBlock: null,
                    idBlockType: "3",
                    pageId: pageId
                });
                //Vérification du sous niveau du block qu'on veut ajouter
                if (subLevels[blockParent.idBlockType] > parentCounter(blockParent.id, previousBlocks)) {
                    saveBlock(data).then(function() {
                        location.reload();
                    });
                } else {
                    alert("Ajout impossible, ce bloc se situe à un sous niveau trop élevé");
                }
            });
        });
        //Ajout d'un bloc gallerie à la colonne via requete xhr post
        $("#galleryBlock").one("click", function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $("#innerBlockModal").modal("toggle");
            $("#uploadImageModal").modal("show");
            $("select").attr("multiple", "multiple");
            $("select").imagepicker();
            $("#selectImg").off();
            $("#selectImg").on("click", function() {
                $("#uploadImageModal").modal("toggle");
                var imgSrc = [];
                $(".image_picker_selector .selected img").each(function(index) {
                    imgSrc.push($(this).attr("src"));
                });
                var data = JSON.stringify({
                    name: nomPage + "_" + idNewBlock,
                    content: imgSrc.join(" ; "),
                    idParent: idParent,
                    idColumn: idColumn,
                    orderBlock: null,
                    idBlockType: "6",
                    pageId: pageId
                });
                //Vérification du sous niveau du block qu'on veut ajouter
                if (subLevels[blockParent.idBlockType] > parentCounter(blockParent.id, previousBlocks)) {
                    saveBlock(data).then(function() {
                        location.reload();
                    });
                } else {
                    alert("Ajout impossible, ce bloc se situe à un sous niveau trop élevé");
                }
            });
        });
        //Ajout d'un bloc 2Col à la colonne via requete xhr post
        $("#2ColBlock").one("click", function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $("#innerBlockModal").modal("toggle");
            var data = JSON.stringify({
                name: nomPage + "_" + idNewBlock,
                idParent: idParent,
                idColumn: idColumn,
                orderBlock: null,
                idBlockType: "1",
                pageId: pageId
            });
            //Vérification du sous niveau du block qu'on veut ajouter
            if (subLevels[blockParent.idBlockType] > parentCounter(blockParent.id, previousBlocks)+1) {
                saveBlock(data).then(function() {
                    location.reload();
                });
            } else {
                alert("Ajout impossible, ce bloc se situe à un sous niveau trop élevé");
            }
        });
        //Ajout d'un bloc 3Col à la colonne via requete xhr post
        $("#3ColBlock").one("click", function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $("#innerBlockModal").modal("toggle");
            var data = JSON.stringify({
                name: nomPage + "_" + idNewBlock,
                idParent: idParent,
                idColumn: idColumn,
                orderBlock: null,
                idBlockType: "2",
                pageId: pageId
            });
            //Vérification du sous niveau du block qu'on veut ajouter
            if (subLevels[blockParent.idBlockType] > parentCounter(blockParent.id, previousBlocks)+1) {
                saveBlock(data).then(function() {
                    location.reload();
                });
            } else {
                alert("Ajout impossible, ce bloc se situe à un sous niveau trop élevé");
            }
        });
    });
});
