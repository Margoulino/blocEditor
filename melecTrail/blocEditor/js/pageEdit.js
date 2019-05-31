var blockTextButton = document.getElementById("textOption");
var interfaceBlock = document.querySelector(".interface-block");

var blockUnits = document.querySelectorAll(".block-unit");

//Ajout de l'editeur html à une div block-unit qui permet d'éditer le contenu d'un block
$(".block-unit").one("dblclick", function () {
    if ($(this).children().next().prop("tagName") == "A") {
        return;
    } else {
        console.log("txt");
        htmlEditorInit(this, "update", this.innerHTML);
    }
});

blockTextButton.addEventListener("click", function () {
    htmlEditorInit(interfaceBlock, "save", "");
    closeNav();
});

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
                editor.setData(previousContent);
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
        if (blockId !== undefined && blockId !== "") {
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    location.reload();
                }
            };

            xhr.open("POST", "/block/deleteBlock", true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify({ id: blockId }));
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

$('#imgOption').on('click', function () {
    $('#uploadImageModal').modal('show');
    closeNav();
})


Dropzone.autoDiscover = false;
$(document).ready(function () {
    var myDropzone = new Dropzone("#myDropzone", {
        url: "/block/uploadImage",
        paramName: "file",
        autoProcessQueue: false,
        uploadMultiple: false,
        parallelUploads: 100,
        maxFilesize: 1,
        maxFiles: 1,
        acceptedFiles: ".jpg, .jpeg, .png",
        addRemoveLinks: true,
        dictFileTooBig: "Le fichier est trop volumineux ({{filesize}}mb). La taille maximale est {{maxFilesize}}mb",
        dictInvalidFileType: "Type de fichier invalide",
        dictCancelUpload: "Annuler",
        dictRemoveFile: "Supprimer",
        dictMaxFilesExceeded: "Enregistrez les fichiers un par un",
        dictDefaultMessage: "Déposez un fichier ici ou cliquez.",
    });
});

Dropzone.options.myDropzone = {
    init: function () {
        var myDropzone = this;
        $("#dropzoneSubmit").on("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (myDropzone.files != "") {
                myDropzone.processQueue();
            } else {
                $("#myDropzone").submit();
            }
        });
        this.on("error", function (file, response) {
            console.log(response);
            window.alert("Erreur lors de l'ajout veuillez réessayer.");
        });
        this.on("success", function (file, response) {
            console.log(response.target_file);
            var div = document.createElement("div");
            div.className = "thumbnail";
            var img = document.createElement("img");
            img.className = "image_picker_image";
            img.src = "/blocEditor/img/" + response.target_file;
            var li = document.createElement("li");
            div.appendChild(img)
            li.appendChild(div);
            document.querySelector('.thumbnails').appendChild(li);

            var option = document.createElement("option");
            option.setAttribute("data-img-src", img.src);
            option.setAttribute("value", response.target_file);
            document.querySelector(".image-picker").appendChild(option);
            $("select").imagepicker();
        })
    }
}

$("select").imagepicker()
$("#selectImg").on('click', function () {
    $('#uploadImageModal').modal('toggle');
    editImgBlock(interfaceBlock, "save", null);
});

function editImgBlock(targetElement, operation, previousContent) {
    var blockId = targetElement.getAttribute("id");
    if (operation == "save") {
        targetElement.innerHTML = '<a href="' + $('.image_picker_selector .selected img').attr('src') + '" data-lightbox="' + $('.image_picker_selector .selected img').attr('src') + '" class="imgBlock"><img src="' + $('.image_picker_selector .selected img').attr('src') + '" id="' + blockId + '"/></a><div class="row"><div class="col"><a id="blockSave" class="btn btn-success" href="#">Sauvegarder le bloc</a></div></div>';
    } else {
        $(targetElement).find('button').remove();
        targetElement.innerHTML = targetElement.innerHTML + '<div class="row"><div class="col"><a id="blockSave" class="btn btn-success" href="#">Sauvegarder le bloc</a></div></div>';
    }
    let cont;
    $(targetElement).find('img').resizable();
    cont = $('.imgBlock').last()[0];
    document.querySelector("#blockSave").addEventListener("click", () => {
        $(targetElement).find('img').resizable('destroy');
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
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
                    content: cont.outerHTML,
                    pageId: pageId,
                    orderBlock: idNewBlock,
                    idBlockType: 2,
                    nombreCol: 1,
                    innerBlocks: ""
                })
            );
        } else if (operation === "update") {

            $(targetElement).find('a').prev().remove();
            $(targetElement).find('a').next().remove();
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
                            content: targetElement.innerHTML,
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

lightbox.option({
    'resizeDuration': 200,
    'wrapAround': true
})

$('.resizebtn').on('click', function () {
    var resized = $(this).prev().find('img');
    console.log(resized.parent().html());
    //resized.resizable();
    $(this).toggle();
    editImgBlock(this.parentElement, "update", this.parentElement.innerHTML);
})

