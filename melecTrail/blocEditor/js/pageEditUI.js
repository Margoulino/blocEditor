//Sidebar menu des options de blocks
function openNav() {
    document.querySelector(".blockMenu").style.width = "250px";
}

function closeNav() {
    document.querySelector(".blockMenu").style.width = "0";
}

//Suppression de block
var delButtons = document.querySelectorAll(".deleteBlock");
delButtons.forEach(delBtn => {
    delBtn.addEventListener("click", function() {
        if (confirm("Confirmer la suppression du bloc ?")) {
            deleteBlock(delBtn.parentElement.parentElement.getAttribute("id")).then(
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
            saveBlock(nomPage, editor.getData(), idNewBlock, 5, "", "").then(function() {
                location.reload();
            });
        });
    });
});

//Edition block double click
$(".block-unit").one("dblclick", function() {
    htmlEditorInit(event.target, event.target.innerHTML).then(function(editor) {
        var blockToUpdate = null;
        previousBlocks.forEach(pblock => {
            if (pblock.id === event.target.getAttribute("id")) {
                blockToUpdate = pblock;
            }
        });
        var btnSave = document.getElementById("blockSave");
        btnSave.addEventListener("click", function() {
            updateBlock(
                blockToUpdate.id,
                blockToUpdate.name,
                editor.getData(),
                pageId,
                blockToUpdate.orderBlock,
                blockToUpdate.idBlockType,
                blockToUpdate.idParent,
                blockToUpdate.idColumn,
                blockToUpdate.styleBlock
            ).then(function() {
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