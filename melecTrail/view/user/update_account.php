<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

    <title>Mise à jour du compte</title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous" />
    <link rel="stylesheet" href="../../template/source.css">

</head>

<body style="padding-right: 50%">
    <h2>Mise à jour du compte</h2>
    <div class="row">
        <div class="col">
            <div id="responseUpdate"></div>
        </div>
    </div>
    <form id="updateaccount_form">
        <div class="form-group">
            <label for="username">Nom d'utilisateur</label>
            <input type="text" class="form-control" name="username" id="username" value="<?php echo $user->username; ?>"/>
        </div>
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" class="form-control" name="email" id="email" value="<?php echo $user->email; ?>"/>
        </div>
        <div class="form-group">
            <label for="password">Mot de passe</label>
            <input type="password" class="form-control" name="password" id="password"/>
        </div>
        <div class="form-group">
            <label for="alertnews">Être alerté lorsqu'une nouvelle sortie est disponible ?</label>
            <?php
                if($user->alert === '1'){
                    echo '<input type="checkbox" name="alertnews" id="alertnews" checked/>';
                } else {
                    echo '<input type="checkbox" name="alertnews" id="alertnews"/>';
                }
            ?>
        </div>
        <button type='submit' id="editAccount" class='btn btn-primary'>Confirmer</button>
        <a class='btn btn-info' href="/jogging">Retour</a>
    </form>

    <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src="../../template/header.js"></script>

</body>

</html>