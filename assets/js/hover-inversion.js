/**
 * Created by M on 1/12/18.
 */

var blockXSize;
var blockIncreaseInterval;
var headerHeight;
var blockYSize;
var blockX, blockXEnd, blockYEnd, shift;
var blockY = 0;

function reflectBar(e) {
  if( $(window).width() > mobileBp ) {
    blockX = e.pageX - blockXSize/2;
    if ( e.pageX - blockXSize/2 < headerHeight ) {
      $('body').css({cursor:'default'});
    } else {
      $('body').css({cursor: 'none'});
      shift = 2*blockX - $('#map').width()+blockXSize;
      blockXEnd = blockX+blockXSize;
      rect = 'rect('+blockY+'px,'+blockXEnd+'px,'+blockYEnd+'px,'+blockX+'px)';
      $('#map-copy').css({transform:'scaleX(-1)', clip: rect,left: shift,visibility:'visible'});
    }
  } else {
    $('#map-copy').css({visibility:'visible'});
    $('body').css({cursor:'default'});
  }
}

function mouseMove(e) {
  clearInterval(blockIncreaseInterval);
  prevX = e.pageX;
  blockXSize = 20;
  reflectBar(e);
}

function mouseDown(e) {
  blockIncreaseInterval = setInterval(increaseBlockSize, 5, e);
}

function increaseBlockSize(e) {
  blockXSize++;
  reflectBar(e);
}

function resetBlockSize(e) {
  clearInterval(blockIncreaseInterval);
  blockXSize = 20;
  reflectBar(e);
}

function init() {
  blockXSize = 20;
  headerHeight = $('.header').height();
  blockYSize = $('#map-copy').height();
  blockYEnd = blockY+blockYSize;
  rect = 'rect('+blockY+'px,'+blockXEnd+'px,'+blockYEnd+'px,'+blockX+'px)';
  $('#map-copy').css({clip: rect});
}

$(function() {
  init();
  $(document).mousemove(mouseMove);
  $(document).mousedown(mouseDown);
  $(document).mouseup(resetBlockSize);
  $(window).resize(init);
});
