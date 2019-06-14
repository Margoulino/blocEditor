<nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
    <a class="navbar-brand" href="#">Melec'Trail</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav mr-auto">
            <a class="glyphicon glyphicon-user" href="#"></a>
            <a class="nav-item nav-link" href="/" id='home'>Accueil</a>
            <a class="nav-item nav-link" href="#" id='login'>Connexion</a>
            <a class="nav-item nav-link" href="#" id='sign_up'>Inscription</a>
            <form id="myJogsForm" action="/jogging/getJogsByCreator" method="post">
                <a class="nav-item nav-link" href="#" id='myjogs'>Mes joggings</a>
                <input type="hidden" class="form-control jwtToken" name="jwt" required />
            </form>
            <form id="manageUsers" action="/user/showUsers" method="post" style="display: none;">
                <a class="nav-item nav-link" href="#" id="showUsers">Gestion des utilisateurs</a>
                <input type="hidden" class="form-control jwtToken" name="jwt" required />
            </form>
            <div class="dropdown-container">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownList" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Mon compte
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdownList">
                    <a class="dropdown-item" href="/user/update_redirect">Modifier mon comtpe</a>
                    <a class="dropdown-item" href="#" id='logout'>Déconnexion</a>
                </div>
            </div>
        </div>
    </div>
</nav>

<div id="loginModal" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Connexion</h5>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id='login_form'>
                    <div class="form-group">
                        <label for="username">Nom d'utilisateur</label>
                        <input type="text" class="form-control" name="username" id="username" required />
                    </div>
                    <div class="form-group">
                        <label for="password">Mot de passe</label>
                        <input type="password" class="form-control" name="password" id="password" required />
                    </div>
                    <div class="row">
                        <div class="col">
                            <div id="responseModal"></div>
                        </div>
                    </div>

                    <button type='submit' class='btn btn-primary'>se connecter</button>
                    <i class="fas fa-spinner fa-spin" style="display: none"></i>
                </form>
            </div>
        </div>
    </div>
</div>
<div id="signupModal" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Inscription</h5>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="signup_form">
                    <div class="form-group">
                        <label for="username">Nom d'utilisateur</label>
                        <input type="text" class="form-control" name="username" id="username" required />
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" class="form-control" name="email" id="email" required />
                    </div>
                    <div class="form-group">
                        <label for="password">Mot de passe</label>
                        <input type="password" class="form-control" name="password" id="password" required />
                    </div>
                    <div class="form-group">
                        <label for="code">Mot de passe fourni par l'administrateur</label>
                        <input type="text" class="form-control" name="code" id="code" required />
                    </div>
                    <div class="form-group">
                        <input type="checkbox"  id="alertnews" name="alertnews">
                        <label for="alertnews">Être alerté lorsqu'une sortie est publiée.</label>
                    </div>
                    <button type='submit' class='btn btn-primary'>S'inscrire</button>
                </form>
            </div>
        </div>
    </div>
</div>

<main role="main" class="container starter-template">

    <div class="row">
        <div class="col">
            <div id="response"></div>
        </div>
    </div>
</main>