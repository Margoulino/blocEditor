<div class="tm-top-bar-bg"></div>
<div class="tm-top-bar" id="tm-top-bar">
    <div class="container">
        <div class="row">
            <nav class="navbar navbar-expand-lg narbar-light">
                <a class="navbar-brand mr-auto" style="width:25%;" href="./">
                    <img src="../../trail-plumelec/logo.gif" alt="LE MELEC TRAIL">
                    <img src="../../trail-plumelec/lemelectrail.png" style="width:60%;" alt="LE MELEC TRAIL">
                    <!-- Le Melec Trail -->
                </a>
                <button type="button" id="nav-toggle" class="navbar-toggler collapsed" data-toggle="collapse" data-target="#mainNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div id="mainNav" class="collapse navbar-collapse tm-bg-white">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item dropdown">
                            <a class="nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Le Melec Trail</a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#">En construction</a>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Inscrivez-vous !</a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" target="_blank" href="https://www.sportinnovation.fr/inscription3.1/inscription.php?crs=3667">Trail 8,5 Km</a>
                                <a class="dropdown-item" target="_blank" href="https://www.sportinnovation.fr/inscription3.1/inscription.php?crs=3668">Trail 15 Km</a>
                                <a class="dropdown-item" target="_blank" href="https://www.sportinnovation.fr/inscription3.1/inscription.php?crs=3669">Trail 24 Km</a>
                            </div>
                        </li>
                        <?php 
                        if (isset($_COOKIE['jwt'])) {
                           echo' <li><a class="nav-link" href="/jogging" id="alljogs">Nos sorties</a>
                        </li>';} ?>
                        <li class="nav-item dropdown">
                            <a class="nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Espace adhérent</a>
                            <div class="dropdown-menu">
                                <?php
                                if (isset($_COOKIE['jwt'])) {
                                    echo '<a class="dropdown-item" href="#" id="showUsers">Liste des adhérents</a>
                                        <a class="dropdown-item" href="#" id="editAccount">Modifier mon comtpe</a>';
                                } else {
                                    echo '<a class="dropdown-item" href="#" id="sign_up">Inscription</a>
                                        <a class="dropdown-item" href="#" id="login">Connexion</a>';
                                }
                                ?>
                            </div>
                        </li>
                        <?php
                        if (isset($_COOKIE['jwt'])) {
                            echo '    <li>
                            <a class="nav-link" href="#" id="logoutUser">Déconnexion</a>
                        </li>';}
                            ?>
                        </ul>
                    </div>
                </nav>
            </div> <!-- row -->
        </div> <!-- container -->
    </div> <!-- .tm-top-bar -->







    <!-- <main role="main" class="container starter-template">

        <div class="row">
            <div class="col">
                <div id="response"></div>
            </div>
        </div>
    </main> -->