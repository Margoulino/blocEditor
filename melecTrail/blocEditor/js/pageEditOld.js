function saveBlock(content, blockId, blockType, idParent) {
    $.ajax({
        url: "/block/addBlockToPage",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify({
            "name": nomPage + "_" + blockId,
            "content": content,
            "orderBlock": blockId,
            "pageId": pageId,
            "idBlockType": blockType,
            "idParent": idParent
        }),
        success: function (result) {
            console.log(result);
        },
        error: function (xhr, resp, text) {
            console.log(xhr);
        }
    });
}

function deleteBlock(blockId) {
    $.ajax({
        url: "/block/deleteBlock",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify({
            "id": blockId,
        }),
        success: function (result) {
            console.log(result);
        },
        error: function (xhr, resp, text) {
            console.log(xhr);
        }
    });
}

function loadBlockType() {
    let types = null;
    $.ajax({
        url: "/blockType/loadSource",
        type: "GET",
        success: function (result) {
            types = JSON.parse(result)
            console.log(types);
        },
        error: function (xhr, resp, text) {
            console.log(xhr);
        }
    });

    Object.keys(types).forEach(function (k) {
        previousBlock.forEach(b => {
            if(b.idBlockType === types[k].id){
                
            }
        });

    
    })