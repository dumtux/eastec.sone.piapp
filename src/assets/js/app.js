
var $tabs = $('#bottomMenubar .bottomMenuItem');
var previousPage = 0;

function showPage(pageId) {
  var $pageToHide = $("#mainContainer").find('div.content-page').filter('.is-active'), $pageToShow = $(pageId);

  $pageToHide.removeClass('is-active').addClass('is-animating is-exiting');
  $pageToShow.addClass('is-animating is-active');

  $pageToShow.on('transitionend webkitTransitionEnd', function() {
    $pageToHide.removeClass('is-animating is-exiting');
    $pageToShow.removeClass('is-animating').off('transitionend webkitTransitionEnd');
  });
}

$tabs.on('click', function() {
    $tabs.removeClass("active");
    $(this).addClass("active");
    showPage($(this).data("target"));
});


var $saunaControlPage = $("#saunaControlPage");
var $startHeat = $('#btnHeatStart'), $stopHeat = $('#btnHeatFinish'), $pauseHeat = $('#btnHeatPause'), $continueHeat = $('#btnHeatContinue');

function startHeat() {
  $startHeat.addClass("d-none");
  $stopHeat.removeClass("d-none");
  $continueHeat.removeClass("d-none");
  $saunaControlPage.addClass("heat");
}

function stopHeat() {
  $stopHeat.addClass("d-none");
  $pauseHeat.addClass("d-none");
  $continueHeat.addClass("d-none");
  $startHeat.removeClass("d-none");
  $saunaControlPage.removeClass("heat");
}

function pauseHeat() {
  $pauseHeat.addClass("d-none");
  $continueHeat.removeClass("d-none");
}

function continueHeat() {
  $continueHeat.addClass("d-none");
  $pauseHeat.removeClass("d-none");
}