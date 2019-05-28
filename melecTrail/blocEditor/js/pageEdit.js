var blockTextButton = document.getElementById("textOption");
var interfaceBlock = document.querySelector(".interface-block");

blockTextButton.addEventListener("click", function() {
    interfaceBlock.innerHTML =
        '<div class="card"><div class="card-body"><div class="row"><div class="col"><textarea name="content" id="editor"></textarea></div></div><div class="row"><div class="col"><a id="blockSave" class="btn btn-success" href="#">Sauvegarder le bloc</a></div></div></div></div>';
    let editor;

    ClassicEditor.create(document.querySelector("#editor"))
        .then(newEditor => {
            editor = newEditor;
        })
        .catch(error => {
            console.error(error);
        });

    document.querySelector("#blockSave").addEventListener("click", () => {
        var content = editor.getData();

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/block/addBlockToPage", true);
        xhr.setRequestHeader("Content-type", "application/json");

        xhr.onreadystatechange = function() {
            // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                console.log("enregistrement du bloc effectué");
                location.reload();
            }
        };

        xhr.send(
            JSON.stringify({
                name: "nomBloc",
                content: content,
                pageId: pageId,
                orderBlock: idNewBlock,
                idBlockType: 1,
                nombreCol: 1,
                innerBlocks: ""
            })
        );
    });
});

/* Set the width of the side navigation to 250px */
function openNav() {
    document.querySelector(".blockMenu").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.querySelector(".blockMenu").style.width = "0";
}
