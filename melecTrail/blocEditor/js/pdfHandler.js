$(document).ready(function() {
    var pdfDropzone = new Dropzone("#pdfDropZone", {
        url: "/block/uploadFile",
        paramName: "file",
        params: { jwt: getCookie('jwt')},
        autoProcessQueue: false,
        uploadMultiple: false,
        parallelUploads: 100,
        maxFilesize: 10,
        maxFiles: 6,
        acceptedFiles: ".pdf, .docx",
        addRemoveLinks: true,
        dictFileTooBig: "Le fichier est trop volumineux ({{filesize}}mb). La taille maximale est {{maxFilesize}}mb",
        dictInvalidFileType: "Type de fichier invalide",
        dictCancelUpload: "Annuler",
        dictRemoveFile: "Supprimer",
        dictMaxFilesExceeded: "Limite de fichier atteinte",
        dictDefaultMessage: "Déposez un fichier ici ou cliquez.",
        init: function() {
            var myDropzone = this;
            $("#pdfSubmit").on("click", function(e) {
                if (myDropzone.files != "") {
                    myDropzone.processQueue();
                } else {
                    $("#pdfDropZone").submit();
                }
            });
            this.on("error", function(file, response) {
                alert("Erreur lors de l'ajout, veuillez réessayer");
            });
            this.on("success", function(file, response) {
                console.log("uploaded");
                var opt = document.createElement("option");
                opt.setAttribute("value", response.target_file);
                var optName = document.createTextNode(response.target_file);
                opt.appendChild(optName);
                var filesSel = document.querySelector(".pdfFilesSel");
                filesSel.appendChild(opt);
            });
        }
    });
});
