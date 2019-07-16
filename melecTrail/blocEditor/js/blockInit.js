$(document).ready(function () {$('.column').each(function () {
   if ($(this).children().length == 0) {
      this.innerHTML = '<div class="text-center" style="padding-top: 1.5em;"><button class="btn btn-xs btn-outline-info addBlockCol"><i class="fas fa-plus"></i></button></div>';
   }
});      $(document).on('click', '[data-toggle="lightbox"]', function (event) {
        event.preventDefault();console.log("ekko");
        $(this).ekkoLightbox();
      });});