$(document).ready(function() {
    // Show the upload/select image modal to add an image block
    $("#imgOption").on("click", function() {
        $("#uploadImageModal").modal("show");
        closeNav();
    });

    // Set the lightbox's basic config
    lightbox.option({
        resizeDuration: 200,
        wrapAround: true
    });
    $("select").imagepicker();

    // Call the carousel's init function when the button is triggered
    $("#sliderOption").on("click", function() {
        closeNav();
        interfaceBlock.scrollIntoView({behavior: "smooth"});
        $("#uploadImageModal").modal("show");
        $("select").attr("multiple", "multiple");
        $("select").imagepicker();
        $("#selectImg").off();
        $("#selectImg").on("click", function() {
            var imgSrc = [];
            $(".image_picker_selector .selected img").each(function(index) {
                imgSrc.push($(this).attr("src"));
            });
            var data = JSON.stringify({
                name: nomPage + "_" + idNewBlock,
                content: imgSrc.join(" ; "),
                orderBlock: idNewBlock,
                pageId: pageId,
                idBlockType: "3"
            });
            saveBlock(data).then(function() {
                location.reload();
            });
        });
    });

    // Show the carousel's content edition menu to add or delete images
    $(".contentSlider").on("click", function() {
        var button = $(this);
        $("#uploadImageModal").modal("show");
        multipleSelect(button);
        $("#dropzoneSubmit").on("click", function() {
            setTimeout(function() {
                multipleSelect(button);
            }, 500);
        });
        $("#selectImg").off();
        $("#selectImg").on("click", function() {
            $("#uploadImageModal").modal("toggle");
            var imgSrc = [];
            $(".image_picker_selector .selected img").each(function(index) {
                imgSrc.push($(this).attr("src"));
            });
            var data = JSON.stringify({
                id: $(button)
                    .closest(".block-unit-complex")
                    .attr("id"),
                content: imgSrc.join(" ; "),
                pageId: pageId
            });
            updateBlock(data);
        });
    });

    // Automatically select images in the upload image modal
    function multipleSelect(button) {
        $("select").attr("multiple", "multiple");
        $("select").imagepicker();
        $(".image_picker_selector .image_picker_image").each(function(index, option) {
            $(button)
                .parent()
                .find("img")
                .each(function(index, img) {
                    if (option.src === img.src) {
                        $(option)
                            .parent()
                            .addClass("selected");
                    }
                });
        });
    }

    $(".resizebtn").on("click", function() {
        var button = $(this);
        var img = $(this)
            .parent()
            .find("img");
        $(img).resizable({
            containment : $(img).closest('.block-unit')
        });
        var buttonSave = document.createElement("div");
        buttonSave.innerHTML = '<a id="blockSave" class="btn btn-success" href="#">Sauvegarder le bloc</a>';
        $(this)
            .parent()
            .append($(buttonSave));
        $(this).hide();
        $("#blockSave").on("click", function() {
            var style = $(img).attr("style");
            $(img).resizable("destroy");
            $("#blockSave").remove();
            var data = JSON.stringify({
                id: $(img)
                    .closest(".block-unit")
                    .attr("id"),
                pageId: pageId,
                style: style
            });
            $(button).show();
            updateBlock(data);
        });
    });

    var imagesInPicker = document.querySelectorAll(".thumbnail");
    imagesInPicker.forEach(image => {
        image.innerHTML +=
            '<button class="btn-xs btn btn-danger deleteImage float-right"><i style="color: white;" class="float-right fas fa-times"></i></button>';
    });
    var deleteImageBtn = document.querySelectorAll(".deleteImage");
    deleteImageBtn.forEach(delBtn => {
        delBtn.addEventListener("click", function() {
            if (confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
                var data = {
                    path: delBtn.previousElementSibling.getAttribute("src")
                };
                deleteImg(JSON.stringify(data)).then(function() {
                    location.reload();
                });
            }
        });
    });
});

Dropzone.autoDiscover = false;
$(document).ready(function() {
    var myDropzone = new Dropzone("#myDropzone", {
        url: "/block/uploadImage",
        paramName: "file",
        autoProcessQueue: false,
        uploadMultiple: false,
        parallelUploads: 100,
        maxFilesize: 1,
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

$("#selectImg").on("click", function() {
    $("#uploadImageModal").modal("toggle");
    var data = JSON.stringify({
        name: nomPage + "_" + idNewBlock,
        orderBlock: idNewBlock,
        pageId: pageId,
        idBlockType: "4",
        content: $(".image_picker_selector .selected img").attr("src")
    });
    console.log(data);
    saveBlock(data).then(function() {
        location.reload();
    });
});

//--------- GALLERY ---------//

$("#galleryOption").on("click", function() {
    closeNav();
    interfaceBlock.scrollIntoView({behavior: "smooth"});
    $("#uploadImageModal").modal("show");
    $("select").attr("multiple", "multiple");
    $("select").imagepicker();
    $("#selectImg").off();
    $("#selectImg").on("click", function() {
        var imgSrc = [];
        $(".image_picker_selector .selected img").each(function(index) {
            imgSrc.push($(this).attr("src"));
        });
        var data = JSON.stringify({
            name: nomPage + "_" + idNewBlock,
            content: imgSrc.join(" ; "),
            orderBlock: idNewBlock,
            pageId: pageId,
            idBlockType: "6"
        });
        saveBlock(data).then(function() {
            location.reload();
        });
    });
});


function deleteImg(data) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve();
            } else if (this.status === 404) {
                reject(JSON.parse(xhr.response).message);
            }
        };
        xhr.open("POST", "/block/removeImage", true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(data);
    });
}
