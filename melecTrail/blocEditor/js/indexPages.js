$('.addPage').on('click', function () {
    var idcat = $(this).attr('id');
    $('#addPageModal').modal('show');
    $('#addPageModal').find('#catnameinput').val(idcat);
});

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a,function() {
        if(o[this.name] !== undefined) {
            if(!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
}

$('#nav-tabContent a').on('click', function () {
    if (confirm('Modifier la page ' + $(this).attr('id') + ' ?')) {
        window.location.href = "/page/editionPage/" + $(this).attr('id');
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

$(document).on('click', '.deleteCat', function () {
    if(confirm("Confirmez-vous la suppression de cette catégorie ? Si une page n'est pas dupliquée dans une autre catégorie elle sera supprimée.")) {
        var name = $(this).parent().attr('id');
        $.ajax({
            url: "/category/delete",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                name: name
            }),
            success: function(result) {
                window.alert('Catégorie supprimée avec succès ! ');
                //window.location.reload();
            },
            error: function (xhr, resp, text) {
                console.log(resp);
                window.alert('Erreur lors de la suppression, veuillez réessayer.')
                //window.location.reload();
            }
        })
    }
})