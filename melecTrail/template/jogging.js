//Affiche le modal d'ajout de jogging lors d'un click
$(document).on('click', '#addJogButton', function () {
    $("#addJogModal").modal('show');
});
//Barre de recherche dynamique
$("#searchInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#jogsTab tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
});

//Envoi le formulaire d'ajout de jogging au serveur 
$(document).on('submit', '#addJog_form', function () {
    var addJog_form = $(this).serializeObject();
    addJog_form.jwt = getCookie('jwt');
    var form_data = JSON.stringify(addJog_form);
    $.ajax({
        url: "jogging/newJogging",
        type: "POST",
        contentType: 'application/json',
        data: form_data,
        success: function (result) {
            $("#addJogModal").modal('toggle');
            window.alert("Jogging créé avec succès.");
            window.location.reload();
        },
        error: function (xhr, resp, text) {
            if (xhr.status == 403) {
                window.alert("Erreur lors de l'ajout, veuillez vous reconnecter");
                $("#addJogModal").modal('toggle');
                $("#loginModal").modal('show');
            } else {
                window.alert("Erreur lors de l'ajout, veuillez réessayer");
            }
        }
    });
    return false;
});
//Modal dynamique pour le détail des jogging
$('#detailModal').on('show.bs.modal', function (event) {
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
    modal.find('.modal-body #dateVal').text(date)
    modal.find('.modal-body #departureVal').text(departure)
    modal.find('.modal-body #descriptionVal').text(description)
    var jwt = getCookie('jwt');
    //Bouton "Y participer"
    $('#participate').off().on('click', function () {
        if (confirm("Confirmer la participation à l'évènement ?")) {
            var partForm = {
                "idJogging": idJogging,
                "jwt": jwt
            }
            $.ajax({
                url: "jogging/addJogger",
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify(partForm),
                success: function (result) {
                    $("#detailModal").modal('toggle');
                },
                error: function (xhr, resp, text) {
                    if (xhr.status == 403) {
                        window.alert("Vous devez être connecté pour effectuer cette opération");
                        $("#detailModal").modal('toggle');
                        $("#loginModal").modal('show');
                    } else if (xhr.status == 412) {
                        window.alert("Vous participez déjà au jogging");
                    } else if (xhr.status == 418) {
                        window.alert("Jogging déja plein.")
                    } else {
                        window.alert("Erreur, veuillez réessayer");
                    }
                }
            });
        }
        return false;
    })
})

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
    modal.find('.modal-body #jwtVal').val(getCookie('jwt'))
    modal.find('.deleteJog').attr('id', idJogging);
});

$('.deleteJog').on('click', function (event) {
    var id = $(this).attr('id');
    var jwt = getCookie('jwt');
    var data2controller = {
        "id": id,
        "jwt": jwt
    }
    if (confirm("Supprimer le jogging ?")) {
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
    var id = $(this).attr('id');
    var jwt = getCookie('jwt');
    var data2controller = {
        "id": id,
        "jwt": jwt
    }
    if (confirm("Ne plus participer au jogging ?")) {
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

$(function () {
    $('#datetimepicker6').datepicker({
        language: 'fr',
        format: 'mm/dd/yyyy'
    }).on('changeDate', function (ev) {
        $('#datetimepicker7').datepicker('setStartDate', ev.date);
        var startDate = new Date($(this).find('input').val());
        if ($('#datetimepicker7').find('input').val() == "") {
            $("#jogsTab tr").filter(function () {
                var jogsDate = new Date($(this).find('.dateJogs').text());
                $(this).toggle(jogsDate >= startDate);
            });
        }
    });
    $('#datetimepicker7').datepicker({
        useCurrent: false,
        language: 'fr',
        format: 'mm/dd/yyyy'
    }).on('changeDate', function (ev) {
        $('#datetimepicker6').datepicker('setEndDate', ev.date);
        var endDate = new Date($(this).find('input').val());
        var startDate = new Date($('#datetimepicker6').find('input').val());
        if ($('#datetimepicker6').find('input').val() == "") {
            $("#jogsTab tr").filter(function () {
                var jogsDate = new Date($(this).find('.dateJogs').text());
                $(this).toggle(jogsDate <= endDate);
            });
        } else {
            $("#jogsTab tr").filter(function () {
                var finDate = new Date($(this).find('.dateJogs').text());
                $(this).toggle(finDate >= startDate && finDate <= endDate);
            });
        }
    });
});

