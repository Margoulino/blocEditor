<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

    <title>Edition</title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous" />


</head>

<body>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <a class="navbar-brand" href="#">Edition de page</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav mr-auto">
                <a class="nav-item nav-link" href="#" id='setPageTree'>Structure du site</a>
                <a class="nav-item nav-link" href="/" id='gotoWebsite'>Accéder au site</a>
            </div>
        </div>
    </nav>


    <div id="treeModal" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Structure du site</h5>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id='tree_form'>
                    <div class="form-group">
                        <label for="username">Nom d'utilisateur</label>
                        <input type="text" class="form-control" name="username" id="username" required />
                        
                    </div>
                    <button type='submit' class='btn btn-primary'>Enregistrer</button>
                    <i class="fas fa-spinner fa-spin" style="display: none"></i>
                </form>
            </div>
        </div>
    </div>
</div>
</body>

</html>