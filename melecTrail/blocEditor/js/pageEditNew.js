function saveBlock(content, blockId, blockType, idParent) {
    $.ajax({
        url: "/block/addBlockToPage",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            name: nomPage + "_" + blockId,
            content: content,
            orderBlock: blockId,
            pageId: pageId,
            idBlockType: blockType,
            idParent: idParent
        }),
        success: function(result) {
            console.log(result);
        },
        error: function(xhr, resp, text) {
            console.log(xhr);
        }
    });
}

function deleteBlock(blockId) {
    $.ajax({
        url: "/block/deleteBlock",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            id: blockId
        }),
        success: function(result) {
            //console.log(result);
            location.reload();
        },
        error: function(xhr, resp, text) {
            console.log(xhr);
        }
    });
}

function loadBlockType() {
    let types = null;
    $.ajax({
        url: "/blockType/loadSource",
        type: "GET",
        success: function(result) {
            types = JSON.parse(result);
            console.log(types);
        },
        error: function(xhr, resp, text) {
            console.log(xhr);
        }
    });

    Object.keys(types).forEach(function(k) {
        previousBlock.forEach(b => {
            if (b.idBlockType === types[k].id) {
            }
        });
    });
}

//--------------------------------------------------------------
function loadTemplateData(blockTypeId, callbackFunc, templates) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            callbackFunc(xhr.response, templates, blockTypeId);
        }
    };

    xhr.open("POST", "/blockType/loadTemplate", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(
        JSON.stringify({
            id: blockTypeId
        })
    );
}

function callbackTemplate(data, templates, id) {
    templates["html"+id] = JSON.parse(data).html.replace(/\\/g, "");
    templates["js"+id] = JSON.parse(data).js;
}
//--------------------------------------------------------------

function saveBlockIntoPage(nomPage, content, pageId, idNewBlock, idBlockType, styleBlock) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            location.reload();
        }
    };
    xhr.open("POST", "/block/addBlockToPage", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(
        JSON.stringify({
            name: nomPage + "_" + idNewBlock,
            content: content,
            pageId: pageId,
            orderBlock: idNewBlock,
            idBlockType: idBlockType,
            styleBlock: styleBlock
        })
    );
}

function saveBlockIntoBlock(nomPage, content, pageId, idNewBlock, idBlockType, idParent, idColumn, styleBlock) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            location.reload();
        }
    };
    xhr.open("POST", "/block/addBlockToBlock", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(
        JSON.stringify({
            name: nomPage + "_" + idNewBlock,
            content: content,
            pageId: pageId,
            orderBlock: idNewBlock,
            idBlockType: idBlockType,
            idParent: idParent,
            idColumn: idColumn,
            styleBlock: styleBlock
        })
    );
}

function updateBlock(id, name, content, pageId, orderBlock, idBlockType, idParent, idColumn, styleBlock) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            location.reload();
        }
    }
    xhr.open("POST", "/block/updateBlock", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(
        JSON.stringify({
            id: id,
            name: name,
            content: content,
            pageId: pageId,
            orderBlock: orderBlock, 
            idBlockType: idBlockType,
            idParent: idParent,
            idColumn: idColumn,
            styleBlock: styleBlock
        })
    );
}