var blockTextButton = document.getElementById("textOption");
var interfaceBlock = document.querySelector(".interface-block");

var blockUnits = document.querySelectorAll(".block-unit");

//Ajout de l'editeur html à une div block-unit qui permet d'éditer le contenu d'un block
$(".block-unit").one("dblclick", function () {
    if ($(this).children().next().prop("tagName") == "A") {
        return;
    } else {
        htmlEditorInit(this, "update", this.innerHTML);
    }
});

blockTextButton.addEventListener("click", function () {
    htmlEditorInit(interfaceBlock, "save", "");
    closeNav();
});

$('.deleteBlock').on('click', function () {
    if(confirm("Confirmer la suppression du bloc ?")){
        deleteBlock($(this).parent().parent());
    }
    
});

function deleteBlock(node) {
    $.ajax({
        url: "/block/deleteBlock",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify({ "id": $(node).attr('id') }),
        success: function (result) {
            console.log(result);
            window.location.reload();
        },
        error: function (xhr, resp, text) {
            window.alert("Erreur lors de l'ajout, veuillez réessayer.");
            console.log(xhr);
        }
    });
}
//Ajout de l'editeur html à la div
function htmlEditorInit(targetElement, operation, previousContent) {
    var blockId = targetElement.getAttribute("id");
    targetElement.innerHTML = "";
    targetElement.innerHTML =
        '<div class="card"><div class="card-body"><div class="row"><div class="col"><textarea name="content" id="editor' +
        blockId +
        '"></textarea></div></div><div class="row"><div class="col"><a id="blockSave" class="btn btn-success" href="#">Sauvegarder le bloc</a><a class="btn btn-danger" id="blockDelete" href="#" role="button">Supprimer le bloc</a></div></div></div></div>';
    let editor;

    ClassicEditor.create(document.querySelector("#editor" + blockId))
        .then(newEditor => {
            editor = newEditor;
            if (previousContent !== undefined && previousContent !== "") {
                editor.setData(previousContent.trim());
            }
        })
        .catch(error => {
            console.error(error);
        });
    document.querySelector("#editor" + blockId).scrollIntoView({
        behavior: "smooth",
        block: 'start'
    });
    document.querySelector("#blockSave").addEventListener("click", () => {
        var content = editor.getData();
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                console.log("enregistrement du bloc effectué");
                if (operation == "addToCol") {
                    var result = JSON.parse(xhr.response);
                    $(targetElement).find('p').first().attr('id', result.id);
                    columnEdit($(targetElement).parent().parent().attr('id'), $(targetElement).attr('id'), result.id);
                }
                setTimeout(() => {
                    location.reload();
                }, 200);
            }
        };

        if (operation === "save" || operation === "addToCol") {
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
                if (blockId == block.id) {
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

    document.getElementById("blockDelete").addEventListener("click", function (e) {
        if ($('#' + blockId).parent().attr('class') != "blocks-viewer") {
            $.ajax({
                url: "/block/deleteFromCol",
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify({ "idParent": $('#' + blockId).parent().parent().parent().attr('id'), "idChild": blockId }),
                success: function (result) {
                    console.log(result);
                },
                error: function (xhr, resp, text) {
                    window.alert("Erreur lors de l'ajout, veuillez réessayer.");
                    console.log(xhr);
                }
            });
        }
        if (blockId !== undefined && blockId !== "" && blockId !== null) {
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    location.reload();
                }
            };

            xhr.open("POST", "/block/deleteBlock", true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify({ id: blockId }));
        } else {
            location.reload();
        }
    });
}

function getPreviousContent(elem) {
    return elem.innerHTML;
}

//Sidebar menu des options de blocks
function openNav() {
    document.querySelector(".blockMenu").style.width = "250px";
}

function closeNav() {
    document.querySelector(".blockMenu").style.width = "0";
}

function moveBlockDown(event) {
    //En cliquant sur la fleche on cherche la div complète du block (la div block unit) ici celle qui est déplacée
    var blockToMove = event.target.parentElement.parentElement;
    var blockToMoveId = blockToMove.getAttribute("id");
    var blockToMovePrev;

    //Récuperration de div block unit directement suivante
    var nextBlock = blockToMove.nextElementSibling;
    var nextBlockId = nextBlock.getAttribute("id");
    var nextBlockPrev;

    //Anciens ordre par id de block
    var orders = {};
    previousBlocks.forEach(prevBlock => {
        if (prevBlock.id === blockToMoveId) {
            blockToMovePrev = prevBlock;
            orders[blockToMoveId] = prevBlock.orderBlock;
        }
        if (prevBlock.id === nextBlockId) {
            nextBlockPrev = prevBlock;
            orders[nextBlockId] = prevBlock.orderBlock;
        }
    });

    if (nextBlock !== undefined) {
        //Déplacement des blocks dans l'interface
        insertAfter(blockToMove, nextBlock);
        //Changement des ordres des blocks dans les objets previousBlocks
        blockToMovePrev.orderBlock = orders[nextBlockId];
        nextBlockPrev.orderBlock = orders[blockToMoveId];

        //Update des blocks
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                var xhr2 = new XMLHttpRequest();
                xhr2.onreadystatechange = function () {
                    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                        location.reload();
                    }
                }
                xhr2.open("POST", "/block/updateBlock", true);
                xhr2.setRequestHeader("Content-type", "application/json");
                xhr2.send(
                    JSON.stringify({
                        id: nextBlockPrev.id,
                        name: nextBlockPrev.name,
                        content: nextBlockPrev.content,
                        pageId: nextBlockPrev.pageId,
                        orderBlock: nextBlockPrev.orderBlock,
                        idBlockType: nextBlockPrev.idBlockType,
                        nombreCol: nextBlockPrev.nombreCol,
                        innerBlocks: nextBlockPrev.innerBlocks
                    })
                );
            }
        };
        xhr.open("POST", "/block/updateBlock", true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(
            JSON.stringify({
                id: blockToMovePrev.id,
                name: blockToMovePrev.name,
                content: blockToMovePrev.content,
                pageId: blockToMovePrev.pageId,
                orderBlock: blockToMovePrev.orderBlock,
                idBlockType: blockToMovePrev.idBlockType,
                nombreCol: blockToMovePrev.nombreCol,
                innerBlocks: blockToMovePrev.innerBlocks
            })
        );
    }
}

