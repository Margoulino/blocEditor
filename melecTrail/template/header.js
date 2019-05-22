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
//Lors d'un click sur le bouton logout, on set le cookie à une date invalide pour le supprimer
$(document).on('click', '#logout', function () {
    setCookie("jwt", null, -1);
    if (window.location.href == "http://melectrail/jogging/getJogsByCreator") {
        window.location.href = "/jogging";
    } else {
        $('#response').fadeTo("slow", 1);
        $('#response').html("<div class='alert alert-success'>Déconnexion réussie.</div>");
        setTimeout(function () {
            $('#response').fadeTo("slow", 0);
        }, 5000);
        $("#login").show();
        $("#sign_up").show();
        $("#navbarDropdownList").hide();
        $("#myjogs").hide();
    }
})

//Fonction pour stocker un cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
//Fonction pour récupérer le cookie
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
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
    var login_form = $(this);
    var form_data = JSON.stringify(login_form.serializeObject());
    $.ajax({
        url: "user/login",
        type: "POST",
        contentType: 'application/json',
        data: form_data,
        success: function (result) {
            setCookie("jwt", result.jwt, 1);
            $('#response').fadeTo("slow", 1);
            $('#response').html("<div class='alert alert-success'>Connexion réussie.</div>");
            setTimeout(function () {
                $('#response').fadeTo("slow", 0);
            }, 5000);
            $("#loginModal").modal('toggle');
            $("#login").hide();
            $("#sign_up").hide();
            $("#navbarDropdownList").show();
            $("#myjogs").show();
            $('#jwtToken').val(getCookie('jwt'));
            $('.fa-spin').hide();
        },
        error: function (xhr, resp, text) {
            $('.fa-spin').hide();
            $(".alert-danger").effect( "highlight", {color:"#cf2b2b"}, 3000 );
            $('#responseModal').html("<div class='alert alert-danger'>Erreur lors de la connexion. Nom d'utilisateur ou mot de passe incorrect.</div>");
            login_form.find('input').val('');
        }
    });
    return false;
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
            $("#sign_up").hide();
            $("#signupModal").modal('toggle');
            $("#loginModal").modal('show');
            $('#responseModal').html("<div class='alert alert-success'>Inscription réussie, veuillez vous connecter</div>");
        },
        error: function (xhr, resp, text) {
            window.alert("Erreur lors de l'inscription, veuillez réessayer.");
            signup_form.find('input').val('');
        }
    });
    return false;
});
//Envoi le formulaire de changement des informations du compte au serveur
$(document).on('submit', '#updateaccount_form', function () {
    var updateaccount_form = $(this).serializeObject();
    updateaccount_form.jwt = getCookie('jwt');
    var form_data = JSON.stringify(updateaccount_form);
    $.ajax({
        url: "update_account",
        type: "POST",
        contentType: 'application/json',
        data: form_data,
        success: function (result) {
            window.alert("Compte mis à jour avec succès.");
            window.location.href = "/jogging";
        },
        error: function (xhr, resp, text) {
            if (xhr.status == 403) {
                window.alert("Erreur, veuillez vous reconnecter");
                window.location.href = "/jogging";
            } else {
                window.alert("Erreur lors de l'ajout, veuillez réessayer");
            }
        }
    });
    return false;
});

window.addEventListener("DOMContentLoaded", function () {
    //Enlève les boutons login et sign up lorsque l'utilisateur est loggé et inversement
    if (getCookie("jwt")) {
        $("#login").hide();
        $("#sign_up").hide();
        $("#navbarDropdownList").show();
        $("#myjogs").show();
    } else {
        $("#myjogs").hide();
        $("#login").show();
        $("#sign_up").show();
        $("#navbarDropdownList").hide();
    }
    var form = $('#myJogsForm');
    $('#jwtToken').val(getCookie('jwt'));
    $(document).on('click', '#myjogs', function () {
        form.submit();
    })
});


