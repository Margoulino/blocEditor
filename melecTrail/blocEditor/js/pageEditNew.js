function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

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
        data.jwt = getCookie('jwt');
        xhr.open("POST", "/block/addBlockToPage", true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(data);
    });
}

/**
 * Permet de sauvegarder un bloc dans la colonne d'un autre bloc
 * @param {JSON} data Données à envoyer en base
 */
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
        data.jwt = getCookie('jwt');
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
                id: blockId,
                jwt: getCookie('jwt')
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
            id: blockTypeId,
            jwt: getCookie('jwt')
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

/**
 * Mise à jour des données d"un bloc prééxistant
 * @param {JSON} data Nouvelles données d'un bloc à envoyer en base
 */
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

/**
 * Suppression de l'attribution d'une catégorie à une page, ne supprime pas la catégorie en elle même
 * @param {JSON} data Données de la catégorie à supprimer (pageId, categoryId)
 */
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
        data.jwt = getCookie('jwt');
        xhr.open("POST", "/page/removeCategory");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(data);
    });
}

/**
 * Attribution d'une catégorie à une page prééxistante
 * @param {JSON} data Données permettant de relier une catégorie à une page (pageId, categoryId)
 */
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

/**
 * Création d'une nouvelle catégorie
 * @param {JSON} data Données de la nouvelle catégorie à ajouter en base (nom de la catégorie)
 */
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
        data.jwt = getCookie('jwt');
        xhr.open("POST", "/category/addCategory");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(data);
    });
}

/**
 * Renvoie les données de la catégorie portant le nom renseigné
 * @param {JSON} data Nom de la catégorie en base
 */
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
        data.jwt = getCookie('jwt');
        xhr.open("POST", "/category/findByname");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(data);
    });
}

/**
 * Permet d'afficher l'editeur WYSIWYG Ckeditor dans une div HTML donnée
 * @param {HTML Element} targetElement Element dans lequel on souhaite faire apparaître le Ckeditor
 * @param {String} previousContent Contenu déjà renseigné d'un bloc texte (si on veut éditer ce contenu)
 */
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
                //Ajout du bouton de la modal "ajouter un fichier pdf"
                var rowPdf = document.createElement("div");
                rowPdf.setAttribute("class", "row");
                var colPdf = document.createElement("div");
                colPdf.setAttribute("class", "col");
                colPdf.innerHTML = '<button id="pdf' + blockId + '" class="btn btn-secondary"><i class="fas fa-file"></i></button>';
                rowPdf.appendChild(colPdf);
                targetElement.insertBefore(rowPdf, targetElement.childNodes[targetElement.childElementCount-1]);
                //------
                
                var btnPdf = document.getElementById("pdf"+blockId);
                btnPdf.addEventListener("click", function() {
                    var btnPdfSelect = document.getElementById("pdfSelect");
                    var selPdf = document.querySelector(".pdfFilesSel");
                    btnPdfSelect.addEventListener("click", function() {
                        editor.setData(editor.getData() + "<a href='/blocEditor/asset/files/" + selPdf.value + "'>" + selPdf.value + "</a>");
                        $("#uploadFileModal").modal("hide");
                    })
                    $("#uploadFileModal").modal("show");
                });
                resolve(editor);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function addBtnLinkToEditor(toolbar, blockId) {
    var btnLink = '<button id="pdf' + blockId + '" class="btn btn-secondary" type="button" tabindex="-1">' + "Pdf" + "<button>";
    toolbar.innerHTML += btnLink;
}

/**
 *
 * @param {*} event
 * @param {*} blocks
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
            orderBlock: blockToMoveObj.orderBlock,
            jwt: getCookie('jwt')
        };
        updateBlock(JSON.stringify(dataBlockToMove)).then(function() {
            var dataNextBlock = {
                id: nextBlockObj.id,
                pageId: nextBlockObj.pageId,
                orderBlock: nextBlockObj.orderBlock,
                jwt: getCookie('jwt')
            };
            updateBlock(JSON.stringify(dataNextBlock)).then(function() {
                location.reload();
            });
        });
    }
}

/**
 *
 * @param {Object event} event
 * @param {*} blocks
 */
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
            orderBlock: blockToMoveObj.orderBlock,
            jwt: getCookie('jwt')
        };
        updateBlock(JSON.stringify(dataUpdateBlock)).then(function() {
            var dataAntecBlock = {
                id: antecBlockObj.id,
                pageId: antecBlockObj.pageId,
                orderBlock: antecBlockObj.orderBlock,
                jwt: getCookie('jwt')
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

/**
 *
 * @param {*} id
 * @param {*} blocks
 */
function findBlockById(id, blocks) {
    var blockToFind = null;
    blocks.forEach(block => {
        if (block.id === id) {
            blockToFind = block;
        }
    });
    return blockToFind;
}

/**
 *
 * @param {*} id
 */
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
            pageId: id,
            jwt: getCookie('jwt')
        };
        xhr.open("POST", "/page/publishPage/");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(data));
    });
}

/**
 *
 * @param {*} id
 */
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
            pageId: id,
            jwt: getCookie('jwt')
        };
        xhr.open("POST", "/page/depublishPage/");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(data));
    });
}

/**
 * Trouve le niveau/sous niveau d'un block par rapport à ses blocks parents et le renvoie
 * @param {int} id id du block dont on veut le niveau
 * @param {Array} blockList Liste de tous les blocs
 */
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

/**
 * Permet d'enregistrer une description d'une page qui sera utilisée dans la balise meta description
 * @param {int} id Id de la page où sauvegarder la description
 * @param {String} description Description de la page à sauvegarder
 */
function saveDescription(id, description) {
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
            pageId: id,
            description: escapeHtml(description),
            jwt: getCookie('jwt')
        };
        xhr.open("POST", "/page/changeDescription/");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(data));
    });
}

/**
 * Renvoie un tableau contenant tout les mot clés contenus dans les element HTML avec la classe ".keyword"
 */
function getAllKeywords() {
    var keywords = document.querySelectorAll(".keyword");
    var arrKw = [];
    keywords.forEach(keyword => {
        arrKw.push(escapeHtml(keyword.children[0].innerHTML));
    });
    return arrKw;
}

/**
 *
 * @param {JSON} data JSON des mot-clés à sauvegarder
 */
function saveKeywords(data) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve();
            } else if (this.status === 400) {
                reject(JSON.parse(xhr.response).message);
            }
        };
        data.jwt = getCookie('jwt');
        xhr.open("POST", "/page/changeKeywords/");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(data));
    });
}

/**
 * Envoi par requete ajax des infos de complément du nom d'une page
 * @param {JSON} data Complément du nom, id de la page
 */
function saveNameCompletion(data) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve();
            } else if (this.status === 400) {
                reject(JSON.parse(xhr.response).message);
            }
        };
        data.jwt = getCookie('jwt');
        xhr.open("POST", "/page/changeNameCompletion/");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(data));
    });
}

function escapeHtml(text) {
    var map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    };

    return text.replace(/[&<>"']/g, function(m) {
        return map[m];
    });
}
$(document).ready(function () {
    var bhf = $('#pagePreview').attr('href');
    $('#pagePreview').attr('href', bhf + '?jwt=' + getCookie('jwt'));
})