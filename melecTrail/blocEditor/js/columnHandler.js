$('#2colOption').on('click', function () {
    closeNav();
    template = '<div class="row block"><div class="column col" id="1"></div><div class="column col" id="2"></div></div>';
    blockEditorInit(document.querySelector('.interface-block'), "save", 3, template);
});

$('#3colOption').on('click', function() {
    closeNav();
    template = '<div class="row block"><div class="column col" id="1"></div><div class="column col" id="2"></div><div class="column col" id="3"></div></div>';
    blockEditorInit(document.querySelector('.interface-block'), "save", 5, template);
})

function blockEditorInit(targetElement, operation, idBlockType, template) {
    var blockId = targetElement.getAttribute("id");
    targetElement.innerHTML = "";
    targetElement.innerHTML = template;
    targetElement.firstChild.setAttribute('id', blockId);
    targetElement.innerHTML = targetElement.innerHTML + '<div class="row"><div class="col"><a id="blockSave" class="btn btn-success" href="#">Sauvegarder le bloc</a><a class="btn btn-danger" id="blockDelete" href="#" role="button">Supprimer le bloc</a></div></div>';
    // if (operation === "resizeSlider") {
    //     $(targetElement).find('img').resizable();
    // }
    document.querySelector("#blockSave").addEventListener("click", () => {
        // if (operation === "resizeSlider") { 
        //     $(targetElement).find('img').resizable('destroy'); 
        //     operation = "update"; 
        //     $(targetElement).find('.owl-carousel').owlCarousel('destroy');
        //     $(targetElement).find('button').remove();
        //     $(targetElement).children().first().remove();
        // }
        console.log(targetElement.innerHTML);
        $(targetElement).find('.row').last().remove();
        var content = targetElement.innerHTML;
        
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                console.log("enregistrement du bloc effectué");
                if (operation == "addToCol") {
                    var result = JSON.parse(xhr.response);
                    columnEdit($(targetElement).parent().parent().attr('id'), $(targetElement).attr('id'), result.id);
                }
                location.reload();
            }
        };
        if (operation === "save" || operation === "addToCol") {
            xhr.open("POST", "/block/addBlockToPage", true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(
                JSON.stringify({
                    name: nomPage + "_" + idNewBlock,
                    content: content,
                    pageId: pageId,
                    orderBlock: idNewBlock,
                    idBlockType: idBlockType,
                    nombreCol: 1,
                    innerBlocks: ""
                })
            );
        } else if (operation === "update") {
            previousBlocks.forEach(block => {
                if (blockId == block.id) {
                    xhr.open("POST", "/block/updateBlock", true);
                    xhr.setRequestHeader("Content-type", "application/json");
                    xhr.send(
                        JSON.stringify({
                            id: blockId,
                            name: block.name,
                            content: content,
                            pageId: pageId,
                            orderBlock: block.orderBlock,
                            idBlockType: block.idBlockType,
                            nombreCol: block.nombreCol,
                            innerBlocks: block.innerBlocks
                        })
                    );
                }
            });
        }
    })
};

function columnEdit(colBlockId, colPosition, toAddId) {
    $.ajax({
        url: "/block/addBlockToColumn",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify({
            "toAddId": toAddId,
            "colPosition": colPosition,
            "id": colBlockId
        }),
        success: function (result) {
            console.log("Colonne éditée avec succès.");
        },
        error: function (xhr, resp, text) {
            window.alert("Erreur lors de la modification.");
        }
    });
}

$(document).ready(function () {
    previousBlocks.forEach(block => {
        if (block.innerBlocks != "") {
            innerTab = JSON.parse(block.innerBlocks);
            Object.keys(innerTab).forEach(function (k) {
                var node = $('#' + innerTab[k]);
                var parent = $('#' + block.id + ' .block').children();
                if ($(node).children().first().next().prop('tagName') == "A") {
                    node[0].innerHTML = '<i class="float-right deleteImgFromCol fas fa-times"></i>' + node[0].innerHTML;
                }
                $(node).find("div").first().remove();
                parent[k - 1].innerHTML = node[0].outerHTML;
                node.remove();
            });
        }
    })
    $('.deleteImgFromCol').on('click', function () {
        if (confirm("Confirmer la suppression du bloc ?")) {
            $.ajax({
                url: "/block/deleteFromCol",
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify({ "idParent": $(this).closest('.block-unit-complex').attr('id'), "idChild": $(this).parent().attr('id') }),
                success: function (result) {
                    console.log("image supprimée");
                },
                error: function (xhr, resp, text) {
                    window.alert("Erreur lors de la modification.");
                }
            });
            deleteBlock($(this).parent());
        }
    })
    $(".block-unit-complex .block-unit").one("dblclick", function () {
        if ($(this).children().next().prop("tagName") == "A") {
            return;
        } else {
            htmlEditorInit(this, "update", this.innerHTML);
        }
    });

    $('.resizebtn').on('click', function () {
        $(this).toggle();
        editImgBlock(this.parentElement, "update", this.parentElement.innerHTML);
    })
    $('.column').each(function () {
        if ($(this).children().length == 0) {
            this.innerHTML = '<div class="text-center" style="padding-top: 1.5em;"><button class="btn btn-xs btn-outline-info addBlockCol"><i class="fas fa-plus"></i></button></div>';
        }
    })

    $('.addBlockCol').on('click', function () {
        $(this).parent().parent().addClass('edited-col');
        $('#innerBlockModal').modal('show');
        $('#textBlock').on('click', function () {
            htmlEditorInit(document.querySelector('.edited-col'), "addToCol", '');
            $('#innerBlockModal').modal('toggle');
        })
        $('#imgBlock').on('click', function () {
            $('#innerBlockModal').modal('toggle');
            $('#uploadImageModal').modal('show');
            $("#selectImg").off();
            $("#selectImg").on('click', function () {
                editImgBlock(document.querySelector('.edited-col'), "addToCol", '')
                $('#uploadImageModal').modal('toggle');
            });

        })
        $('#carouselBlock').on('click', function () {
            $('#innerBlockModal').modal('toggle');
            initCarousel(document.querySelector('.edited-col'), "addToCol");
        })
    });
});




