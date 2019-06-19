$('#2colOption').on('click', function () {
    closeNav();
    var data = JSON.stringify({
        name: nomPage + "_" + idNewBlock,
        orderBlock: idNewBlock,
        pageId: pageId,
        idBlockType: '1'
    })
    console.log(data)
    saveBlock(data);
});

$('#3colOption').on('click', function () {
    closeNav();
    var data = JSON.stringify({
        name: nomPage + "_" + idNewBlock,
        orderBlock: idNewBlock,
        pageId: pageId,
        idBlockType: '2'
    })
    console.log(data)
    saveBlock(data);
    
})

function blockEditorInit(targetElement, operation, idBlockType, template) {
    var blockId = targetElement.getAttribute("id");
    targetElement.innerHTML = "";
    targetElement.innerHTML = template;
    targetElement.firstChild.setAttribute('id', blockId);
    targetElement.innerHTML = targetElement.innerHTML + '<div class="row"><div class="col"><a id="blockSave" class="btn btn-success" href="#">Sauvegarder le bloc</a><a class="btn btn-danger" id="blockDelete" href="#" role="button">Supprimer le bloc</a></div></div>';
    document.querySelector("#blockSave").addEventListener("click", () => {
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
                setTimeout(() => {
                    location.reload();
                }, 200);
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

$(document).ready(function () {
    // A MODIFIER //
    // previousBlocks.forEach(block => {
    //     if (block.innerBlocks != "") {
    //         innerTab = block.innerBlocks;
    //         Object.keys(innerTab).forEach(function (k) {
    //             var node = $('#' + innerTab[k]);
    //             var parent = $('#' + block.id + ' .block').children();
    //             if ($(node).children().first().next().prop('tagName') == "A" || $(node).children().first().next().hasClass("owl-carousel")) {
    //                 node[0].innerHTML = '<i class="float-right deleteFromCol fas fa-times"></i>' + node[0].innerHTML;
    //             }
    //             $(node).find("div").first().remove();
    //             parent[k - 1].innerHTML = node[0].outerHTML;
    //             node.remove();
    //         });
    //     }
    // })

    $(".block-unit-complex .block-unit").one("dblclick", function () {
        if ($(this).children().next().prop("tagName") == "A") {
            return;
        } else {
            htmlEditorInit(this, "update", this.innerHTML);
        }
    });



    $('.addBlockCol').on('click', function (event) {
        var idParent = $(this).closest('.block-unit-complex').attr('id');
        var idColumn = $(this).closest('.column').attr('id');
        $('#innerBlockModal').modal('show');
        $("#textBlock").on("click", function() {
            $("#innerBlockModal").modal("toggle");
            var idBlockParent = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute("id");
            var idCol = event.target.parentElement.parentElement;
            htmlEditorInit(event.target.parentElement.parentElement, "").then(function(editor) {
                $("#innerBlockModal").modal("toggle");
                var btnSave = document.getElementById("blockSave");
                btnSave.addEventListener("click", function() {
                    var data = {
                        name: nomPage + "_" + idNewBlock,
                        content: editor.getData(),
                        pageId: pageId,
                        orderBlock: idNewBlock,
                        idBlockType: 5,
                        idParent: idBlockParent,
                        idColumn: "",
                        styleBlock: ""
                    };
                    saveBlockIntoBlock(JSON.stringify(data)).then(function() {
                        location.reload();
                    });
                });
            });
        });
        $('#imgBlock').on('click', function () {
            $('#innerBlockModal').modal('toggle');
            $('#uploadImageModal').modal('show');
            $("#selectImg").off();
            $("#selectImg").on('click', function () {
                $('#uploadImageModal').modal('toggle');
                var data = JSON.stringify({
                    name: nomPage + "_" + idNewBlock,
                    content :  $('.image_picker_selector .selected img').attr('src'),
                    idParent : idParent,
                    idColumn : idColumn,
                    orderBlock: idNewBlock,
                    idBlockType: '4',
                    pageId: pageId
                })
                console.log(data)
                saveBlock(data);
            });
        })
        $('#carouselBlock').on('click', function () {
            $('#innerBlockModal').modal('toggle');
            $('#uploadImageModal').modal('show');
            $("select").attr('multiple', 'multiple');
            $("select").imagepicker();
            $('#selectImg').off();
            $("#selectImg").on('click', function () {
                $('#uploadImageModal').modal('toggle');
                var imgSrc = [];
                $('.image_picker_selector .selected img').each(function (index) {
                    imgSrc.push($(this).attr('src'));
                })
                var data = JSON.stringify({
                    name: nomPage + "_" + idNewBlock,
                    content :  imgSrc.join(" ; "),
                    idParent : idParent,
                    idColumn : idColumn,
                    orderBlock: idNewBlock,
                    idBlockType: '3',
                    pageId: pageId
                })
                saveBlock(data);
            })
        });
    });
})



