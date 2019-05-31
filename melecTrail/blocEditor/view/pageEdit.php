<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

    <title>Edition</title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src="https://cdn.ckeditor.com/ckeditor5/12.1.0/classic/ckeditor.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.5.1/dropzone.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.0/css/lightbox.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/image-picker/0.3.1/image-picker.css" />
    <link rel="stylesheet" href="/blocEditor/style/pageEditStyle.css">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
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
                </div>
            </div>
        </div>
        <div class="blocks-viewer">
            <?php
            if ($blocks != NULL) {
                foreach ($blocks as $block) {
                    echo '
                    <div id="' . $block['id'] . '" class="block-unit">
                    <div><i id="orderUp' . $block['id'] . '" i class="fas fa-arrow-up"></i>   <i id="orderDown' . $block['id'] . '"class="fas fa-arrow-down"></i></div>
                            ' . $block['content'].'</div>';
                        if($block['idBlockType'] == 2){
                            echo '<button class="btn btn-xs btn-info resizebtn">Redimensionner</button>';
                            
                        }
                }
            }
            ?>
        </div>
        <div class="row">
            <div class="col">
                <div class="interface-block">

                </div>
            </div>
        </div>
        <a id="pagePreview" class="btn btn-info" href="/page/previewPage/<?php echo $page[0]->name; ?>">Prévisualiser</a>
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
                                foreach (scandir('./blocEditor/img') as $file) {
                                    if ($file != "." && $file != "..") {
                                        echo '<option data-img-src="/blocEditor/img/' . $file . '" value="' . $file . '"></option>';
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

    <script>
        var pageId = <?php echo $page[0]->id ?>;
        var idNewBlock = <?php echo count($blocks); ?> + 1;
        var nomPage = "<?php echo $page[0]->name; ?>";
        var previousBlocks = <?php echo json_encode($blocks); ?>;
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.5.1/dropzone.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/image-picker/0.3.1/image-picker.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.0/js/lightbox.min.js"></script>
    <script src="https://unpkg.com/interactjs/dist/interact.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script src="/blocEditor/js/pageEdit.js"></script>
</body>

</html>