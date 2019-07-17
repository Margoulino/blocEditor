$(document).on('click', '#addUser', function () {
    $("#addUserModal").modal('show');
});

$(document).on('click', '#addUser', function () {
    $('#adduser_form').submit();
})

$(document).on('submit', '#adduser_form', function () {
    var adduser_form = $(this).serializeObject();
    var form_data = JSON.stringify(adduser_form);
    $.ajax({
        url: "/user/addUserAdmin",
        type: "POST",
        contentType: 'application/json',
        data: form_data,
        success: function (result) {
            $('#response').fadeTo("slow", 1);
            $('#response').html("<div class='alert alert-success'>Mail d'inscription envoyé.</div>");
            setTimeout(function () {
                $('#response').fadeTo("slow", 0);
            }, 5000);
            $("#addUserModal").modal('toggle');
        },
        error: function (xhr, resp, text) {
            $(".alert-danger").effect( "highlight", {color:"#cf2b2b"}, 3000 );
            $('#responseModal').html("<div class='alert alert-danger'>Erreur lors de l'ajout. Veuillez réessayer.</div>");
            adduser_form.find('input').val('');
        }
    });
    return false;
});

$(document).on('click', '.deleteUser', function() {
    if(confirm("Confirmez vous la suppression de l'utilisateur ?")){
        $.ajax({
            url: "/user/delete",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                id: $(this).attr('id')
            }
            ),
            success: function(result) {
                console.log(result)
                location.reload();
            },
            error : function (xhr, resp, text) {
                console.log(resp);
                window.alert('Erreur lors de la suppression, veuillez réessayer.');
                
            }
        })
    }
})
$(document).on('click', '.updatePassw', function() {
    var newPasswd = window.prompt('Entrez le nouveau mot de passe de l\'utilisateur : ');
    if (newPasswd === null) { window.alert('Le mot de passe ne peut être vide !')}
    else {
        $.ajax({
            url : "/user/updatePassword",
            type: "POST",
            contentType: "application/json",
            data : JSON.stringify({
                password : newPasswd,
                id : $(this).attr('id')
            }),
            success: function(result) {
                window.alert('Mot de passe modifié avec succès.');
                location.reload();
            },
            error: function (xhr,resp,text) {
                window.alert('Erreur lors de la modification, veuillez réessayer.');
                location.reload();
            }
        })
    }
})
