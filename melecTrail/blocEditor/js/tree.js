$(document).on('click', '#setPageTree', function () {
    $("#treeModal").modal('show');
});

$('#addPage').click(function () {
    $('.page').append("<div class='form-row'><div class='col'><input type='number' class='form-control' name='id' placeholder='id de la page' id='pageid' required /></div><div class='col'><input type='text' class='form-control' name='name' placeholder='nom de la page' id='pagename' required /></div><div class='col'><input type='text' class='form-control' name='parent' placeholder='nom de la page parente' id='parentname' required /></div></div>");
})

$('#tree_form').on('submit', function () {
    var treeForm = $(this);
    var form_data = JSON.stringify(treeForm.serializeObject());
    $.ajax({
        url: "page/setTree",
        type: "POST",
        contentType: 'application/json',
        data: form_data,
        success: function (result) {
            console.log(result);
            window.location.reload();
        },
        error: function (xhr, resp, text) {
            console.log(resp);
        }
    })
})

//Fonction de sérialisation 
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$('#pageTree a').on('click', function () {
    if (confirm('Modifier la page ' + $(this).attr('id') + ' ?')){
        window.location.href="/page/editPage/"+$(this).attr('id');
    };
})
