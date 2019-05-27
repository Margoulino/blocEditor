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
$('.addPage').on('click', function() {
    var idcat=$(this).attr('id');
    $('#addPageModal').modal('show');
    $('#addPageModal').find('#catnameinput').val(idcat);
});
$('#nav-tabContent a').on('click', function () {
    if (confirm('Modifier la page ' + $(this).attr('id') + ' ?')){
        window.location.href="/page/editPage/"+$(this).attr('id');
    };
})

$('.addCat').on('click',function(){
    $('#addCategoryModal').modal('show');
})

$(document).ready(function() {
    $("#list-tab a").first().addClass("active");
    $("#nav-tabContent div").first().addClass("show active");
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
            //$('#responseModal').html("<div class='alert alert-success'>Inscription réussie, veuillez vous connecter</div>");
            window.location.reload();
        },
        error: function (xhr, resp, text) {
            window.alert("Erreur lors de l'ajout, veuillez réessayer.");
            signup_form.find('input').val('');
        }
    });
    return false;
});

$(document).on('submit', '#cat_form', function() {
    var cat_form=$(this);
    var form_data = JSON.stringify(cat_form.serializeObject());
    $.ajax({
        url: "/category/addcategory" , 
        type: "POST",
        contentType: "application/json",
        data: form_data,
        success: function(result){
            window.location.reload();
        },
        error: function(xhr, resp, text) {
            window.alert("Erreur lors de l'ajout, veuillez réessayer.")
            cat_form.find('input').val('');
            console.log(resp);
        }
    });
    return false;
});
