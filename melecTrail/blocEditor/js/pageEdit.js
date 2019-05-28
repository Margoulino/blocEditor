var blockTextButton = document.getElementById("textOption");
var interfaceBlock = document.querySelector(".interface-block");

var blockUnits = document.querySelectorAll(".block-unit");

blockUnits.forEach(blockUnit => {
    blockUnit.addEventListener("dblclick", function(e) {
        htmlEditorInit(blockUnit, "update", blockUnit.innerHTML);
        e.target.removeEventListener(e.type, arguments.callee);
    });
});

blockTextButton.addEventListener("click", function() {
    htmlEditorInit(interfaceBlock, "save", "");
});

function htmlEditorInit(targetElement, operation, previousContent) {
    var blockId = targetElement.getAttribute("id");
    targetElement.innerHTML = "";
    targetElement.innerHTML =
        '<div class="card"><div class="card-body"><div class="row"><div class="col"><textarea name="content" id="editor' +
        blockId +
        '"></textarea></div></div><div class="row"><div class="col"><a id="blockSave" class="btn btn-success" href="#">Sauvegarder le bloc</a></div></div></div></div>';
    let editor;

    ClassicEditor.create(document.querySelector("#editor" + blockId))
        .then(newEditor => {
            editor = newEditor;
            if (previousContent !== undefined && previousContent !== "") {
                editor.setData(previousContent);
            }
        })
        .catch(error => {
            console.error(error);
        });

    document.querySelector("#blockSave").addEventListener("click", () => {
        var content = editor.getData();

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                console.log("enregistrement du bloc effectué");
                location.reload();
            }
        };

        if (operation === "save") {
            xhr.open("POST", "/block/addBlockToPage", true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(
                JSON.stringify({
                    name: nomPage + "_" + idNewBlock,
                    content: content,
                    pageId: pageId,
                    orderBlock: idNewBlock,
                    idBlockType: 1,
                    nombreCol: 1,
                    innerBlocks: ""
                })
            );
        } else if (operation === "update") {
            var currentBlock = "";
            previousBlocks.forEach(block => {
                if(blockId == block.id) {
                    currentBlock = block;
                    xhr.open("POST", "/block/updateBlock", true);
                    xhr.setRequestHeader("Content-type", "application/json");
                    xhr.send(
                        JSON.stringify({
                            id: blockId,
                            name: block.name,
                            content: content,
                            pageId: pageId,
                            orderBlock: block.orderBlock,
                            idBlockType: block.idBlockType,
                            nombreCol: block.nombreCol,
                            innerBlocks: block.innerBlocks
                        })
                    );
                }
            });

        }
    });
}

function getPreviousContent(elem) {
    return elem.innerHTML;
}

/* Set the width of the side navigation to 250px */
function openNav() {
    document.querySelector(".blockMenu").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.querySelector(".blockMenu").style.width = "0";
}
