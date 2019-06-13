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
                    echo '<tr><td scope="row">'.$user['username'].'</td><td scope="row">'.$user['email'].'</td>';
                    echo '<td class="text-center"><a title="Supprimer l\'utilisateur" class="fa fa-times text-danger ml-1" ng-click="deleteUser(value.id)"></a>
                    <a title="Changer le mot de passe de l\'utilisateur" class="fa fa-lock text-warning ml-1" ng-click="changePassword(value.id)"></a>
                  </td></tr>';
                }
              ?>
          </tbody>
        </table>
        <a role="button" class="btn btn-primary" href="./addUser.php">Ajouter un utilisateur</a>
    </div>
    <script src="../../template/header.js"></script>
    <script src="../../template/jogging.js"></script>
</body>
</html>