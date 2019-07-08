<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8" />
    <meta name="description" content="<?php echo $page[0]->description; ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

    <title>Edition</title>

    <link rel="stylesheet" href="/blocEditor/style/dependances/bootstrap.min.css" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css">
    <link rel="stylesheet" href="/blocEditor/style/dependances/dropzone.css" />
    <link rel="stylesheet" href="/blocEditor/style/dependances/lightbox.min.css" />
    <link rel="stylesheet" href="/blocEditor/style/dependances/image-picker.css" />
    <link rel="stylesheet" href="/blocEditor/style/dependances/owl.carousel.min.css" />
    <link rel="stylesheet" href="/blocEditor/style/dependances/owl.theme.default.min.css" />
    <link rel="stylesheet" href="/blocEditor/style/dependances/ekko-lightbox.css" />
    <link rel="stylesheet" href="/blocEditor/style/dependances/jquery-ui.css">
    <link rel="stylesheet" href="/templatemo-style.css">
    <link rel="stylesheet" href="/custom.css">
    <link rel="stylesheet" href="/blocEditor/style/pageEditStyle.css">
</head>

<body>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <a class="navbar-brand pagename" href="#">Edition de page</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav mr-auto">
                <a class="nav-item nav-link" href="/page/" id='setPageTree'>Structure du site</a>
                <a class="nav-item nav-link" href="/" id='gotoWebsite'>Accéder au site</a>
                <a class="nav-item nav-link" onclick="openNav();" href="#" id='menuBlock'>Menu des blocs</a>
            </div>
        </div>
    </nav>
    <br>
    <div class="container-fluid">
        <div class="blockMenu">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-1 offset-7">
                        <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
                    </div>
                </div>
                <div class="row">
                    <p id="textOption" class="col menuOptions"><i class="fas fa-align-left menuIcons"></i></p>
                    <p id="imgOption" class="col menuOptions"><i class="fas fa-image menuIcons"></i></p>
                    <p id="2colOption" class="col menuOptions"><span class="iconify menuIcons" data-icon="feather:columns" data-inline="false"></span></p>
                    <p id="3colOption" class="col menuOptions"><span class="iconify menuIcons" data-icon="fe:columns" data-inline="false"></span></p>
                    <p id="sliderOption" class="col menuOptions"><span class="iconify menuIcons" data-icon="ic:outline-view-carousel" data-inline="false"></span></p>
                    <p id="galleryOption" class="col menuOptions" style="margin-bottom: 10px !important;"><i class="fas fa-images menuIcons"></i></p>
                </div>
            </div>
        </div>
        <?php
        //if ($categoriesPage != NULL) {
        echo '<div class="alert alert-info categ-container">Catégories : ';
        foreach ($categoriesPage as $categPage) {
            foreach ($allCategories as $definedCateg) {
                if ($categPage->idCategory == $definedCateg->id) {
                    echo '<a class="btn btn-success categPage" href="#">' . $definedCateg->name . ' <span id="' . $categPage->idCategory . '"class="badge badge-danger removeCateg"> <i class="fas fa-times" style="color:white;"></i></span></a>';
                }
            }
        }
        echo '  <div class="dropdown dropCateg">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="addCategDrop" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Choix catégorie
                    </button>
                    <div class="dropdown-menu" aria-labelledby="addCategDrop">';
        foreach ($allCategories as $categ) {
            echo '          <a id="' . $categ->id . '" class="dropdown-item categChoice" href="#">' . $categ->name . '</a>';
        }
        echo '          <div class="dropdown-divider"></div>
                        <a class="dropdown-item" id="addCategoryDrop" href="#">Ajout nouvelle catégorie</a>
                    </div>
                </div>
            </div>';
        //}
        ?>
        <div class="blocks-viewer">
            <?php
            if ($blocks != NULL) {
                foreach ($blocks as $block) {
                    if ($block->idParent === null || $block->idParent === "0") {
                        if ($block->idBlockType === '5' || $block->idBlockType === '4') {
                            echo '<div id="' . $block->id . '" class="block-unit">';
                            echo '<button class="btn-xs btn btn-danger deleteBlock float-right"><i class="float-right fas fa-times"></i></button><div><i id="orderUp' . $block->id . '" i class="fas fa-arrow-up"></i>   <i id="orderDown' . $block->id . '" class="fas fa-arrow-down"></i></div>';
                            echo str_replace(array('{$block->content}', '{$block->style}'), array($block->content, $block->styleBlock), $categHTML[$block->idBlockType]);
                            if ($block->idBlockType === '4') {
                                echo '<button class="btn btn-xs btn-info resizebtn"><i class="fas fa-expand-arrows-alt"></i></button>';
                            }
                            if ($block->idBlockType === '5') {
                                echo '<button class="btn-xs btn btn-info editBlock float-right"><i class="fas fa-edit"></i></button>';
                            }
                        } else {
                            echo '<div id="' . $block->id . '" class="block-unit-complex">';
                            echo '<i class="float-right deleteBlock fas fa-times"></i><div><i id="orderUp' . $block->id . '" i class="fas fa-arrow-up"></i>   <i id="orderDown' . $block->id . '"class="fas fa-arrow-down"></i></div>';
                            echo $block->content;
                        }
                        if ($block->idBlockType === '3' || $block->idBlockType === '6') {
                            echo '<button class="btn btn-outline-info contentSlider">Ajouter/Supprimer une image</button>';
                        }
                        echo '</div>';
                    }
                }
            }
            ?>
        </div>

        <div class="row">
            <div class="col interface-block">
            </div>
        </div>
        <hr>
        <h4>Référencement</h4>
        <div class="row">
            <div class="col">
                <p>Description de la page :</p>
                <div class="form-group">
                    <textarea class="form-control" id="description" rows="2"><?php echo $page[0]->description; ?></textarea>
                </div>
                <a id="descriptionSave" class="btn btn-info btn-sm" href="#">Enregistrer la description</a>
            </div>
        </div>
        <br>
        <div class="row">
            <div class="col">
                <p>Mots clés :</p>
                <div class="alert alert-info keywords-container">
                    <?php
                        $keywords = json_decode($page[0]->keywords);
                        if($keywords !== null) {
                            foreach($keywords as $keyword) {
                                echo '
                                    <a class="btn btn-success btn-sm keyword" href="#">
                                        <span>' . $keyword . '</span>
                                        <span class="badge badge-danger removeKeyword">
                                            <i class="fas fa-times" style="color:white;"></i>
                                        </span>
                                    </a>
                                ';
                            }
                        }
                    ?>
                    <a href="#" class="btn btn-success btn-sm addKeyword"><i class="fas fa-plus" style="color:white;"></i></a>
                </div>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col">
                <a id="pagePreview" class="btn btn-info" href="/page/previewPage/<?php echo $page[0]->name; ?>">Prévisualiser</a>
                <?php
                if ($page[0]->public == 0) {
                    echo '<a id="pagePublish" class="btn btn-success" href="">Publier</a>';
                } else {
                    echo '<a id="pageDepublish" class="btn btn-danger" href="">Dépublier</a>';
                }
                ?>
            </div>
        </div>
    </div>

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


    <div class="modal fade" tabindex="-1" role="dialog" id="innerBlockModal">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ajouter un block</h5>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <button id="textBlock" class="col btn btn-info menuOptions"><i class="fas fa-align-left fa-5x"></i></button>
                        <button id="imgBlock" class="col btn btn-info menuOptions"><i class="fas fa-image fa-5x"></i></button>
                        <button id="galleryBlock" class="col btn btn-info menuOptions"><i class="fas fa-5x fa-images"></i></button>
                        <button id="2ColBlock" class="col btn btn-info menuOptions"><span class="iconify menuIcons" data-icon="feather:columns" data-inline="false"></span></button>
                        <button id="3ColBlock" class="col btn btn-info menuOptions"><span class="iconify menuIcons" data-icon="fe:columns" data-inline="false"></span></button>
                        <button id="carouselBlock" class="col btn btn-info menuOptions"><span class="iconify menuIcons" data-icon="ic:outline-view-carousel" data-inline="false"></span></button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" tabindex="-1" role="dialog" id="newKeywordModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ajout d'un mot clé</h5>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col">
                            <input id="kwName" class="form-control" type="text" placeholder="Nom du mot clé">
                            <br />
                            <button class='btn btn-primary' id="saveNewKeyword">Enregistrer</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="addCategoryModal" class="modal fade">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ajouter une catégorie</h5>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id='cat_form'>
                        <div class="form-row">
                            <div class="col">
                                <input type="text" class="form-control" name="name" placeholder="nom de la catégorie" id="catname" required />
                            </div>
                        </div>
                        <br />
                        <a class='btn btn-primary' id="saveCat">Enregistrer</a>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script>
        var pageId = <?php echo $page[0]->id ?> ;
        var pageStatus = <?php echo $page[0]->public ?> ;
        var idNewBlock = <?php echo count($blocks); ?> +1;
        var nomPage = "<?php echo $page[0]->name; ?>";
        var previousBlocks = <?php echo json_encode($blocks); ?> ;
        var templateHTML = <?php echo json_encode($categHTML); ?> ;
        var allCateg = <?php echo json_encode($allCategories); ?> ;
        var subLevels = <?php echo json_encode($subLevel); ?> ;
    </script>
    <script src="/blocEditor/js/dependances/jquery-3.4.1.min.js"></script>
    <script src="/blocEditor/js/dependances/popper.min.js"></script>
    <script src="/blocEditor/js/dependances/bootstrap.min.js"></script>
    <script src="/blocEditor/js/ckeditor.js"></script>
    <script src="/blocEditor/js/dependances/dropzone.js"></script>
    <script src="/blocEditor/js/dependances/image-picker.js"></script>
    <script src="/blocEditor/js/dependances/lightbox.min.js"></script>
    <script src="/blocEditor/js/dependances/interact.min.js"></script>
    <script src="/blocEditor/js/dependances/jquery-ui.js"></script>
    <script src="/blocEditor/js/dependances/iconify.min.js"></script>
    <script src="/blocEditor/js/dependances/owl.carousel.js"></script>
    <script src="/blocEditor/js/dependances/ekko-lightbox.min.js"></script>
    <script src="/blocEditor/js/blockInit.js"></script>
    <script src="/blocEditor/ckfinder/ckfinder.js"></script>
    <script src="/blocEditor/js/pageEditNew.js"></script>
    <script src="/blocEditor/js/pageEditUI.js"></script>
    <script src="/blocEditor/js/columnHandler.js"></script>
    <script src="/blocEditor/js/imageHandlerNew.js"></script>
</body>

</html>