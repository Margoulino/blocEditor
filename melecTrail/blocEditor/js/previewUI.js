document.addEventListener("DOMContentLoaded", function() {
    //Suppression des boutons ajoutés via le js dans les blocks, au chargement de la page
    var blocks = document.querySelectorAll(".block-unit, .block-unit-complex");
    blocks.forEach(block => {
        var childrenBlock = [].slice.call(block.children);
        childrenBlock.forEach(child => {
            if (child.nodeName === "BUTTON") {
                child.parentElement.removeChild(child);
            }
        });
    });

    //Suppression des lignes {col...} qui apparaissent dans les colonnes des blocks colonne
    var columns = document.querySelectorAll(".row.block");
    columns.forEach(col => {
        var colChildren = [].slice.call(col.children);
        colChildren.forEach(colChild => {
            if (/^{col/.test(colChild.innerHTML.trim())) {
                colChild.innerHTML = "";
            }
        });
    });
    //Suppression des boutons "+" des colonnes vides des blocs colonnes
    var divBtn = document.querySelectorAll(".text-center");
    divBtn.forEach(divB => {
        divB.parentElement.removeChild(divB);
    });
});

function publishPage(id) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve();
            } else if (this.status === 404) {
                reject(JSON.parse(xhr.response).message);
            }
        };
        var data = {
            pageId: id
        }
        xhr.open("POST", "/page/publishPage/");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(data));
    });
}

function depublishPage(id) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve();
            } else if (this.status === 400) {
                reject(JSON.parse(xhr.response).message);
            }
        };
        var data = {
            pageId: id
        }
        xhr.open("POST", "/page/depublishPage/");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(data));
    });
}

var publishBtn = document.getElementById("pagePublish");
if (publishBtn !== undefined && publishBtn !== null) {
    publishBtn.addEventListener("click", function() {
        if (confirm("Êtes-vous sûr de vouloir publier cette page ?")) {
            publishPage(pageId).then(function() {
                location.reload();
            });
        }
    });
}

var depublishBtn = document.getElementById("pageDepublish");
if (depublishBtn !== undefined && depublishBtn !== null) {
    depublishBtn.addEventListener("click", function() {
        if (confirm("Êtes-vous sûr de vouloir dépublier cette page ?")) {
            depublishPage(pageId).then(function() {
                location.reload();
            });
        }
    });
}
