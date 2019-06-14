<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="../../template/source.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">
  

    <title>Gestion utilisateurs</title>
</head>

<body>
    <br clear="all">
    <div class="phpTag">
        <?php include_once(__DIR__ . '/../header.php') ?>
    </div>
    <br clear="all">

    <div class="col-md-12">
        <p><strong>Utilisateurs inscrits</strong></p>
        
        <table class="table table-sm table-striped">
          <thead>
            <tr>
              <th scope="col">Nom d'utilisateur</th>
              <th scope="col">email </th>
            </tr>
          </thead>
          <tbody>
              <?php
                foreach($users as $user){
                    echo '<tr><td scope="row">'.$user['username'].'</td><td scope="row">'.$user['email'].'</td></tr>';
                
                }
              ?>
          </tbody>
        </table>
        <button class="btn btn-primary" id="addUser">Ajouter un utilisateur</button>
    </div>
    
<div id="addUserModal" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Ajouter un utilisateur</h5>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="adduser_form">
                    <div class="form-group">
                        <label for="username">Entrez l'email du nouvel utilisateur</label>
                        <input type="email" class="form-control" name="email" id="email" required />
                    </div>
                    <span style="color: #a29c9c;">L'utilisateur recevra sur sa boîte mail un code qu'il devra rentrer pour confirmer son inscription</span>
                    <br />
                    <br />
                    <button type='submit' class='btn btn-primary'>Envoyer le mail d'inscription</button>
                </form>
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
    <script src="../../template/user.js"></script>

</body>
</html>