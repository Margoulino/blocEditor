//------SAVE BLOCKS------

/**
 *
 * @param {String} content Contenu de l'éditeur HTML qui sera affiché dans le bloc
 * @param {Int} blockId Id du block sauvegardé
 * @param {Int} blockType Id du type de block qui définiera le template qui sera attribué
 * @param {Int} idParent Id du block parent contenant le block que l'on sauvegarde (s'il y en a un)
 */
function saveBlock(data) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve();
            } else if (this.status === 404) {
                reject(JSON.parse(xhr.response).message);
            }
        };
        xhr.open("POST", "/block/addBlockToPage", true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(data);
    });
}

function saveBlockIntoBlock(data) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve();
            } else if (this.status === 404) {
                reject(JSON.parse(xhr.status).message);
            }
        };
        xhr.open("POST", "/block/addBlockToBlock", true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(data);
    });
}

/**
 * Supprime le block dans la base correspondant à l'id et recharge la page
 * @param {Int} blockId
 */
function deleteBlock(blockId) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve();
            } else if (this.status === 404) {
                reject(JSON.parse(xhr.response).message);
            }
        };
        xhr.open("POST", "/block/deleteBlock");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(
            JSON.stringify({
                id: blockId
            })
        );
    });
}

//--------------------------------------------------------------
/**
 *
 * @param {Int} blockTypeId Id du type de block/template à charger
 * @param {Function} callbackFunc Fonction permettant d'assigner les templates/js à une var
 * @param {String} templates var contenant les templates
 */
function loadTemplateData(blockTypeId, callbackFunc, templates) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
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

function updateBlock(data) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve();
                location.reload();
            } else if (this.status === 404) {
                reject(JSON.parse(xhr.response).message);
            }
        };
        xhr.open("POST", "/block/updateBlock", true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(data);
    });
}

function htmlEditorInit(targetElement, previousContent) {
    return new Promise(function (resolve, reject) {
        var blockId = targetElement.getAttribute("id");
        targetElement.innerHTML =
            '<div class="row"><div class="col"><textarea name="content" id="editor' +
            blockId +
            '"></textarea></div></div><div class="row"><div class="col"><a id="blockSave" class="btn btn-success" href="#">Sauvegarder le bloc</a><a class="btn btn-danger" id="blockDelete" href="#" role="button">Supprimer le bloc</a></div></div>';
        let editor;
        ClassicEditor.create(document.querySelector("#editor" + blockId), {
            removePlugins: ['BlockQuote', 'MediaEmbed'],
            images: {
                styles: [
                    'full',
                    'side',
                    'alignCenter','alignLeft',
                    'alignRight'
                ]
            },ckfinder: {
                uploadUrl: '/blocEditor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json'
            }
                    
        })
            .then(newEditor => {
                editor = newEditor;
                if (previousContent !== undefined && previousContent !== "") {
                    editor.setData(previousContent.trim());
                }
                resolve(editor);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 *
 * @param {*} event
 */
function moveBlockDown(event, blocks) {
    //En cliquant sur la fleche on cherche la div complète du block (la div block unit) ici celle qui est déplacée
    var blockToMove = event.target.parentElement.parentElement;
    var blockToMoveId = blockToMove.getAttribute("id");
    var blockToMoveObj = findBlockById(blockToMoveId, blocks);
    var oldOrderToMove = blockToMoveObj.orderBlock;

    //Récuperration de div block unit directement suivante
    var nextBlock = blockToMove.nextElementSibling;
    var nextBlockId = nextBlock.getAttribute("id");
    var nextBlockObj = findBlockById(nextBlockId, blocks);
    var oldOrderNext = nextBlockObj.orderBlock;

    if (nextBlock !== undefined) {
        insertAfter(blockToMove, nextBlock);

        //Changement des ordres des blocks dans les objets previousBlocks
        blockToMoveObj.orderBlock = oldOrderNext;
        nextBlockObj.orderBlock = oldOrderToMove;

        var dataBlockToMove = {
            id: blockToMoveObj.id,
            name: blockToMoveObj.name,
            content: blockToMoveObj.content,
            pageId: blockToMoveObj.pageId,
            orderBlock: blockToMoveObj.orderBlock,
            idBlockType: blockToMoveObj.idBlockType,
            idParent: blockToMoveObj.idParent,
            idColumn: blockToMoveObj.idColumn,
            styleBlock: blockToMoveObj.styleBlock
        };
        updateBlock(JSON.stringify(dataBlockToMove))
            .then(function () {
                var dataNextBlock = {
                    id: nextBlockObj.id,
                    name: nextBlockObj.name,
                    content: nextBlockObj.content,
                    pageId: nextBlockObj.pageId,
                    orderBlock: nextBlockObj.orderBlock,
                    idBlockType: nextBlockObj.idBlockType,
                    idParent: nextBlockObj.idParent,
                    idColumn: nextBlockObj.idColumn,
                    styleBlock: nextBlockObj.styleBlock
                };
                return updateBlock(JSON.stringify(dataNextBlock));
            })
            .then(function () {
                location.reload();
            });
    }
}

function moveBlockUp(event, blocks) {
    //En cliquant sur la fleche on cherche la div complète du block (la div block unit) ici celle qui est déplacée
    var blockToMove = event.target.parentElement.parentElement;
    var blockToMoveId = blockToMove.getAttribute("id");
    var blockToMoveObj = findBlockById(blockToMoveId, blocks);
    var oldOrderToMove = blockToMoveObj.orderBlock;

    //Récuperration de div block unit directement suivante
    var antecBlock = blockToMove.previousElementSibling;
    var antecBlockId = antecBlock.getAttribute("id");
    var antecBlockObj = findBlockById(antecBlockId, blocks);
    var oldOrderAntec = antecBlockObj.orderBlock;

    if (antecBlock !== undefined) {
        insertAfter(blockToMove, antecBlock);
        //Changement des ordres des blocks dans les objets previousBlocks
        blockToMoveObj.orderBlock = oldOrderAntec;
        antecBlockObj.orderBlock = oldOrderToMove;

        var dataUpdateBlock = {
            id: blockToMoveObj.id,
            name: blockToMoveObj.name,
            content: blockToMoveObj.content,
            pageId: blockToMoveObj.pageId,
            orderBlock: blockToMoveObj.orderBlock,
            dBlockType: blockToMoveObj.idBlockType,
            idParent: blockToMoveObj.idParent,
            idColumn: blockToMoveObj.idColumn,
            styleBlock: blockToMoveObj.styleBlock
        };
        updateBlock(JSON.stringify(dataUpdateBlock))
            .then(function () {
                var dataAntecBlock = {
                    id: antecBlockObj.id,
                    name: antecBlockObj.name,
                    content: antecBlockObj.content,
                    pageId: antecBlockObj.pageId,
                    orderBlock: antecBlockObj.orderBlock,
                    idBlockType: antecBlockObj.idBlockType,
                    idParent: antecBlockObj.idParent,
                    idColumn: antecBlockObj.idColumn,
                    styleBlock: antecBlockObj.styleBlock
                };
                return updateBlock(JSON.stringify(dataAntecBlock));
            })
            .then(function () {
                location.reload();
            });
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

function findBlockById(id, blocks) {
    var blockToFind = null;
    blocks.forEach(block => {
        if (block.id === id) {
            blockToFind = block;
        }
    });
    return blockToFind;
}
