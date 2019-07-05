//------SAVE BLOCKS------

/**
 *
 * @param {String} content Contenu de l'éditeur HTML qui sera affiché dans le bloc
 * @param {Int} blockId Id du block sauvegardé
 * @param {Int} blockType Id du type de block qui définiera le template qui sera attribué
 * @param {Int} idParent Id du block parent contenant le block que l'on sauvegarde (s'il y en a un)
 */
function saveBlock(data) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
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
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
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
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
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

function updateBlock(data) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
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

function deleteCategory(data) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve();
            } else if (this.status === 404) {
                reject(JSON.parse(xhr.response).message);
            }
        };
        xhr.open("POST", "/page/removeCategory");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(data);
    });
}

function addCategory(data) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve();
            } else if (this.status === 404) {
                reject(JSON.parse(xhr.response).message);
            }
        };
        xhr.open("POST", "/page/addCategory");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(data);
    });
}

function createNewCategory(data) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve();
            } else if (this.status === 404) {
                reject(JSON.parse(xhr.response).message);
            }
        };
        xhr.open("POST", "/category/addCategory");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(data);
    });
}

function findCategoryByName(data) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve([JSON.parse(xhr.response)[0].id, JSON.parse(xhr.response)[0].name]);
            } else if (this.status === 404) {
                reject();
            }
        };
        xhr.open("POST", "/category/findByname");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(data);
    });
}

function htmlEditorInit(targetElement, previousContent) {
    return new Promise(function(resolve, reject) {
        var blockId = targetElement.getAttribute("id");
        targetElement.innerHTML =
            '<div class="row"><div class="col"><textarea name="content" id="editor' +
            blockId +
            '"></textarea></div></div><div class="row"><div class="col"><a id="blockSave" class="btn btn-success" href="#">Sauvegarder le bloc</a><a class="btn btn-danger" id="blockDelete" href="#" role="button">Supprimer le bloc</a></div></div>';
        let editor;
        ClassicEditor.create(document.querySelector("#editor" + blockId), {
            removePlugins: ["BlockQuote", "MediaEmbed"],
            images: {
                styles: ["full", "side", "alignCenter", "alignLeft", "alignRight"]
            },
            ckfinder: {
                uploadUrl: "/blocEditor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json"
            },
            link: {
                decorators: {
                    isExternal: {
                        mode: "manual",
                        label: "Open in a new tab",
                        attributes: {
                            target: "_blank"
                        }
                    }
                }
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
        //insertAfter(blockToMove, nextBlock);

        //Changement des ordres des blocks dans les objets previousBlocks
        blockToMoveObj.orderBlock = oldOrderNext;
        nextBlockObj.orderBlock = oldOrderToMove;

        var dataBlockToMove = {
            id: blockToMoveObj.id,
            pageId: blockToMoveObj.pageId,
            orderBlock: blockToMoveObj.orderBlock
        };
        updateBlock(JSON.stringify(dataBlockToMove))
            .then(function() {
                var dataNextBlock = {
                    id: nextBlockObj.id,
                    pageId: nextBlockObj.pageId,
                    orderBlock: nextBlockObj.orderBlock,
                };
                updateBlock(JSON.stringify(dataNextBlock)).then(function() {
                    location.reload();
                });
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
        //insertAfter(blockToMove, antecBlock);
        //Changement des ordres des blocks dans les objets previousBlocks
        blockToMoveObj.orderBlock = oldOrderAntec;
        antecBlockObj.orderBlock = oldOrderToMove;

        var dataUpdateBlock = {
            id: blockToMoveObj.id,
            pageId: blockToMoveObj.pageId,
            orderBlock: blockToMoveObj.orderBlock
        };
        updateBlock(JSON.stringify(dataUpdateBlock))
            .then(function() {
                var dataAntecBlock = {
                    id: antecBlockObj.id,
                    pageId: antecBlockObj.pageId,
                    orderBlock: antecBlockObj.orderBlock
                };
                updateBlock(JSON.stringify(dataAntecBlock)).then(function() {
                    location.reload();
                });
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

function findBlockById(id, blocks) {
    var blockToFind = null;
    blocks.forEach(block => {
        if (block.id === id) {
            blockToFind = block;
        }
    });
    return blockToFind;
}

function publishPage(id) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve();
            } else if (this.status === 404) {
                reject(JSON.parse(xhr.response).message);
            }
        };
        var data = {
            pageId: id
        }
        xhr.open("POST", "/page/publishPage/");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(data));
    });
}

function depublishPage(id) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve();
            } else if (this.status === 400) {
                reject(JSON.parse(xhr.response).message);
            }
        };
        var data = {
            pageId: id
        }
        xhr.open("POST", "/page/depublishPage/");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(data));
    });
}

//Trouve le niveau/sous niveau d'un block par rapport à ses blocks parents
function parentCounter(id, blockList) {
    var curBlock = findBlockById(id, blockList);
    if (curBlock.idParent !== undefined && curBlock.idParent !== null) {
        var parents = 0;
        var higherBlock = findBlockById(curBlock.idParent, blockList);
        if (higherBlock !== null && higherBlock !== undefined) {
            parents++;
            if (higherBlock.idParent !== null) {
                while (higherBlock.idParent !== null && higherBlock.idParent !== undefined) {
                    var nextParentId = higherBlock.idParent;
                    if (findBlockById(nextParentId, blockList) !== null) {
                        parents++;
                        higherBlock = findBlockById(nextParentId, blockList);
                    } else {
                        return parents;
                    }
                }
                return parents;
            } else {
                return parents;
            }
        } else {
            return parents;
        }
    } else {
        return 0;
    }
}

function saveDescription(id, description) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve();
            } else if(this.status === 400) {
                reject(JSON.parse(xhr.response).message);
            }
        };
        var data = {
            pageId: id,
            description: description
        };
        xhr.open("POST", "/page/changeDescription/");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(data));
    });
}

function getAllKeywords() {
    var keywords = document.querySelectorAll(".keyword");
    var arrKw = [];
    keywords.forEach(keyword => {
        arrKw.push(keyword.children[0].innerHTML);
    });
    return arrKw;
}

function saveKeywords(data) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve();
            } else if(this.status === 400) {
                reject(JSON.parse(xhr.response).message);
            }
        };
        xhr.open("POST", "/page/changeKeywords/");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(data));
    });
}