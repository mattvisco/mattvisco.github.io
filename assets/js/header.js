/**
 * Created by M on 1/15/18.
 */

// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight;
var isMenuOpen = false;

setInterval(function() {
  if (didScroll) {
    hasScrolled();
    didScroll = false;
  }
}, 250);

function hasScrolled() {
  var st = $(this).scrollTop();

  // Make sure they scroll more than delta
  if(Math.abs(lastScrollTop - st) <= delta)
    return;

  // If they scrolled down and are past the navbar, add class .nav-up.
  // This is necessary so you never see what is "behind" the navbar.
  if (st > lastScrollTop && st > navbarHeight){
    // Scroll Down
    $('header').addClass('header__up');
  } else {
    // Scroll Up
    if(st + $(window).height() < $(document).height()) {
      $('header').removeClass('header__up');
    }
  }

  lastScrollTop = st;
}

function hover(element) {
  if(isMenuOpen) {
    element.setAttribute('src', '/assets/img/index/mobile-open_hover.png');
  } else {
    element.setAttribute('src', '/assets/img/index/mobile-close_hover.png');
  }
}

function unhover(element) {
  if(isMenuOpen) {
    element.setAttribute('src', '/assets/img/index/mobile-open_normal.png');
  } else {
    element.setAttribute('src', '/assets/img/index/mobile-close_normal.png');
  }
}

function toggleMobileMenu(element) {
  if ($(window).width() <= mobileBp) {
    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
      element.setAttribute('src', '/assets/img/index/mobile-open_normal.png'); // TODO: this may cause some interference with the hover stuff
      $('.header__container').show();
      $('body').addClass("modal-open");
    } else {
      element.setAttribute('src', '/assets/img/index/mobile-close_normal.png'); // TODO: this may cause some interference with the hover stuff
      $('.header__container').hide();
      $('body').removeClass("modal-open");
    }
  }
}

$(function() {
  navbarHeight = $('.header').height();

  // $(document).on('scroll',function(event){
  //   if ($(window).width() <= mobileBp) {
  //     didScroll = true;
  //   }
  // });

  $('.header__container').on('scroll',function(event){
      if ($(window).width() <= mobileBp) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
});
