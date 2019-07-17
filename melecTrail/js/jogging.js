//Affiche le modal d'ajout de jogging lors d'un click
$(document).on('click', '#addJogButton', function () {
    $("#addJogModal").modal('show');
});
//Barre de recherche dynamique
$("#searchInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#rowJog .jogDeparture").filter(function () {
        $(this).closest('.jogCart').toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
});

//Envoi le formulaire d'ajout de jogging au serveur 
$(document).on('submit', '#addJog_form', function () {
    var addJog_form = $(this).serializeObject();
    var form_data = JSON.stringify(addJog_form);
    $.ajax({
        url: "/jogging/newJogging",
        type: "POST",
        contentType: 'application/json',
        data: form_data,
        success: function (result) {
            $("#addJogModal").modal('toggle');
            window.alert("Sortie créée avec succès.");
            window.location.reload();
        },
        error: function (xhr, resp, text) {
            if (xhr.status == 403) {
                window.alert(xhr);
                $("#addJogModal").modal('toggle');
                $("#loginModal").modal('show');
            } else {
                window.alert(xhr);
            }
        }
    });
    return false;
});
$(document).ready(function() {
$('.participate').on('click', function () {
    if (confirm("Confirmer la participation à l'évènement ?")) {
        var partForm = {
            "idJogging": $(this).closest('.jogCart').attr('id'),
        }
        $.ajax({
            url: "/jogging/addJogger",
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify(partForm),
            success: function (result) {
                window.location.reload();
            },
            error: function (xhr, resp, text) {
                if (xhr.status == 403) {
                    window.alert("Vous devez être connecté pour effectuer cette opération");
                    $("#detailModal").modal('toggle');
                    $("#loginModal").modal('show');
                } else if (xhr.status == 412) {
                    window.alert("Vous participez déjà à la sortie");
                } else if (xhr.status == 418) {
                    window.alert("Sortie déja pleine.")
                } else {
                    window.alert("Erreur, veuillez réessayer");
                }
            }
        });
    }})})
$('#modifyModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    var creator = button.data('creator')
    var date = button.data('date')
    var departure = button.data('departure')
    var description = button.data('description')
    var idJogging = button.data('idjogging')
    var nbAtt = button.data('nbatt')
    var modal = $(this)
    modal.find('.modal-body #nbAtt').text(nbAtt);
    modal.find('.modal-body #creatorVal').text(creator)
    modal.find('.modal-body #dateVal').val(date)
    modal.find('.modal-body #departureVal').val(departure)
    modal.find('.modal-body #descriptionVal').val(description)
    modal.find('.modal-body #idVal').val(idJogging)
    modal.find('.deleteJog').attr('id', idJogging);
});

$('.deleteJog').on('click', function (event) {
    var id = $(this).attr('id');
    var data2controller = {
        "id": id,
    }
    if (confirm("Supprimer la sortie ?")) {
        $.ajax({
            url: "/jogging/deleteJog",
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify(data2controller),
            success: function (result) {
                window.location.reload();
            },
            error: function (xhr, resp, text) {
                if (xhr.status == 403) {
                    window.alert("Erreur, veuillez vous reconnecter");
                    $("#loginModal").modal('show');
                }
                else if (xhr.status == 412) {
                    window.alert("Erreur, veuillez réessayer");
                }
            }
        });
    }
});


$('.unparticipate').on('click', function (event) {
    var id = $(this).closest('.jogCart').attr('id');
    var data2controller = {
        "id": id,
    }
    if (confirm("Ne plus participer à la sortie ?")) {
        $.ajax({
            url: "/jogging/unparticipate",
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify(data2controller),
            success: function (result) {
                window.location.reload();
            },
            error: function (xhr, resp, text) {
                if (xhr.status == 403) {
                    window.alert("Erreur, veuillez vous reconnecter");
                    $("#loginModal").modal('show');
                }
            }
        });
    }
})