function moveBlockUp(event) {
    //En cliquant sur la fleche on cherche la div complète du block (la div block unit) ici celle qui est déplacée
    var blockToMove = event.target.parentElement.parentElement;
    var blockToMoveId = blockToMove.getAttribute("id");
    var blockToMovePrev;

    //Récuperration de div block unit directement suivante
    var antecBlock = blockToMove.previousElementSibling;
    var antecBlockId = antecBlock.getAttribute("id");
    var antecBlockPrev;

    //Anciens ordre par id de block
    var orders = {};
    previousBlocks.forEach(prevBlock => {
        if (prevBlock.id === blockToMoveId) {
            blockToMovePrev = prevBlock;
            orders[blockToMoveId] = prevBlock.orderBlock;
        }
        if (prevBlock.id === antecBlockId) {
            antecBlockPrev = prevBlock;
            orders[antecBlockId] = prevBlock.orderBlock;
        }
    });

    if (antecBlock !== undefined) {
        //Déplacement des blocks dans l'interface
        insertAfter(blockToMove, antecBlock);
        //Changement des ordres des blocks dans les objets previousBlocks
        blockToMovePrev.orderBlock = orders[antecBlockId];
        antecBlockPrev.orderBlock = orders[blockToMoveId];

        //Update des blocks
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                var xhr2 = new XMLHttpRequest();
                xhr2.onreadystatechange = function () {
                    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                        location.reload();
                    }
                }
                xhr2.open("POST", "/block/updateBlock", true);
                xhr2.setRequestHeader("Content-type", "application/json");
                xhr2.send(
                    JSON.stringify({
                        id: antecBlockPrev.id,
                        name: antecBlockPrev.name,
                        content: antecBlockPrev.content,
                        pageId: antecBlockPrev.pageId,
                        orderBlock: antecBlockPrev.orderBlock,
                        idBlockType: antecBlockPrev.idBlockType,
                        nombreCol: antecBlockPrev.nombreCol,
                        innerBlocks: antecBlockPrev.innerBlocks
                    })
                );
            }
        };
        xhr.open("POST", "/block/updateBlock", true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(
            JSON.stringify({
                id: blockToMovePrev.id,
                name: blockToMovePrev.name,
                content: blockToMovePrev.content,
                pageId: blockToMovePrev.pageId,
                orderBlock: blockToMovePrev.orderBlock,
                idBlockType: blockToMovePrev.idBlockType,
                nombreCol: blockToMovePrev.nombreCol,
                innerBlocks: blockToMovePrev.innerBlocks
            })
        );
    }
}

var downArrows = document.querySelectorAll("[id^=orderDown]");
downArrows.forEach(arrow => {
    arrow.addEventListener("click", function (e) {
        moveBlockDown(e);
    });
});

var upArrows = document.querySelectorAll("[id^=orderUp]");
upArrows.forEach(arrow => {
    arrow.addEventListener("click", function (e) {
        moveBlockUp(e);
    });
});

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

document.querySelector(".addCategPage").addEventListener("click", function(event) {
    var btn = event.target;
    addBtnToCategSelect(btn);
});

/**
 * Fonction ajout de catégories à une page
 */
function addBtnToCategSelect(element) {
    var btnAddCateg = element;
    var categContainer = element.parentElement;
    var categSel = document.createElement("select");
    categSel.setAttribute("class", "custom-select addCategSel");
    categSel.style.width = "auto";
    var idCategToDisplay = definedCategories.map(function(defCateg){ return defCateg.id;});
    
    definedCategories.forEach(categ => {
        var opt = document.createElement("option");
        opt.setAttribute("value", categ.id);
        var textOpt = document.createElement("textnode");
        textOpt.innerHTML = categ.name;
        opt.appendChild(textOpt);
        opt.addEventListener("click", function(event){
            var optionClicked = event.target;
            if(confirm("Voulez vous vraiment ajouter cette catégorie ?")) {
                saveNewCateg(optionClicked, pageId);
            }
        });
        categSel.appendChild(opt);
    });

    //Dernière option permettant d'enregistrer une nouvelle catégorie
    /*var optNewCateg = document.createElement("option");
    optNewCateg.appendChild(document.createTextNode('Nouvelle catégorie'));
    categSel.appendChild(optNewCateg);*/

    categContainer.removeChild(btnAddCateg);
    categContainer.appendChild(categSel);
}

function saveNewCateg(selectedOption, pageId) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            location.reload();
        }
    }
    xhr.open("POST", "/page/addCategory", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(
        JSON.stringify({
            pageId: pageId,
            categoryId: selectedOption.value
        })
    )
}