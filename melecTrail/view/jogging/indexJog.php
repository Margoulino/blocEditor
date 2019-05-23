<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="../../template/source.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.css" rel="stylesheet">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.8.0/css/bootstrap-datepicker.min.css" />

    <title>Jogging</title>
</head>

<body>

    <br clear="all">
    <div class="phpTag">
        <?php include_once(__DIR__ . '/../header.php') ?>
    </div>
    <br clear="all">

    <div class="ui-widget">

        <div class="container">

            <p>rechercher par période : </p>
            <div class='datepicker col-md-4'>
                <div class="form-group">
                    <div class='input-group date' id='datetimepicker6'>
                        <input type='text' class="form-control" name="startDate" />
                        <a class="btn btn-success" href="#">
                            <span class="input-group-addon">
                                <span class="far fa-calendar-alt"></span>
                            </span>
                        </a>
                    </div>
                </div>
            </div>
            <p class="strong" style="display: inline-block"> à </p>
            <div class='datepicker col-md-4'>
                <div class="form-group">
                    <div class='input-group date' id='datetimepicker7'>
                        <input type='text' class="form-control" name="endDate" />
                        <a class="btn btn-success" href="#">
                            <span class="input-group-addon">
                                <i class="far fa-calendar-alt"></i>
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <input type="text" id="searchInput" style="width:300px" placeholder="rechercher par mots clés" name="search">
        <br />

    </div>
    <br />
    <br />
    <table class="table table-sm table-striped col-sm-10">
        <thead>
            <tr>
                <th scope="col">Lieu de départ</th>
                <th scope="col">date </th>
                <th></th>
            </tr>
        </thead>
        <tbody id="jogsTab">
            <div class="phpTag">
                <?php
                foreach ($tab_jog as $t) {
                    echo
                        '<tr class="jogs">
                        <td scope="row" class="departure">' . $t["departure"] . '</td>
                        <td scope="row"class="dateJogs">' . date("l d F Y", strtotime($t["date"])) . '</td>
                        <td> <button type="button" class="btn btn-info btn-xs glyphicon glyphicon-info-sign" data-toggle="modal" data-target="#detailModal" 
                                data-idJogging ="' . $t["id"] . '" data-creator="' . $t["creator"] . '" data-departure="' . $t["departure"] . '"
                                data-date="' . $t["date"] . '" data-description="' . $t["description"] . '" data-nbAtt="' . count(explode(" ; ", $t['attendees'])) . '">
                                Détails
                             </button>
                        </td>
                    </tr>';
                };
                ?>
            </div>
        </tbody>
    </table>
    <p>
        <button type="button" class="btn btn-info btn-sm" id="addJogButton">
            Ajouter un jogging <span class="glyphicon glyphicon-plus"></span>
        </button>
    </p>
    <div id="addJogModal" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Nouveau jogging</h5>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id='addJog_form'>
                        <div class="form-group">
                            <label for="username">Date</label>
                            <input type="date" class="form-control" name="date" id="date" required />
                        </div>
                        <div class="form-group">
                            <label for="password">Lieu de départ</label>
                            <input type="text" class="form-control" name="departure" id="departure" required />
                        </div>
                        <div class="form-group">
                            <label for="password">Description</label>
                            <input type="text" class="form-control" name="description" id="description" required />
                        </div>
                        <button type='submit' class='btn btn-primary'>Ajouter</button>
                    </form>
                </div>
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
                    <button type="button" class="btn btn-success" id="participate">Y participer</button>
                </div>
            </div>
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/ui/1.12.0/jquery-ui.min.js" integrity="sha256-eGE6blurk5sHj+rmkfsGYeKyZx3M4bG+ZlFyA7Kns7E=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.8.0/js/bootstrap-datepicker.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.8.0/locales/bootstrap-datepicker.fr.min.js"></script>
    <script src="../../template/header.js"></script>
    <script src="../../template/jogging.js"></script>
    <script>
        var availableTags = [
            <?php
            for ($i = 0; $i < (sizeof($tab_jog) - 1); $i++) {
                echo '"' . $tab_jog[$i]['departure'] . '"' . ',';
            }
            echo '"' . $tab_jog[$i]['departure'] . '"';
            ?>
        ];
        $("#searchInput").autocomplete({
            source: availableTags
        });
    </script>
</body>

</html>