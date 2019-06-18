$(document).ready(function () {$('.column').each(function () {
   if ($(this).children().length == 0) {
      this.innerHTML = '<div class="text-center" style="padding-top: 1.5em;"><button class="btn btn-xs btn-outline-info addBlockCol"><i class="fas fa-plus"></i></button></div>';
   }
}); var slider = document.querySelectorAll('.owl-carousel');
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
            animateIn: 'fadeIn', // add this
            animateOut: 'fadeOut', // and this
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
        })
    });});