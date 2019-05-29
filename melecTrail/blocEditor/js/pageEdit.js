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

    document.getElementById("blockDelete").addEventListener("click", function(e) {
        if(blockId !== undefined && blockId !== "") {
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function() {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    location.reload();
                }
            };

            xhr.open("POST", "/block/deleteBlock", true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify({id: blockId}));
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
            $('#uploadImageModal').modal('toggle');

        });
        this.on("success", function (file,response) {
            console.log(response.target_file);
            var img = document.createElement("img");
            var div = document.createElement("div");
            div.className="prevImg";
            img.src="/blocEditor/img/"+response.target_file;
            img.className="img-preview";
            img.id=response.target_file;
            document.querySelector('.imageCollection').appendChild(div);
            div.appendChild(img);
        })
    }
}