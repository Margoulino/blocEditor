/**
 *
 * @param {String} content Contenu de l'éditeur HTML qui sera affiché dans le bloc
 * @param {Int} blockId Id du block sauvegardé
 * @param {Int} blockType Id du type de block qui définiera le template qui sera attribué
 * @param {Int} idParent Id du block parent contenant le block que l'on sauvegarde (s'il y en a un)
 */
function saveBlock(content, blockId, blockType, idParent, styleBlock) {
    $.ajax({
        url: "/block/addBlockToPage",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            name: nomPage + "_" + blockId,
            content: content,
            orderBlock: blockId,
            pageId: pageId,
            idBlockType: blockType,
            idParent: idParent,
            styleBlock: styleBlock
        }),
        success: function(result) {
            console.log(result);
        },
        error: function(xhr, resp, text) {
            console.log(xhr);
        }
    });
}

/**
 * Supprime le block dans la base correspondant à l'id et recharge la page
 * @param {Int} blockId
 */
function deleteBlock(blockId) {
    $.ajax({
        url: "/block/deleteBlock",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            id: blockId
        }),
        success: function(result) {
            //console.log(result);
            location.reload();
        },
        error: function(xhr, resp, text) {
            console.log(xhr);
        }
    });
}

/*function loadBlockType() {
    let types = null;
    $.ajax({
        url: "/blockType/loadSource",
        type: "GET",
        success: function(result) {
            types = JSON.parse(result);
            console.log(types);
        },
        error: function(xhr, resp, text) {
            console.log(xhr);
        }
    });

    Object.keys(types).forEach(function(k) {
        previousBlock.forEach(b => {
            if (b.idBlockType === types[k].id) {
            }
        });
    });
}*/

//--------------------------------------------------------------
/**
 *
 * @param {Int} blockTypeId Id du type de block/template à charger
 * @param {Function} callbackFunc Fonction permettant d'assigner les templates/js à une var
 * @param {String} templates var contenant les templates
 */
function loadTemplateData(blockTypeId, callbackFunc, templates) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            callbackFunc(xhr.response, templates, blockTypeId);
        }
    };

    xhr.open("POST", "/blockType/loadTemplate", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(
        JSON.stringify({
            id: blockTypeId
        })
    );
}

/**
 *
 * @param {string} data reponse JSON contenant le JS et le HTML d'un type de block
 * @param {string} templates variable contenant les templates
 * @param {int} id id du blockType
 */
function callbackTemplate(data, templates, id) {
    templates["html" + id] = JSON.parse(data).html.replace(/\\/g, "");
    templates["js" + id] = JSON.parse(data).js;
}
//--------------------------------------------------------------

function saveBlockIntoPage(nomPage, content, pageId, idNewBlock, idBlockType, styleBlock) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            location.reload();
        }
    };
    xhr.open("POST", "/block/addBlockToPage", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(
        JSON.stringify({
            name: nomPage + "_" + idNewBlock,
            content: content,
            pageId: pageId,
            orderBlock: idNewBlock,
            idBlockType: idBlockType,
            styleBlock: styleBlock
        })
    );
}

function saveBlockIntoBlock(nomPage, content, pageId, idNewBlock, idBlockType, idParent, idColumn, styleBlock) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            location.reload();
        }
    };
    xhr.open("POST", "/block/addBlockToBlock", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(
        JSON.stringify({
            name: nomPage + "_" + idNewBlock,
            content: content,
            pageId: pageId,
            orderBlock: idNewBlock,
            idBlockType: idBlockType,
            idParent: idParent,
            idColumn: idColumn,
            styleBlock: styleBlock
        })
    );
}

function updateBlock(id, name, content, pageId, orderBlock, idBlockType, idParent, idColumn, styleBlock) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            location.reload();
        }
    };
    xhr.open("POST", "/block/updateBlock", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(
        JSON.stringify({
            id: id,
            name: name,
            content: content,
            pageId: pageId,
            orderBlock: orderBlock,
            idBlockType: idBlockType,
            idParent: idParent,
            idColumn: idColumn,
            styleBlock: styleBlock
        })
    );
}

/** CHOPPER L'ID DU BLOCK PARENT ds block previous
 *
 * @param {*} event
 */
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

        updateBlock(
            nextBlockPrev.id,
            nextBlockPrev.name,
            nextBlockPrev.content,
            nextBlockPrev.pageId,
            nextBlockPrev.orderBlock,
            nextBlockPrev.idBlockType,
            4
        );
        //Update des blocks
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                var xhr2 = new XMLHttpRequest();
                xhr2.onreadystatechange = function() {
                    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                        location.reload();
                    }
                };
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

        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                var xhr2 = new XMLHttpRequest();
                xhr2.onreadystatechange = function() {
                    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                        location.reload();
                    }
                };
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

/**
 * Renvoie un tableau d'odre de chaque block
 * @param {array} blocks tableau d'objets de blocks
 */
function getBlocksOrder(blocks) {
    var orders = {};
    blocks.forEach(block => {
        if (block.orderBlock !== undefined) {
            orders["block" + block.id] = block.orderBlock;
        }
    });
    return orders;
}

/**
 *
 * @param {DOM element} newNode
 * @param {DOM element} referenceNode
 */
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function setTemplateToNode() {}
