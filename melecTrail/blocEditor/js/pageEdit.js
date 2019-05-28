/* Set the width of the side navigation to 250px */
function openNav() {
    document.querySelector(".blockMenu").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.querySelector(".blockMenu").style.width = "0";
}

let editor;

ClassicEditor.create(document.querySelector("#editor"))
    .then(newEditor => {
        editor = newEditor;
    })
    .catch(error => {
        console.error(error);
    });

// Assuming there is a <button id="submit">Submit</button> in your application.
document.querySelector("#blockSave").addEventListener("click", () => {
    var content = editor.getData();

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/block/addBlockToPage", true);
    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onreadystatechange = function() {
        // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log("enregistrement du bloc effectué");
        }
    };

    xhr.send(JSON.stringify({
        "name": "nomBloc",
        "content": content,
        "pageId": idCourse,
        "order": 1,
        "idBlockType": 1,
        "nombreCol": 1,
        "innerBlocks": ""
    }));
});
