<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="<?php echo $page[0]->description; ?>">
  <meta name="keywords" content="<?php
                                  $keywords = json_decode($page[0]->keywords);
                                  if ($keywords !== null) {
                                    foreach ($keywords as $key => $keyword) {
                                      if ($key !== (count($keywords) - 1)) {
                                        echo $keyword . ', ';
                                      } else {
                                        echo $keyword;
                                      }
                                    }
                                  }
                                  ?>">
  <title><?php echo $page[0]->name; ?></title>

  <!-- load stylesheets -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700"> <!-- Google web font "Open Sans" -->
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css">
  <link rel="stylesheet" href="/blocEditor/view/preview/font-awesome-4.7.0/css/font-awesome.min.css"> <!-- Font Awesome -->
  <link rel="stylesheet" href="/blocEditor/view/preview/css/bootstrap.min.css"> <!-- Bootstrap style -->
  <link rel="stylesheet" type="text/css" href="/blocEditor/view/preview/css/datepicker.css">
  <link rel="stylesheet" href="/blocEditor/style/dependances/jquery-ui.css">
  <link rel="stylesheet" href="/blocEditor/style/dependances/owl.carousel.min.css">
  <link rel="stylesheet" href="/blocEditor/style/dependances/owl.theme.default.min.css">
  <link rel="stylesheet" href="/blocEditor/view/preview/css/templatemo-style.css">
  <link rel="stylesheet" href="/blocEditor/style/dependances/lightbox.min.css">
  <link rel="stylesheet" href="/blocEditor/style/dependances/ekko-lightbox.css">
  <link rel="stylesheet" href="/blocEditor/style/dependances/dropzone.css" />
  <link rel="stylesheet" href="/blocEditor/style/dependances/image-picker.css" />
  <link rel="stylesheet" href="/blocEditor/view/preview/css/custom.css"> <!-- Templatemo style -->

  <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
              <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
              <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
          <![endif]-->
</head>

