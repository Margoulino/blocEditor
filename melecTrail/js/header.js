//---------------------------------------------//
/* HEADER SCRIPT */
//---------------------------------------------//
//Affiche le modal d'insciption lors d'un click
$(document).on('click', '#sign_up', function () {
    $("#signupModal").modal('show');
});
//Affiche le modal de connexion lors d'un click
$(document).on('click', '#login', function () {
    $("#loginModal").modal('show');
});

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
//Envoi le formulaire de login au serveur lors d'un click et stock le json web token reçu en cas de succès
$(document).on('submit', '#login_form', function () {
    $('.fa-spin').show();
});
//Envoi le formulaire d'inscription au serveur
$(document).on('submit', '#signup_form', function () {
    var signup_form = $(this);
    var form_data = JSON.stringify(signup_form.serializeObject());
    $.ajax({
        url: "user/signup",
        type: "POST",
        contentType: 'application/json',
        data: form_data,
        success: function (result) {
            $("#signupModal").modal('toggle');
            $("#loginModal").modal('show');
            $('#responseModal').html("<div class='alert alert-success'>Inscription réussie, veuillez vous connecter</div>");
        },
        error: function (xhr, resp, text) {
            window.alert("Erreur lors de l'inscription, veuillez réessayer.");
            //signup_form.find('input').val('');
        }
    });
    return false;
});
//Envoi le formulaire de changement des informations du compte au serveur
$(document).on('click', '#editAccount', function (event) {
    $('#updateaccount_form').submit();
});

window.addEventListener("DOMContentLoaded", function () {
    $(document).on('click', '#alljogs', function() {
        location.href='/jogging';
    })
    $(document).on('click', '#showUsers', function () {
        location.href="/user/showUsers";
    })
    $(document).on('click', '#editAccount', function () {
        location.href ="/user/update_redirect";
    })
    $(document).on('click', '#logoutUser', function () {
        location.href="/user/logoutUser";
    })
});

