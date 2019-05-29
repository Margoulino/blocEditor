//Fonction de sérialisation 
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
$('.addPage').on('click', function () {
    var idcat = $(this).attr('id');
    $('#addPageModal').modal('show');
    $('#addPageModal').find('#catnameinput').val(idcat);
});
$('#nav-tabContent a').on('click', function () {
    if (confirm('Modifier la page ' + $(this).attr('id') + ' ?')) {
        window.location.href = "/page/editPage/" + $(this).attr('id');
    };
})

$('.addCat').on('click', function () {
    $('#addCategoryModal').modal('show');
})

$(document).ready(function () {
    $("#list-tab a").first().addClass("active");
    $("#nav-tabContent div").first().addClass("show active");
});

$('.deletePage').on('click', function () {
    var view = $(this).attr('id');
    var cat = $(this).parent().parent().attr('class');
    if (confirm("Confirmer la suppression de la page " + view + " ?")) {
        $.ajax({
            url: "/page/deletepage",
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify({ "page": view, "category": cat }),
            success: function (result) {
                window.location.reload();
            },
            error: function (xhr, resp, text) {
                window.alert("Erreur lors de l'ajout, veuillez réessayer.");
                signup_form.find('input').val('');
            }
        });
    }
});


$(document).on('submit', '#tree_form', function () {
    var signup_form = $(this);
    var form_data = JSON.stringify(signup_form.serializeObject());
    $.ajax({
        url: "/page/addpage",
        type: "POST",
        contentType: 'application/json',
        data: form_data,
        success: function (result) {
            window.location.reload();
        },
        error: function (xhr, resp, text) {
            window.alert("Erreur lors de l'ajout, veuillez réessayer.");
            signup_form.find('input').val('');
        }
    });
    return false;
});

$(document).on('submit', '#cat_form', function () {
    var cat_form = $(this);
    var form_data = JSON.stringify(cat_form.serializeObject());
    $.ajax({
        url: "/category/addcategory",
        type: "POST",
        contentType: "application/json",
        data: form_data,
        success: function (result) {
            window.location.reload();
        },
        error: function (xhr, resp, text) {
            if (xhr.status == 409) {
                window.alert("Cette catégorie existe déjà veuillez spécifier un autre nom.");
            } else {
                window.alert("Erreur lors de l'ajout, veuillez réessayer.")
            } cat_form.find('input').val('');
        }
    });
    return false;
});

$('#image').on('click', function () {
    $('#uploadImageModal').modal('show');
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
    addImgBlock($('.interfaceBlock'), "save");
});

function addImgBlock(targetElement, operation, previousContent) {
    $('#uploadImageModal').modal('show');
    var blockId = targetElement.getAttribute("id");
    targetElement.innerHTML = '<a href="' + $('.image_picker_selector .selected img').attr('src') + '" data-lightbox="' + $('.image_picker_selector .selected img').attr('src') + '" class="imgBlock"></a><div class="row"><div class="col"><a id="blockSave" class="btn btn-success" href="#">Sauvegarder le bloc</a></div></div>';

    document.querySelector("#blockSave").addEventListener("click", () => {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                console.log("enregistrement du bloc effectué");
                location.reload();
            }
        };
        if (operation === "save") {
            var content = targetElement.innerHTML;
            xhr.open("POST", "/block/addBlockToPage", true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(
                JSON.stringify({
                    name: nomPage + "_" + idNewBlock,
                    content: content,
                    pageId: pageId,
                    orderBlock: idNewBlock,
                    idBlockType: 2,
                    nombreCol: 1,
                    innerBlocks: ""
                })
            );
        } else if (operation === "update") {
            var content = previousContent;
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
}

lightbox.option({
    'resizeDuration': 200,
    'wrapAround': true
})

$('.bloc-unit').on('dblclick', function () {
    var resized = $(this).find('a');
    interact(resized).resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        modifiers: [
            interact.modifiers.restrictEdges({
                outer: 'parent',
                endOnly: true,
            }),
            interact.modifiers.restrictSize({
                min: { width: 100, height: 50 },
            }),
        ],
        inertia: true
    });
    addImgBlock($(this),"update",$(this).innerHTML);
})

