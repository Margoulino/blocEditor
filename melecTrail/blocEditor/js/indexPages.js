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
        acceptedFiles: ".jpg, .jpeg, .png, .gif",
        addRemoveLinks: true,
        dictFileTooBig: "File is to big ({{filesize}}mb). Max allowed file size is {{maxFilesize}}mb",
        dictInvalidFileType: "Invalid File Type",
        dictCancelUpload: "Cancel",
        dictRemoveFile: "Remove",
        dictMaxFilesExceeded: "Only {{maxFiles}} file is allowed",
        dictDefaultMessage: "Drop files here to upload",
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
        this.on("addedfile", function (file) {
            console.log(file);
        });

        this.on("error", function (file, response) {
            console.log(response);
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


