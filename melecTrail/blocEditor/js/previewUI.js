document.addEventListener("DOMContentLoaded", function() {
    //Suppression des boutons ajoutés via le js dans les blocks, au chargement de la page
    var blocks = document.querySelectorAll(".block-unit, .block-unit-complex");
    blocks.forEach(block => {
        var childrenBlock = [].slice.call(block.children);
        childrenBlock.forEach(child => {
            if (child.nodeName === "BUTTON") {
                child.parentElement.removeChild(child);
            }
        });
    });

    //Suppression des lignes {col...} qui apparaissent dans les colonnes des blocks colonne
    var columns = document.querySelectorAll(".row.block");
    columns.forEach(col => {
        var colChildren = [].slice.call(col.children);
        colChildren.forEach(colChild => {
            if (/^{col/.test(colChild.innerHTML.trim())) {
                colChild.innerHTML = "";
            }
        });
    });
    //Suppression des boutons "+" des colonnes vides des blocs colonnes
    var divBtn = document.querySelectorAll(".text-center");
    divBtn.forEach(divB => {
        divB.parentElement.removeChild(divB);
    });
});

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

var publishBtn = document.getElementById("pagePublish");
if (publishBtn !== undefined && publishBtn !== null) {
    publishBtn.addEventListener("click", function() {
        if (confirm("Êtes-vous sûr de vouloir publier cette page ?")) {
            publishPage(pageId).then(function() {
                location.reload();
            });
        }
    });
}

var depublishBtn = document.getElementById("pageDepublish");
if (depublishBtn !== undefined && depublishBtn !== null) {
    depublishBtn.addEventListener("click", function() {
        if (confirm("Êtes-vous sûr de vouloir dépublier cette page ?")) {
            depublishPage(pageId).then(function() {
                location.reload();
            });
        }
    });
}

$("select").imagepicker();

Dropzone.autoDiscover = false;
$(document).ready(function() {
    var myDropzone = new Dropzone("#myDropzone", {
        url: "/block/uploadImage",
        paramName: "file",
        autoProcessQueue: false,
        uploadMultiple: false,
        parallelUploads: 100,
        maxFilesize: 6,
        maxFiles: 3,
        acceptedFiles: ".jpg, .jpeg, .png",
        addRemoveLinks: true,
        dictFileTooBig: "Le fichier est trop volumineux ({{filesize}}mb). La taille maximale est {{maxFilesize}}mb",
        dictInvalidFileType: "Type de fichier invalide",
        dictCancelUpload: "Annuler",
        dictRemoveFile: "Supprimer",
        dictMaxFilesExceeded: "Limite de fichier atteinte",
        dictDefaultMessage: "Déposez un fichier ici ou cliquez."
    });
});

Dropzone.options.myDropzone = {
    init: function() {
        var myDropzone = this;
        $("#dropzoneSubmit").on("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (myDropzone.files != "") {
                myDropzone.processQueue();
            } else {
                $("#myDropzone").submit();
            }
        });
        this.on("error", function(file, response) {
            console.log(response);
            window.alert("Erreur lors de l'ajout veuillez réessayer.");
        });
        this.on("success", function(file, response) {
            console.log(response.target_file);
            var div = document.createElement("div");
            div.className = "thumbnail";
            var img = document.createElement("img");
            img.className = "image_picker_image";
            img.src = "/blocEditor/asset/img/" + response.target_file;
            var li = document.createElement("li");
            div.appendChild(img);
            li.appendChild(div);
            document.querySelector(".thumbnails").appendChild(li);

            var option = document.createElement("option");
            option.setAttribute("data-img-src", img.src);
            option.setAttribute("value", response.target_file);
            document.querySelector(".image-picker").appendChild(option);
            $("select").imagepicker();
        });
    }
};
$(document).on('click','.editBannerBg', function () {
    $('#uploadImageModal').modal('show');
    var button = $(this);
    $("#selectImg").on("click", function() {
        $("#uploadImageModal").modal("toggle");
        var data = JSON.stringify({
            id: $(button).closest('.innerPage-banner-bg').attr('id'),
            pageId: pageId,
            idBlockType: "8",
            content: $(".image_picker_selector .selected img").attr("src")
        });
        console.log(data);
        updateBlock(data).then(function() {
            location.reload();
        });

    })
})
