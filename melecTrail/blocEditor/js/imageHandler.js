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
        maxFiles: 3,
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
    if (operation == "save" || operation == "addToCol") {
        targetElement.innerHTML = '<a href="' + $('.image_picker_selector .selected img').attr('src') + '" data-lightbox="' + $('.image_picker_selector .selected img').attr('src') + '" class="imgBlock"><img src="' + $('.image_picker_selector .selected img').attr('src') + '" id="' + blockId + '"/></a><div class="row"><div class="col"><a id="blockSave" class="btn btn-success" href="#">Sauvegarder le bloc</a></div></div>';
    } else {
        $(targetElement).find('button').remove();
        targetElement.innerHTML = targetElement.innerHTML + '<div class="row"><div class="col"><a id="blockSave" class="btn btn-success" href="#">Sauvegarder le bloc</a></div></div>';
    }
    let cont;
    $(targetElement).find('img').resizable();
    if (operation != "addToCol") {
        cont = $('.imgBlock').last()[0];
    } else {
        cont = $('.edited-col a')[0];
    }
    document.querySelector("#blockSave").addEventListener("click", () => {
        $(targetElement).find('img').resizable('destroy');
        console.log(cont);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                console.log("enregistrement du bloc effectué");
                if (operation == "addToCol") {
                    var result = JSON.parse(xhr.response);
                    columnEdit($(targetElement).parent().parent().attr('id'), $(targetElement).attr('id'), result.id);
                }
                location.reload();
            }
        };
        if (operation === "save" || operation === "addToCol") {

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
            console.log(targetElement.innerHTML)
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

//************ CAROUSSEL SLIDER **************//

$('#sliderOption').on('click', function () {
    $('#uploadImageModal').modal('show');
    closeNav();
    $("select").attr('multiple', 'multiple');
    $("select").imagepicker()
    console.log($('select')[0]);
    $('#selectImg').off();
    $("#selectImg").on('click', function () {
        $('#uploadImageModal').modal('toggle');
        var divC = document.createElement('div');
        $(divC).addClass('owl-carousel');
        $(divC).addClass('owl-theme');
        $('.image_picker_selector .selected img').each(function (index) {
            var a = document.createElement('a');
            var div = document.createElement('div');
            $(a).addClass('imgBlock');
            $(a).attr('href', $(this).attr('src'));
            $(a).attr('data-lightbox', $(this).attr('src'));
            a.appendChild(this);
            div.appendChild(a);
            divC.appendChild(div);
        })
        blockEditorInit(document.querySelector('.interface-block'), "save", 4, divC.outerHTML);
        $("select").removeAttr('multiple');
    });
})

window.addEventListener('load', function () {
    if (document.querySelector('.owl-carousel') != null) {
        var slider = document.querySelectorAll('.owl-carousel');
        slider.forEach(carousel => {
            $(carousel).owlCarousel({
                loop:true,
                margin:10,
                nav: true,
                autoplay:true,
                autoplayTimeout:1000,
                autoplayHoverPause:true,
                autoWidth:true,
                navText:['<i class="fas fa-chevron-left"></i>','<i class="fas fa-chevron-right"></i>'],
                responsive:{
                    0:{
                        items:1
                    },
                    600:{
                        items:3
                    },
                    1000:{
                        items:4
                    }
                }
            })
        } )
    }
})