<body>
  <div class="tm-main-content" id="top">

    <div class="tm-top-bar-bg"></div>
    <div class="tm-top-bar" id="tm-top-bar">
      <div class="container">
        <div class="row">
          <nav class="navbar navbar-expand-lg narbar-light">
            <a class="navbar-brand mr-auto" style="width:25%;" href="./index.html">
              <img src="/blocEditor/view/preview/trail-plumelec/logo.gif" alt="LE MELEC TRAIL">
              <img src="/blocEditor/view/preview/trail-plumelec/lemelectrail.png" style="width:60%;" alt="LE MELEC TRAIL">
              <!-- Le Melec Trail -->
            </a>
            <?php echo $header; ?>
            <!-- row -->
        </div> <!-- container -->
      </div> <!-- .tm-top-bar -->
    </div>
    <div class="tm-page-wrap mx-auto">
      <section class="tm-banner">
        <div class="tm-container-outer innerPage-banner-bg" <?php echo 'id="' . $bannerBg->id . '" style="background: url(' . $bannerBg->content . ') center center no-repeat;" '; ?>>
          <div class="container">

            <div class="row tm-banner-row tm-banner-row-header">
            </div> <!-- row -->
            <div class="row tm-banner-row" id="tm-section-search">
            </div> <!-- row -->
            <div class="tm-banner-overlay">
              <?php if ($nav === null) {
                echo '<button class="btn-xs btn btn-info editBannerBg float-right"><i class="fas fa-edit"></i></button>';
              }
              ?></div>
          </div> <!-- .container -->
        </div> <!-- .tm-container-outer -->
      </section>



      <div class="tm-container-outer" id="tm-section-2">
        <section class="tm-innePage-section">
          <div class="tm-innePage tm-bg-gray">

            <div class="col-md-10 offset-md-1 p-1 contentPreview">
              <?php
              if ($blocks != NULL) {
                foreach ($blocks as $block) {
                  if (($block->idParent === null || $block->idParent === "0") && $block->idBlockType !== '8') {
                    if ($block->idBlockType === '5' || $block->idBlockType === '4' || $block->idBlockType === '9') {
                      echo '<div id="' . $block->id . '" class="block-unit">';
                      echo str_replace(array('{$block->content}', '{$block->style}'), array($block->content, $block->styleBlock), $categHTML[$block->idBlockType]);
                    } else {
                      echo '<div id="' . $block->id . '" class="block-unit-complex">';
                      echo $block->content;
                    }
                    echo '</div>';
                  }
                }
              }
              if ($nav === null) {
                echo '<a id="backEdit" class="btn btn-info" href="/page/editionPage/' . $page[0]->name . '">Retour à l\'édition</a>&nbsp;&nbsp;';
                if ($page[0]->public == 0) {
                  echo '<a id="pagePublish" class="btn btn-success" href="">Publier</a>';
                } else {
                  echo '<a id="pageDepublish" class="btn btn-danger" href="">Dépublier</a>';
                }
              }
              ?>
            </div>

          </div>
          <div id="tm-innePage-information" class="tm-bg-primary hermine_br">
            <h2 class="">Informations essentielles</h2>
            <p style="text-align:justify;">
              Tous les dossards sont à retirer à Plumelec au stade de la Madeleine.
            </p>
            <p style="text-align:justify;">
              Les pré-inscriptions sont également possibles au <b>06.62.56.60.65</b> jusqu'au <b>03 août 2019 inclus</b>.
            </p>
            <p>
              Les chèques sont à établir à l'ordre de <b>Courir à Plumelec</b>.
            </p>
            <p>
              Tout dossier adressé par voie postale est à envoyer à<br>Mr. Jean-Louis LANTRAIN<br>24 rue du 6 juin 1944<br>56420 Plumelec
            </p>
            <p style="text-align:justify;">
              Les inscriptions sont possibles sur place jusqu'à 45 minutes avant le départ de chaque course
            </p>
            <p>
              <br>
              <b>Téléchargements</b>
              <ul>
                <li><a href="/blocEditor/view/preview/uplds/Reglement_et_programme_2019.pdf" target="_blank">Règlement et programme</a></li>
                <li><a href="/blocEditor/view/preview/uplds/bulletin_inscription_2019.pdf" target="_blank">Bulletin d'inscription</a></li>
                <li><a href="/blocEditor/view/preview/uplds/Parcours_8KM.pdf" target="_blank">Parcours du 8,5km</a></li>
                <li><a href="/blocEditor/view/preview/uplds/Parcours_15KM.pdf" target="_blank">Parcours du 15km</a></li>
                <li><a href="/blocEditor/view/preview/uplds/Parcours_24KM.pdf" target="_blank">Parcours du 24km</a></li>
              </ul>
            </p>
          </div>
        </section>
      </div>

      <footer class="tm-container-outer row hermine_br">
        <p class="mb-0 col-6">
          <a href="https://www.facebook.com/courir.aplumelec.12" target="_blank" class="btn btn-info"><i class="fa fa-facebook-square"></i> Rejoignez nous sur facebook !</a>
        </p>
        <p class="mb-0 col-6">
          <img src="/blocEditor/view/preview/img/trail-plumelec/bodycross.png" height="50" style="flota:left;">
          <img src="/blocEditor/view/preview/trail-plumelec/img/logo-sobhi-sport.png" height="50" style="flota:left;">
        </p>
        <p class="mb-0 col-6">Copyright © <span class="tm-current-year"></span> Courir à Plumelec</p>
      </footer>
      <div id="uploadImageModal" class="modal fade">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Ajouter une image</h5>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
              <div class="row">
                <form id="myDropzone" action="/block/uploadImage" enctype="multipart/form-data" class="dropzone col-md-6" method="post"></form>
                <div class="col-md-6">
                  <select class="image-picker">
                    <?php
                    foreach (scandir('./blocEditor/asset/img') as $file) {
                      if ($file != "." && $file != "..") {
                        echo '<option data-img-src="/blocEditor/asset/img/' . $file . '" value="' . $file . '"></option>';
                      }
                    }
                    ?>
                  </select>
                </div>
              </div>
              <br />
              <div class="row">
                <div class="col">
                  <button id="dropzoneSubmit" class="btn btn-primary">Enregistrer</button>
                </div>
                <div class="col align-self-end">
                  <button id="selectImg" class="btn btn-info">Sélectionner</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> <!-- .main-content -->
  </div>
  <?php
      if($nav !== null && $userRole === 'ADMIN') 
      { echo '<button class="btn btn-primary">Modifier le site</button>' ;} 
  ?>
  <script>
    var pageId = <?php echo $page[0]->id; ?>;
  </script>
  <!-- load JS files -->
  <script src="/blocEditor/js/dependances/jquery-3.4.1.min.js"></script> <!-- jQuery (https://jquery.com/download/) -->
  <script src="/blocEditor/view/preview/js/popper.min.js"></script> <!-- https://popper.js.org/ -->
  <script src="/blocEditor/view/preview/js/bootstrap.min.js"></script> <!-- https://getbootstrap.com/ -->
  <script src="/blocEditor/view/preview/js/datepicker.min.js"></script> <!-- https://github.com/qodesmith/datepicker -->
  <script src="/blocEditor/view/preview/js/jquery.singlePageNav.min.js"></script> <!-- Single Page Nav (https://github.com/ChrisWojcik/single-page-nav) -->
  <script src="/blocEditor/js/dependances/owl.carousel.js"></script>
  <script src="/blocEditor/js/dependances/ekko-lightbox.min.js"></script>
  <script src="/blocEditor/js/blockInit.js"></script>
  <script src="/blocEditor/js/dependances/lightbox.min.js"></script>
  <script>
    /* DOM is ready
        ------------------------------------------------*/
    $(function() {
      // Change top navbar on scroll
      $(window).on("scroll", function() {
        if ($(window).scrollTop() > 100) {
          $(".tm-top-bar").addClass("active");
        } else {
          $(".tm-top-bar").removeClass("active");
        }
      });

      // Smooth scroll to search form
      $('.tm-down-arrow-link').click(function() {
        $.scrollTo('#tm-section-search', 300, {
          easing: 'linear'
        });
      });

      $('a.dropdown-item').on('click', function() {
        var $el = $(this);
        if ($el.length && $el.attr('href')) {
          if ($el.attr('target') == '_blank') {
            window.open($el.attr('href'));
          } else {
            location.href = $el.attr('href');
          }
        }
      });

      $('a.navbar-brand').on('click', function() {
        location.href = './';
      });

      // Update nav links on scroll
      $('#tm-top-bar').singlePageNav({
        currentClass: 'active',
        offset: 60
      });

      // Close navbar after clicked
      $('.nav-link').click(function() {
        $('#mainNav').removeClass('show');
      });

      $('.tm-current-year').text(new Date().getFullYear()); // Update year in copyright

    });
    <?php
    if ($nav === null) {
      echo "$('.dropdown-item').removeAttr('href')";
    } ?>
  </script>
  <script src="/blocEditor/js/dependances/dropzone.js"></script>
  <script src="/blocEditor/js/dependances/image-picker.js"></script>
  <script src="/blocEditor/js/dependances/lightbox.min.js"></script>
  <script src="/blocEditor/js/dependances/jquery-ui.js"></script>
  <script src="/blocEditor/js/blockInit.js"></script>
  <script src="/blocEditor/js/previewUI.js"></script>
  <script src="/blocEditor/js/pageEditUI.js"></script>
  <script src="/blocEditor/js/pageEditNew.js"></script>

</body>

</html>