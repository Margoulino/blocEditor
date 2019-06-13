function saveBlock(content, blockId, blockType, idParent) {
    $.ajax({
        url: "/block/addBlockToPage",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify({
            "name": nomPage + "_" + blockId,
            "content": content,
            "orderBlock": blockId,
            "pageId": pageId,
            "idBlockType": blockType,
            "idParent": idParent
        }),
        success: function (result) {
            console.log(result);
        },
        error: function (xhr, resp, text) {
            console.log(xhr);
        }
    });
}

function deleteBlock(blockId) {
    $.ajax({
        url: "/block/deleteBlock",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify({
            "id": blockId,
        }),
        success: function (result) {
            console.log(result);
        },
        error: function (xhr, resp, text) {
            console.log(xhr);
        }
    });
}

function loadBlockType() {
    let types = null;
    $.ajax({
        url: "/blockType/loadSource",
        type: "GET",
        success: function (result) {
            types = JSON.parse(result)
            console.log(types);
        },
        error: function (xhr, resp, text) {
            console.log(xhr);
        }
    });

    Object.keys(types).forEach(function (k) {
        previousBlock.forEach(b => {
            if(b.idBlockType === types[k].id){
                
            }
        });
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
    })
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
 * ---------------Fonction ajout de catégories à une page---------------
 */
function addBtnToCategSelect(element) {
    var btnAddCateg = element;
    var categContainer = element.parentElement;
    var categSel = document.createElement("select");
    categSel.setAttribute("class", "custom-select addCategSel");
    categSel.style.width = "auto";
    definedCategories.forEach(categ => {
        var opt = document.createElement("option");
        opt.setAttribute("value", categ.id);
        var textOpt = document.createElement("textnode");
        textOpt.innerHTML = categ.name;
        opt.appendChild(textOpt);
        opt.addEventListener("click", function(event){
            var optionClicked = event.target;
            if(confirm("Voulez vous vraiment ajouter cette catégorie ?")) {
                saveNewCategSelect(optionClicked, pageId);
            }
        });

    //Dernière option permettant d'enregistrer une nouvelle catégorie
    var optNewCateg = document.createElement("option");
    optNewCateg.appendChild(document.createTextNode('Nouvelle catégorie'));
    optNewCateg.setAttribute("data-toggle", "modal");
    optNewCateg.setAttribute("data-target", "#newCategoryModal");
    categSel.appendChild(optNewCateg);

    categContainer.removeChild(btnAddCateg);
    categContainer.appendChild(categSel);

}

function saveNewCategSelect(selectedOption, pageId) {
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

function createNewCategory() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            location.reload();
        }
    }
}