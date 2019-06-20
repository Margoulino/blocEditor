$('#2colOption').on('click', function () {
    closeNav();
    var data = JSON.stringify({
        name: nomPage + "_" + idNewBlock,
        orderBlock: idNewBlock,
        pageId: pageId,
        idBlockType: '1'
    })
    saveBlock(data).then(function(){location.reload();});
});

$('#3colOption').on('click', function () {
    closeNav();
    var data = JSON.stringify({
        name: nomPage + "_" + idNewBlock,
        orderBlock: idNewBlock,
        pageId: pageId,
        idBlockType: '2'
    })
    saveBlock(data).then(function(){location.reload();});
})

function getInnerHTMLCol(elem) {
    return new Promise(function(resolve, reject) {
        if(elem !== undefined) {
            resolve(elem.innerHTML);
        } else {
            reject();
        }
    });
}

$(document).ready(function () {

    $('.addBlockCol').on('click', function (event) {
        var idParent = $(this).closest('.block-unit-complex').attr('id');
        var idColumn = $(this).closest('.column').attr('id');
        $('#innerBlockModal').modal('show');
        $("#textBlock").on("click", function() {
            $("#innerBlockModal").modal("toggle");
            var idBlockParent = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute("id");
            var idCol = event.target.parentElement.parentElement.getAttribute("id");
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
                        idColumn: idCol,
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
                saveBlock(data).then(function(){location.reload();});
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
                saveBlock(data).then(function(){location.reload();});
            })
        });
        $('#2ColBlock').on('click', function () {
            $('#innerBlockModal').modal('toggle');
            var data = JSON.stringify({
                name : nomPage + "_" + idNewBlock,
                idParent : idParent,
                idColumn : idColumn,
                orderBlock : idNewBlock,
                idBlockType : '1',
                pageId : pageId
            })
            saveBlock(data).then(function(){location.reload();});
        })
        $('#3ColBlock').on('click', function () {
            $('#innerBlockModal').modal('toggle');
            var data = JSON.stringify({
                name : nomPage + "_" + idNewBlock,
                idParent : idParent,
                idColumn : idColumn,
                orderBlock : idNewBlock,
                idBlockType : '2',
                pageId : pageId
            })
            saveBlock(data).then(function(){location.reload();});
        })
    });
})



