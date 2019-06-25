$(document).on('click', '#addUser', function () {
    $("#addUserModal").modal('show');
});

$(document).on('click', '#addUser', function () {
    $('#adduser_form').submit();
})

$(document).on('submit', '#adduser_form', function () {
    var adduser_form = $(this).serializeObject();
    adduser_form.jwt = getCookie('jwt');
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
                id: $(this).attr('id'),
                jwt: getCookie('jwt')
            }
            ),
            success: function(result) {
                location.reload();
            },
            error : function (xhr, resp, text) {
                console.log(resp);
                window.alert('Erreur lors de la suppression, veuillez réessayer.');
                window.location.reload();
            }
        })
    }
})
