$('#2colOption').on('click', function () {
    closeNav();
    $.ajax({
        url: "/blockType/loadTemplate",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ "name": "twoColumns" }),
        success: function (result) {
            var intBlock = document.querySelector('.interface-block');
            var result = JSON.parse(result);
            blockEditorInit(intBlock, "save", null, result.html);
        },
        error: function (xhr, resp, text) {
            if (xhr.status == 409) {
                window.alert("Cette catégorie existe déjà veuillez spécifier un autre nom.");
            } else {
                window.alert("Erreur lors de l'ajout, veuillez réessayer.")
            } cat_form.find('input').val('');
        }
    });
    return false;
});

function blockEditorInit(targetElement, operation, previousContent, template) {
    var blockId = targetElement.getAttribute("id");
    targetElement.innerHTML = "";
    targetElement.innerHTML = template;
    targetElement.firstChild.setAttribute('id', blockId);
    targetElement.innerHTML = targetElement.innerHTML + '<div class="row"><div class="col"><a id="blockSave" class="btn btn-success" href="#">Sauvegarder le bloc</a><a class="btn btn-danger" id="blockDelete" href="#" role="button">Supprimer le bloc</a></div></div>';
    document.querySelector("#blockSave").addEventListener("click", () => {
        console.log("rentré");
        $(targetElement).find('.row').last().remove();
        var content = targetElement.innerHTML;
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                console.log("enregistrement du bloc effectué");
                location.reload();
            }
        };

        if (operation === "save") {
            xhr.open("POST", "/block/addBlockToPage", true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(
                JSON.stringify({
                    name: nomPage + "_" + idNewBlock,
                    content: content,
                    pageId: pageId,
                    orderBlock: idNewBlock,
                    idBlockType: 1,
                    nombreCol: 1,
                    innerBlocks: ""
                })
            );
        } else if (operation === "update") {
            var currentBlock = "";
            previousBlocks.forEach(block => {
                if (blockId == block.id) {
                    currentBlock = block;
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

$(document).ready(function () {
    $('.column').each(function () {
        if ($(this).children().length == 0) {
            this.innerHTML = '<div class="text-center" style="padding-top: 1.5em;"><button class="btn btn-xs btn-outline-info addBlockCol"><i class="fas fa-plus"></i></button></div>';
        } else {
            console.log("1");
        }
    })
    $('.addBlockCol').on('click', function () {
        //$(this).parent().parent().addClass('interface-block');
        openNav();
    });

    $.each(previousBlocks, function (index, value) {
        if(value.innerBlocks.length > 0){
            value.innerBlocks.forEach(element => {
                var inner = document.querySelector('#'+element);
                var outer = document.querySelector('#'+value.id);
            });
            var inner = document.querySelector('#');
        }
    });
});



