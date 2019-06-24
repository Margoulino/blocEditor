<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

    <title>Edition</title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">
    <link rel="stylesheet" href="/blocEditor/style/pageEditStyle.css">
    <link rel="stylesheet" href="/templatemo-style.css">
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
    <br clear="all">
    <br />
    <div id="pageView">
        <div class="row">
            <div class="col-4">
                <div class="list-group" id="list-tab" role="tablist">
                    <?php
                    $keys = array_keys($sortedViews);
                    foreach ($keys as $catname) {
                        echo '<a class="list-group-item list-group-item-action" id="' . $catname . '" data-toggle="list" href="#list-' . $catname . '" role="tab" aria-controls="' . $catname . '"><div class="d-inline-flex p-2">' . $catname . '</div><button class="btn btn-xs deleteCat btn-outline-danger"><span class="iconify" data-icon="wpf:delete" data-inline="false"></span></button></a>';
                    }
                    ?>
                </div>
            </div>
            <!-- <i class="float-right fa-lg fas fa-times-circle"></i> -->
            <div class="col-8">
                <div class="tab-content" id="nav-tabContent">
                    <?php
                    $keys = array_keys($sortedViews);
                    foreach ($keys as $cat) {
                        echo '<div class="tab-pane fade" id="list-' . $cat . '" role="tabpanel" aria-labelledby="' . $cat . '"><ul class="' . $cat . '">';
                        foreach ($sortedViews[$cat] as $view) {
                            echo '<li><a id="' . $view . '" href="#"> ' . $view . '   </a><i class="fas fa-times fa-sm deletePage" id="' . $view . '"></i></li>';
                        }
                        echo '</ul><br /><button class="btn btn-outline-secondary addPage" id="' . $cat . '"><i class="fas fa-plus"></i> Ajouter une page</button></div>';
                    }
                    ?>
                </div>
            </div>
        </div>
        <br />
        <button class="btn btn-light addCat"><i class="fas fa-plus"></i> Ajouter une catégorie</button>
    </div>
    <div id="addPageModal" class="modal fade">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ajouter une page</h5>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id='tree_form'>
                        <div class="page">
                            <div class="form-row">
                                <div class="col">
                                    <input type="text" class="form-control" name="name" placeholder="nom de la page" id="pagename" required />
                                    <input type="hidden" id="catnameinput" name="category" value="" />
                                </div>
                            </div>
                        </div><br />
                        <button type='submit' class='btn btn-primary' id="saveTree">Enregistrer</button>
                        <i class="fas fa-spinner fa-spin" style="display: none"></i>
                    </form>
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
                        <button type='submit' class='btn btn-primary' id="saveCat">Enregistrer</button>
                        <i class="fas fa-spinner fa-spin" style="display: none"></i>
                    </form>
                </div>
            </div>
        </div>
    </div>


    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src="https://code.iconify.design/1/1.0.2/iconify.min.js"></script>
    <script src="/blocEditor/js/indexPages.js"></script>
</body>

</html>