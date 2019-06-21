//Sidebar menu des options de blocks
function openNav() {
    document.querySelector(".blockMenu").style.width = "260px";
}

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

blockTextBtn.addEventListener("click", function() {
    htmlEditorInit(interfaceBlock, "").then(function(editor) {
        closeNav();
        var btnSave = document.getElementById("blockSave");
        btnSave.addEventListener("click", function() {
            var data = {
                name: nomPage + "_" + idNewBlock,
                content: editor.getData(),
                pageId: pageId,
                orderBlock: idNewBlock,
                idBlockType: 5,
                idParent: "",
                idColumn: "",
                styleBlock: ""
            };
            saveBlock(JSON.stringify(data)).then(function() {
                location.reload();
            });
        });
    });
});

/**
 * Revoie l'innerHTML d'un élément sans les élément d'interface de type bouton (bouton ajout, bouton modif)
 * @param {HTML Element} elem Element dans lequel on veut réccupérer l'innerHTML
 */
function getInnerHTML(elem) {
    var elems = [];
    elem.childNodes.forEach(child => {
        if (child.tagName !== "BUTTON") {
            if(child.innerHTML !== "") {
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

//Edition block double click
$(".editBlock").one("click", function(event) {
    var idParentBlock = event.currentTarget.parentElement.getAttribute("id");
    htmlEditorInit(event.currentTarget.parentElement, getInnerHTML(event.currentTarget.parentElement).trim()).then(function(editor) {
        var blockToUpdate = {};
        previousBlocks.forEach(pblock => {
            if (pblock.id === idParentBlock) {
                blockToUpdate = pblock;
            }
        });
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
