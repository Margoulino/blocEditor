var block2ColsButton = document.getElementById("2colOption");

block2ColsButton.addEventListener("click", function() {
    getTemplate2cols(interfaceBlock);
    closeNav();
    interfaceBlock.scrollIntoView({
        behavior: "smooth",
        block: 'start'
    });
});

function getTemplate2cols(element) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            element.innerHTML = JSON.parse(xhr.response).html;
            element.innerHTML += '<div class="row"><div class="col"><a id="block2ColsSave" class="btn btn-success" href="#">Sauvegarder le bloc</a><a class="btn btn-danger" id="block2ColsDelete" href="#" role="button">Supprimer le bloc</a></div></div>';
            document.getElementById("block2ColsSave").addEventListener("click", function() {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "/block/addBlockToPage", true);
                xhr.onreadystatechange = function () {
                    // Call a function when the state changes.
                    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                        location.reload();
                    }
                };
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(
                    JSON.stringify({
                        name: nomPage + "_" + idNewBlock,
                        content: "",
                        pageId: pageId,
                        orderBlock: idNewBlock,
                        idBlockType: 3,
                        nombreCol: 1,
                        innerBlocks: ""
                    })
                );
            });
            document.getElementById("col1").addEventListener("dblclick", function() {
                htmlEditorInit(this, "save", "");
            });
            document.getElementById("col2").addEventListener("dblclick", function() {
                htmlEditorInit(this, "save", "");
            })
        }
    };
    xhr.open("POST", "/blockType/loadTemplate");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify({name: "2cols"}));
}

