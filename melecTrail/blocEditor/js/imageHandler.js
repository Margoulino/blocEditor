// Show the upload/select image modal to add an image block
$('#imgOption').on('click', function () {
    $('#uploadImageModal').modal('show');
    closeNav();
})

// Set the dropzone's basic config in the upload image modal
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
        dictMaxFilesExceeded: "Limite de fichier atteinte",
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

// When an image's selection is confirmed, call the storing function associated.
$("select").imagepicker()
$("#selectImg").on('click', function () {
    $('#uploadImageModal').modal('toggle');
    editImgBlock(interfaceBlock, "save", null);
});

// Single image storing/updating function : 
//  -Add the template and save/delete button
//  -Set the image to resizable 
//  -When the user saves the block, the function stores its content into the DB
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
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                console.log("enregistrement du bloc effectué");
                if (operation == "addToCol") {
                    var result = JSON.parse(xhr.response);
                    columnEdit($(targetElement).parent().parent().attr('id'), $(targetElement).attr('id'), result.id);
                }
                setTimeout(() => {
                    location.reload();
                }, 200);
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
                    innerBlocks: "",
                    jwt: getCookie('jwt')
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
                            innerBlocks: block.innerBlocks,
                            jwt: getCookie("jwt")
                        })
                    );
                }
            });
        }
    });
}

// Set the lightbox's basic config
lightbox.option({
    'resizeDuration': 200,
    'wrapAround': true
})

//************ CAROUSSEL SLIDER **************//

// Call the carousel's init function when the button is triggered
$('#sliderOption').on('click', function () {
    closeNav();
    initCarousel(document.querySelector('.interface-block'), "save");
})

// Create the DOM elements according to the previously selected images
function initCarouselContent(divC) {
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
}

// Show the upload image modal and allow users to select multiple images to append them in the slider
function initCarousel(outerNode, operation) {
    $('#uploadImageModal').modal('show');
    $("select").attr('multiple', 'multiple');
    $("select").imagepicker()
    $('#selectImg').off();
    $("#selectImg").on('click', function () {
        $('#uploadImageModal').modal('toggle');
        var divC = document.createElement('div');
        $(divC).addClass('owl-carousel');
        $(divC).addClass('owl-theme');
        initCarouselContent(divC);
        blockEditorInit(outerNode, operation, 4, divC.outerHTML);
        $("select").removeAttr('multiple');
    });
}

// Set the basic configuration for the carousel slider
function startCarousel() {
    var slider = document.querySelectorAll('.owl-carousel');
    slider.forEach(carousel => {
        $(carousel).owlCarousel({
            center: true,
            loop: true,
            margin: 10,
            slideSpeed: 300,
            paginationSpeed: 400,
            autoplay: true,
            autoplayHoverPause: true,
            items: 1,
            animateIn: 'fadeIn', // add this
            animateOut: 'fadeOut', // and this
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1
                    // nav:true
                },
                600: {
                    items: 1,
                    nav: true
                },
                1000: {
                    items: 1,
                    nav: true
                    // loop:false
                }
            },
            navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>']
        })
    })
}
window.addEventListener('load', function () {
    // Search for carousel divs and initiate them
    if (document.querySelector('.owl-carousel') != null) {
        setTimeout(function () { startCarousel() }, 200);
    }
    
    // Show the carousel's content edition menu to add or delete images
    $('.contentSlider').on('click', function () {
        var button = $(this);
        $('#uploadImageModal').modal('show');
        multipleSelect(button);
        $('#dropzoneSubmit').on('click', function () {
            setTimeout(function () { multipleSelect(button) }, 500);
        })
        $('#selectImg').off();
        $("#selectImg").on('click', function () {
            $('#uploadImageModal').modal('toggle');
            var divC = document.createElement('div');
            $(divC).addClass('owl-carousel');
            $(divC).addClass('owl-theme');
            initCarouselContent(divC);
            blockEditorInit($(button).parent()[0], "update", 4, divC.outerHTML);
        })
    })
})

// Automatically select images in the upload image modal
function multipleSelect(button) {
    $("select").attr('multiple', 'multiple');
    $("select").imagepicker();
    $(".image_picker_selector .image_picker_image").each(function (index, option) {
        $(button).parent().find("img").each(function (index, img) {
            if (option.src === img.src) {
                $(option).parent().addClass('selected');
            }
        })
    })
}
