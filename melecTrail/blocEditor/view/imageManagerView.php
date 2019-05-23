<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

    <title>Gestionnaire d'images</title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">

</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand" href="#">Gestionnaire d'images</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="/">Home</a>
                </li>
                <li class="nav-item">
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                        Ajouter une image
                    </button>
                </li>
            </ul>
        </div>
    </nav>
    <div class="container">
        <div class="row">
            <div class="col">
                <?php
                foreach ($imagesToDisplay as $img) {
                    echo "<img src='" . $img->path . "'/>";
                }
                ?>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Ajout d'image</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <input id="imgName" class="form-control" type="text" placeholder="Nom de l'image">
                            <hr>
                            <label for="exampleFormControlFile1">Selectionnez un fichier image (jpg, jpeg, png, gif)</label>
                            <input id="imgInput" type="file" class="form-control-file" id="exampleFormControlFile1">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
                    <button id="sendImg" type="button" class="btn btn-primary">Enregistrer</button>
                </div>
            </div>
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
    <script>
        function saveImg() {
            // Sending and receiving data in JSON format using POST method
            var xhr = new XMLHttpRequest();
            var nameTyped = document.getElementById("imgName").value.replace(" ", "_");
            var fileExtension = document.getElementById("imgInput").value.split(".").pop();
            var url = "/image/addImage";
            var path = "<?php $_SERVER['DOCUMENT_ROOT'] ?>/blocEditor/img/" + nameTyped + "." + fileExtension;
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");

            var data = JSON.stringify({
                "name": nameTyped.replace(" ", "_"),
                "path": path,
                "height": "height",
                "width": "width",
                "extension": fileExtension
            });

            xhr.onreadystatechange = function() { // Call a function when the state changes.
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    $('#exampleModal').modal('hide');
                }
            }

            xhr.send(data);
        }
        var sendImgBtn = document.getElementById("sendImg");
        sendImgBtn.addEventListener("click", function() {
            saveImg();
        });
    </script>
</body>

</html>