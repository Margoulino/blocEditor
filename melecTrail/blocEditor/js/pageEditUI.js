//-----Sidebar menu des options de blocks-----
//Ouverture du menu latéral
function openNav() {
    document.querySelector(".blockMenu").style.width = "260px";
}

//Fermeture du menu latéral
function closeNav() {
    document.querySelector(".blockMenu").style.width = "0";
}

//Suppression de block
var delButtons = document.querySelectorAll(".deleteBlock");
delButtons.forEach(delBtn => {
    delBtn.addEventListener("click", function() {
        if (confirm("Confirmer la suppression du bloc ?")) {
            deleteBlock(delBtn.parentElement.getAttribute("id")).then(
                function() {
                    location.reload();
                },
                function(error) {
                    alert(error);
                }
            );
        }
    });
});

//Editeur HTML Ajout BlockText
var interfaceBlock = document.querySelector(".interface-block");
var blockTextBtn = document.getElementById("textOption");

//Ajout bloc text et initialisation de l'editeur ckeditor
blockTextBtn.addEventListener("click", function() {
    htmlEditorInit(interfaceBlock, "").then(function(editor) {
        closeNav();
        var btnSave = document.getElementById("blockSave");
        var btnDel = document.getElementById("blockDelete");
        interfaceBlock.scrollIntoView({behavior: "smooth"});
        btnSave.addEventListener("click", function() {
            var data = {
                name: nomPage + "_" + idNewBlock,
                content: editor.getData(),
                pageId: pageId,
                orderBlock: idNewBlock,
                idBlockType: 5,
                styleBlock: ""
            };
            saveBlock(JSON.stringify(data)).then(function() {
                location.reload();
            });
        });
        btnDel.addEventListener("click", function() {
            location.reload();
        });
    });
});

/**
 * Revoie l'innerHTML d'un élément sans les élément d'interface de type bouton (bouton ajout, bouton modif)
 * Ne prend pas les tag <p> vides
 * @param {HTML Element} elem Element dans lequel on veut réccupérer l'innerHTML
 */
function getInnerHTML(elem) {
    var elems = [];
    elem.childNodes.forEach(child => {
        if (child.tagName !== "BUTTON") {
            if (child.innerHTML !== "") {
                elems.push(child);
            }
        }
    });
    var div = document.createElement("div");
    elems.forEach(elem => {
        div.appendChild(elem);
    });
    return div.innerHTML;
}

//Edition de blocks bouton edition
$(".editBlock").one("click", function(event) {
    var idParentBlock = event.currentTarget.parentElement.getAttribute("id");
    htmlEditorInit(event.currentTarget.parentElement, getInnerHTML(event.currentTarget.parentElement).trim()).then(function(editor) {
        var blockToUpdate = {};
        previousBlocks.forEach(pblock => {
            if (pblock.id === idParentBlock) {
                blockToUpdate = pblock;
            }
        });
        var btnDel = document.getElementById("blockDelete");
        var btnSave = document.getElementById("blockSave");
        btnSave.addEventListener("click", function() {
            var data = {
                id: blockToUpdate.id,
                name: blockToUpdate.name,
                content: editor.getData(),
                pageId: pageId,
                orderBlock: blockToUpdate.orderBlock,
                idBlockType: blockToUpdate.idBlockType,
                idParent: blockToUpdate.idParent,
                idColumn: blockToUpdate.idColumn,
                styleBlock: blockToUpdate.styleBlock
            };
            updateBlock(JSON.stringify(data)).then(function() {
                location.reload();
            });
        });
        btnDel.addEventListener("click", function() {
            deleteBlock(blockToUpdate.id).then(function() {
                location.reload();
            });
        });
    });
});

//Modif ordre block
var downArrows = document.querySelectorAll("[id^=orderDown]");
downArrows.forEach(arrow => {
    arrow.addEventListener("click", function(e) {
        moveBlockDown(e, previousBlocks);
    });
});

var upArrows = document.querySelectorAll("[id^=orderUp]");
upArrows.forEach(arrow => {
    arrow.addEventListener("click", function(e) {
        moveBlockUp(e, previousBlocks);
    });
});

var removeCategs = document.querySelectorAll(".removeCateg");
removeCategs.forEach(remCat => {
    remCat.addEventListener("click", function(e) {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
            var categoryId = e.target.getAttribute("id");
            var data = {
                pageId: pageId,
                categoryId: categoryId
            };
            deleteCategory(JSON.stringify(data)).then(function() {
                location.reload();
            });
        }
    });
});

