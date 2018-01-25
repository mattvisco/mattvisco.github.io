/**
 * Created by M on 1/12/18.
 */
var currActiveClass;

function hideElements(currentFilter) {
  var elementsToHide = [];
  var elementsToShow = [];
  $('.work__container-element').each(function(){
    var hide = true;
    var classNames = $(this).attr("class").toString().split(' ');
    classNames.forEach(function(name) {
      if (name == currentFilter) {
        hide = false;
      }
    })
    if (hide == true) {
      elementsToHide.push(this);
    } else {
      elementsToShow.push(this);
    }
  })
  elementsToHide.forEach(function(element) {
    $(element).css({visibility: 'hidden'});
  });
  elementsToShow.forEach(function(element) {
    $(element).css({visibility: 'visible'});
  });
}

function showAll() {
  $('.work__container-element').each(function(){
    $(this).css({visibility: 'visible'});
  });
}

$(function() {

  currActiveClass = $('.work__filter-active');

  $('.work__filter').click(function() {
    $(currActiveClass).removeClass('work__filter-active');
    currActiveClass = this;
    $(this).addClass('work__filter-active');
    if (this.id == 'all') {
      showAll();
    } else if (this.id == 'physical') {
      hideElements('work__physical');
    } else if (this.id == 'digital') {
      hideElements('work__digital');
    }
  });

  $(window).resize(function() {
    if ($(window).width() <= mobileBp) {
      showAll();
    }

    // TODO: make the correct filter trigger again or switch to 'all' on transition
  });

});
