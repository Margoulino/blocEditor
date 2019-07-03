$("#2colOption").on("click", function() {
    closeNav();
    var data = JSON.stringify({
        name: nomPage + "_" + idNewBlock,
        orderBlock: idNewBlock,
        pageId: pageId,
        idBlockType: "1"
    });
    saveBlock(data).then(function() {
        location.reload();
    });
});

$("#3colOption").on("click", function() {
    closeNav();
    var data = JSON.stringify({
        name: nomPage + "_" + idNewBlock,
        orderBlock: idNewBlock,
        pageId: pageId,
        idBlockType: "2"
    });
    saveBlock(data).then(function() {
        location.reload();
    });
});

function getInnerHTMLCol(elem) {
    return new Promise(function(resolve, reject) {
        if (elem !== undefined) {
            resolve(elem.innerHTML);
        } else {
            reject();
        }
    });
}

$(document).ready(function() {
    $(".addBlockCol").on("click", function(event) {
        var idParent = $(this)
            .closest(".block-unit-complex")
            .attr("id");
        var idColumn = $(this)
            .closest(".column")
            .attr("id");
        var idBlockParent = event.currentTarget.parentElement.parentElement.parentElement.parentElement.getAttribute("id");
        var blockParent = findBlockById(idBlockParent, previousBlocks);
        $("#innerBlockModal").modal("show");
        $("#textBlock").one("click", function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $("#innerBlockModal").modal("toggle");
            var idCol = event.currentTarget.parentElement.parentElement.getAttribute("id");
            htmlEditorInit(event.currentTarget.parentElement.parentElement, "").then(function(editor) {
                $("#innerBlockModal").modal("toggle");
                var btnSave = document.getElementById("blockSave");
                var btnDel = document.getElementById("blockDelete");
                btnSave.addEventListener("click", function() {
                    var data = {
                        name: nomPage + "_" + idNewBlock,
                        content: editor.getData(),
                        pageId: pageId,
                        orderBlock: null,
                        idBlockType: 5,
                        idParent: idBlockParent,
                        idColumn: idCol,
                        styleBlock: ""
                    };
                    if (subLevels[blockParent.idBlockType] > parentCounter(blockParent.id, previousBlocks)) {
                        saveBlockIntoBlock(JSON.stringify(data)).then(function() {
                            location.reload();
                        });
                    } else {
                        alert("Ajout impossible, ce bloc se situe à un sous niveau trop élevé");
                    }
                });
                btnDel.addEventListener("click", function() {
                    location.reload();
                });
            });
        });
        $("#imgBlock").one("click", function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $("#innerBlockModal").modal("toggle");
            $("#uploadImageModal").modal("show");
            $("#selectImg").off();
            $("#selectImg").on("click", function() {
                $("#uploadImageModal").modal("toggle");
                var data = JSON.stringify({
                    name: nomPage + "_" + idNewBlock,
                    content: $(".image_picker_selector .selected img").attr("src"),
                    idParent: idParent,
                    idColumn: idColumn,
                    orderBlock: null,
                    idBlockType: "4",
                    pageId: pageId
                });
                if (subLevels[blockParent.idBlockType] > parentCounter(blockParent.id, previousBlocks)) {
                    saveBlock(data).then(function() {
                        location.reload();
                    });
                } else {
                    alert("Ajout impossible, ce bloc se situe à un sous niveau trop élevé");
                }
            });
        });

        $("#carouselBlock").one("click", function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $("#innerBlockModal").modal("toggle");
            $("#uploadImageModal").modal("show");
            $("select").attr("multiple", "multiple");
            $("select").imagepicker();
            $("#selectImg").off();
            $("#selectImg").on("click", function() {
                $("#uploadImageModal").modal("toggle");
                var imgSrc = [];
                $(".image_picker_selector .selected img").each(function(index) {
                    imgSrc.push($(this).attr("src"));
                });
                var data = JSON.stringify({
                    name: nomPage + "_" + idNewBlock,
                    content: imgSrc.join(" ; "),
                    idParent: idParent,
                    idColumn: idColumn,
                    orderBlock: null,
                    idBlockType: "3",
                    pageId: pageId
                });
                if (subLevels[blockParent.idBlockType] > parentCounter(blockParent.id, previousBlocks)) {
                    saveBlock(data).then(function() {
                        location.reload();
                    });
                } else {
                    alert("Ajout impossible, ce bloc se situe à un sous niveau trop élevé");
                }
            });
        });
        $("#galleryBlock").one("click", function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $("#innerBlockModal").modal("toggle");
            $("#uploadImageModal").modal("show");
            $("select").attr("multiple", "multiple");
            $("select").imagepicker();
            $("#selectImg").off();
            $("#selectImg").on("click", function() {
                $("#uploadImageModal").modal("toggle");
                var imgSrc = [];
                $(".image_picker_selector .selected img").each(function(index) {
                    imgSrc.push($(this).attr("src"));
                });
                var data = JSON.stringify({
                    name: nomPage + "_" + idNewBlock,
                    content: imgSrc.join(" ; "),
                    idParent: idParent,
                    idColumn: idColumn,
                    orderBlock: null,
                    idBlockType: "6",
                    pageId: pageId
                });
                if (subLevels[blockParent.idBlockType] > parentCounter(blockParent.id, previousBlocks)) {
                    saveBlock(data).then(function() {
                        location.reload();
                    });
                } else {
                    alert("Ajout impossible, ce bloc se situe à un sous niveau trop élevé");
                }
            });
        });
        $("#2ColBlock").one("click", function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $("#innerBlockModal").modal("toggle");
            var data = JSON.stringify({
                name: nomPage + "_" + idNewBlock,
                idParent: idParent,
                idColumn: idColumn,
                orderBlock: null,
                idBlockType: "1",
                pageId: pageId
            });
            if (subLevels[blockParent.idBlockType] > parentCounter(blockParent.id, previousBlocks)+1) {
                saveBlock(data).then(function() {
                    location.reload();
                });
            } else {
                alert("Ajout impossible, ce bloc se situe à un sous niveau trop élevé");
            }
        });
        $("#3ColBlock").one("click", function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $("#innerBlockModal").modal("toggle");
            var data = JSON.stringify({
                name: nomPage + "_" + idNewBlock,
                idParent: idParent,
                idColumn: idColumn,
                orderBlock: null,
                idBlockType: "2",
                pageId: pageId
            });
            if (subLevels[blockParent.idBlockType] > parentCounter(blockParent.id, previousBlocks)+1) {
                saveBlock(data).then(function() {
                    location.reload();
                });
            } else {
                alert("Ajout impossible, ce bloc se situe à un sous niveau trop élevé");
            }
        });
    });
});