var addExistingCateg = document.querySelectorAll(".categChoice");
addExistingCateg.forEach(categChoice => {
    categChoice.addEventListener("click", function(e) {
        if (confirm("Êtes-vous sûr de vouloir attribuer cette catégorie ?")) {
            var categoryId = e.target.getAttribute("id");
            var data = {
                pageId: pageId,
                categoryId: categoryId
            };
            addCategory(JSON.stringify(data)).then(function() {
                location.reload();
            });
        }
    });
});

var addCategoryDrop = document.getElementById("addCategoryDrop");
addCategoryDrop.addEventListener("click", function(e) {
    $("#addCategoryModal").modal("show");
});

var saveNewCategBtn = document.getElementById("saveCat");

//Enregistrement d'une nouvelle catégorie
saveNewCategBtn.addEventListener("click", function() {
    if (confirm("Êtes-vous sûr de vouloir créer cette catégorie ?")) {
        var catName = document.getElementById("catname").value;
        if (catName !== undefined && catName !== "") {
            var data = {
                name: catName
            };
            createNewCategory(JSON.stringify(data)).then(function() {
                findCategoryByName(JSON.stringify(data)).then(function(response) {
                    var dataAdd = {
                        pageId: pageId,
                        categoryId: response[0]
                    };
                    addCategory(JSON.stringify(dataAdd)).then(function() {
                        location.reload();
                    });
                });
            });
        }
    }
});

//Publication d'une page
var publishBtn = document.getElementById("pagePublish");
if (publishBtn !== undefined && publishBtn !== null) {
    publishBtn.addEventListener("click", function() {
        if (confirm("Êtes-vous sûr de vouloir publier cette page ?")) {
            publishPage(pageId).then(function() {
                location.reload();
            });
        }
    });
}

//Dépublication d'une page
var depublishBtn = document.getElementById("pageDepublish");
if (depublishBtn !== undefined && depublishBtn !== null) {
    depublishBtn.addEventListener("click", function() {
        if (confirm("Êtes-vous sûr de vouloir dépublier cette page ?")) {
            depublishPage(pageId).then(function() {
                location.reload();
            });
        }
    });
}

//Enregistrement de la description
var saveDescrBtn = document.getElementById("descriptionSave");
saveDescrBtn.addEventListener("click", function() {
    if(confirm("Êtes-vous sûr de vouloir publier cette description ?")) {
        var descrContent = document.getElementById("description").value;
        saveDescription(pageId, descrContent).then(function() {
            location.reload();
        });
    }
});

//Ajout d'un mot clé
var addKeywordBtn = document.querySelectorAll(".addKeyword")[0];
addKeywordBtn.addEventListener("click", function() {
    $("#newKeywordModal").modal("show");
});

//Enregistrement de mots clés
var saveNewKeyword = document.getElementById("saveNewKeyword");
saveNewKeyword.addEventListener("click", function(e) {
    var kwName = document.getElementById("kwName").value;
    var kwArr = getAllKeywords();
    kwArr.push(kwName);
    var data = {
        pageId: pageId,
        keywords: JSON.stringify(kwArr)
    };
    saveKeywords(data).then(function() {
        location.reload();
    })
});

//Suppression de mot clés
var removeKeywordBtns = document.querySelectorAll(".removeKeyword");
removeKeywordBtns.forEach(btn => {
    btn.addEventListener("click", function(e) {
        if(confirm("Êtes-vous sûr de vouloir supprimer ce mot clé ?")) {
            var keywordContainer = e.target.parentElement.parentElement;
            keywordContainer.removeChild(e.target.parentElement);
            var kwArr = getAllKeywords();
            var data = {
                pageId: pageId,
                keywords: JSON.stringify(kwArr)
            };
            saveKeywords(data).then(function() {
                location.reload();
            });
        }
    });
});

var nameCompletionBtn = document.querySelectorAll(".nameCompletionSave")[0];
nameCompletionBtn.addEventListener("click", function() {
    if(confirm("Êtes-vous sûr de vouloir enregistrer ce complement de titre ?")) {
        var nameCompletionValue = document.querySelectorAll(".nameCompletion")[0].value;
        var data = {
            pageId: pageId,
            nameCompletion: nameCompletionValue
        };
        saveNameCompletion(data).then(function() {
            location.reload();
        });
    }
});