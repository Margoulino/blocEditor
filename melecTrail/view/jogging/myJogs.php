<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="../../template/source.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.css" rel="stylesheet">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.4.1/css/bootstrap-datepicker3.css" />

    <title>Jogging</title>
</head>

<body>

    <br clear="all">

    <?php include_once(__DIR__ . '/../header.php') ?>

    <br clear="all">
    <div class="col-sm-12 container">
        <div class="row">
            <table class="table table-sm table-striped col-sm-5">
                <caption>Jogging créés</caption>
                <br />
                <thead>
                    <tr>
                        <th scope="col">Lieu de départ</th>
                        <th scope="col">date </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="jogsTab">
                    <?php
                    foreach ($jogsCreated as $t) {
                        echo
                            '<tr class="jogs">
                        <td scope="row" class="departure">' . $t->departure . '</td>
                        <td scope="row">' . date("l d F Y", strtotime($t->date)) . '</td>
                        <td> <button type="button" class="btn btn-info btn-xs" data-toggle="modal" data-target="#modifyModal" 
                                data-idJogging ="' . $t->id . '" data-creator="' . $t->creator . '" data-departure="' . $t->departure . '"
                                data-date="' . $t->date . '" data-description="' . $t->description . '" data-nbAtt="' . count(explode(" ; ", $t->attendees)) . '">
                                Détails
                             </button>
                        </td>
                    </tr>';
                    };
                    ?>
                </tbody>
            </table>
            <table class="table table-sm table-striped col-sm-5 ml-auto">
                <caption>Jogging auxquels je participe</caption>
                <thead>
                    <tr>
                        <th scope="col">Lieu de départ</th>
                        <th scope="col">date </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="jogsTab">
                    <?php
                    foreach ($jogsParticipate as $t) {
                        echo
                            '<tr class="jogs">
                        <td scope="row" class="departure">' . $t["departure"] . '</td>
                        <td scope="row">' . date("l d F Y", strtotime($t["date"])) . '</td>
                        <td> <button type="button" class="btn btn-info btn-xs" data-toggle="modal" data-target="#detailModal" 
                                data-idJogging ="' . $t["id"] . '" data-creator="' . $t["creator"] . '" data-departure="' . $t["departure"] . '"
                                data-date="' . $t["date"] . '" data-description="' . $t["description"] . '" data-nbAtt="' . count(explode(" ; ", $t["attendees"])) . '">
                                Détails
                             </button><button title ="Ne plus participer" class="btn far fa-times-circle fa-lg unparticipate" id="' . $t["id"] . '" style="padding: 6%; color: #ec0000"></button>
                        </td>
                    </tr>';
                    };
                    ?>
                </tbody>
            </table>
        </div>
    </div>
    <div id="modifyModal" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title text-primary">Détails de la sortie</h3>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <form id='modifyjog_form' method="post" action="/jogging/modifyJog">
                    <div class="modal-body">
                        <div>
                            <h4>Créateur</h4>
                            <p id="creatorVal"></p>
                        </div>
                        <div>
                            <h4>Date</h4>
                            <input type="date" class="form-control" name="date" id="dateVal" required />
                        </div>
                        <div>
                            <h4>Lieu de Départ</h4>
                            <input type="text" class="form-control" name="departure" id="departureVal" required />
                        </div>
                        <div>
                            <h4>Nombre de participants</h4>
                            <p id="nbAtt"></p>
                        </div>
                        <div>
                            <h4>Description</h4>
                            <input type="text" class="form-control" name="description" id="descriptionVal" required />
                        </div>
                        <input type="hidden" class="form-control" name="id" id="idVal" required />
                        <input type="hidden" class="form-control" name="jwt" id="jwtVal" required />

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-info" data-dismiss="modal">Fermer</button>
                        <button type="submit" class="btn btn-info btn-xs" id="modifyJog">Modifier</button>
                        <button type="button" class="btn btn-danger deleteJog" id="">Supprimer</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div id="detailModal" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title text-primary">Détails de la sortie</h3>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div>
                        <h4>Créateur</h4>
                        <p id="creatorVal"></p>
                    </div>
                    <div>
                        <h4>Date</h4>
                        <p id="dateVal" class="strong"></p>
                    </div>
                    <div>
                        <h4>Lieu de Départ</h4>
                        <p id="departureVal"></p>
                    </div>
                    <div>
                        <h4>Nombre de participants</h4>
                        <p id="nbAtt"></p>
                    </div>
                    <div>
                        <h4>Description</h4>
                        <p id="descriptionVal"></p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-info" data-dismiss="modal">Fermer</button>
                </div>
            </div>
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/ui/1.12.0/jquery-ui.min.js" integrity="sha256-eGE6blurk5sHj+rmkfsGYeKyZx3M4bG+ZlFyA7Kns7E=" crossorigin="anonymous"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.4.1/js/bootstrap-datepicker.min.js"></script>
    <script src="../../template/header.js"></script>
    <script src="../../template/jogging.js"></script>

</body>

</html>