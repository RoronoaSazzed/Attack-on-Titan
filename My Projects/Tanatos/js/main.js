//Jquery starts here


$(document).ready(function () {

  //Check to see if the window is top if not then display button
$(window).scroll(function() {
    if ($(this).scrollTop() < 100 || $(this).scrollTop() > $(document).height() - $(window).height()) {
        $('.scrollToTop').fadeOut();
    } else {
        $('.scrollToTop').fadeIn();
    }
});

//Click event to scroll to top
$('.scrollToTop').click(function() {
    $('html, body').animate({
        scrollTop: 0
    }, 800);
    return false;
});


});





