//Div où s'affichent tous les blocs
var previewDisplay = document.getElementById("previewDisplay");

//ID de tous les blocs contenus dans des colonnes d'un autre bloc
var blockNoDisplay = [];

//Création d'une div pour chaque block et affichage du block dans la zone de preview
blocks.forEach(block => {
    var blockUnit = document.createElement("div");
    blockUnit.setAttribute("id", block.id);
    blockUnit.innerHTML = block.content;
    previewDisplay.appendChild(blockUnit);
});

//Lorsque le doc est généré, replacement des blocks dans les colonnes.
$(document).ready(function() {
    blocks.forEach(block => {
        //blocks contenant des colonnes retrouvés
        if (block.innerBlocks != "") {
            var innerTab = JSON.parse(block.innerBlocks);
            //Elements HTML colonnes du block courrant
            var cols = document.getElementById(block.id).childNodes[0].childNodes;
            Object.keys(innerTab).forEach(function(k) {
                var node = document.getElementById(innerTab[k]);
                cols.forEach(col => {
                    if (col.getAttribute("id") == k) {
                        col.innerHTML = node.innerHTML;
                    }
                });
                node.parentElement.removeChild(node);
            });
        }
    });
});

window.addEventListener("load", function() {
    if (document.querySelector(".owl-carousel") != null) {
        setTimeout(function() {
            startCarousel();
        }, 200);
    }
    // Show the carousel's edition button
    $(".sliderEdit").on("click", function() {
        $(this).toggle();
        $(this)
            .next()
            .show();
        $(this)
            .siblings(".contentSlider")
            .show();
    });
});

// Set the basic configuration for the carousel slider
function startCarousel() {
    var slider = document.querySelectorAll(".owl-carousel");
    slider.forEach(carousel => {
        $(carousel).owlCarousel({
            center: true,
            loop: true,
            margin: 10,
            slideSpeed: 300,
            paginationSpeed: 400,
            autoplay: true,
            autoplayHoverPause: true,
            items: 1,
            animateIn: "fadeIn",
            animateOut: "fadeOut",
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1
                    // nav:true
                },
                600: {
                    items: 1,
                    nav: true
                },
                1000: {
                    items: 1,
                    nav: true
                    // loop:false
                }
            },
            navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>']
        });
    });
}
