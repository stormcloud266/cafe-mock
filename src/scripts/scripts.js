function menuToggle(toggled) {
  $('.menu__nav ul li').removeClass('active');
  $('.menu__section').removeClass('visible');
  $('#' + toggled.target.classList[0]).addClass('visible');
  $(toggled.target).addClass('active');
};

$('.menu__nav ul li').click((e) => {
  menuToggle(e);
});


$(document).on('click', 'a[href^="#"]', function(e) {
    const id = $(this).attr('href');
    if ($(id).length === 0) {
        return;
    }
    e.preventDefault();
    const elTop = $(id).offset().top;
    $('body, html').animate({scrollTop: elTop});
});
