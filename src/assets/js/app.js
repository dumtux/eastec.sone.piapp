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

function drawDial(eleId) {
  let type = $(eleId + '.gauge').data('type'); //temperature, time
  let points = 43;
  let radius = 257;
  let max = 0;
  let peaks = [0];

  if(type == "temperature") {
    max = 100; peaks = [0, 25, 50, 75, 100];
  } else if(type == "time") {
    max = 80; peaks = [0, 20, 40, 60, 80];
  }

  let step = (max + 1) / points;
  let realPeaks = peaks.map(peak => Math.floor(peak * (1 / step)));
  let hueStep = 120 / points;

  let gaugeDigits = $(eleId + ' .gauge-digits');

  let digit = $(eleId + '.gauge').data('digit');
  let labelTxt = $(eleId + '.gauge').data('label');
  gaugeDigits.prepend(`<span class="digit current-digit count">${labelTxt}</span>`);

  for (let i = 0; i < points; i++) {
    let degree = i * (radius / (points - 1)) - radius / 2;
    let isPeak = realPeaks.indexOf(i) > -1;

    let intStep = Math.ceil(step * i);
    let intNextStep = Math.ceil(step * (i + 1));

    // let styles = `transition-delay: ${ (i / digit) * (i / digit) + 1 }s;`;
    let inner_styles = `transform: rotate(${degree}deg);`;
    let outer_styles = '';
    if (intStep <= digit) {
      // styles += `background-color: hsl(${240 + i * hueStep}, 92%, 64%);`;
      if(type == 'temperature') {
        outer_styles += `background-color: #EFAB46;`;
        inner_styles += `background-color: #EFAB46;`;
      } else if(type == 'time') {
        outer_styles += `background-color: #7CB7B7;`;
        inner_styles += `background-color: #7CB7B7;`;
      }
    }

    if (intStep > digit || (intStep <= digit && intNextStep <= digit)) {
      outer_styles += `-webkit-transform: rotate(${degree}deg);
      -moz-transform: rotate(${degree}deg);
      -ms-transform: rotate(${degree}deg);
      -o-transform: rotate(${degree}deg);
      transform: rotate(${degree}deg);`;
    } else {
        if (intNextStep > digit)
          outer_styles += `
          -webkit-transform: rotate(${degree}deg) translateY(-.1em);
          -moz-transform: rotate(${degree}deg) translateY(-.1em);
          -ms-transform: rotate(${degree}deg) translateY(-.1em);
          -o-transform: rotate(${degree}deg) translateY(-.1em);
          transform: rotate(${degree}deg) translateY(-.1em);
          height: 0.8em;`;
    }


    $(eleId + ' .gauge-outer').append(`<i class="bar" style="${outer_styles}"></i>`);
    let gaugeInner = $(eleId + ' .gauge-inner').append(`<i class="bar${isPeak ? ' peak' : ''}" style="${inner_styles}"></i>`);

    if (isPeak) {
      let digit = $(`<span class="digit">${peaks[realPeaks.indexOf(i)]}</span>`);
      let peakOffset = gaugeInner.find('.peak').last().offset();

      gaugeDigits.append(digit);

      if (degree > -5 && degree < 5) {
          digit.offset({left: peakOffset.left - 5, top: peakOffset});
      } else {
        console.log(peakOffset)
        digit.offset({left: peakOffset.left - 10, top: peakOffset.top + 15});
      }

      setTimeout(function () {
          gaugeDigits.addClass('scale');
      }, 1)
      }
  }
}

function init() {
  drawDial("#temperature-dial", 100, [0, 25, 50, 75, 100]);
  drawDial("#time-dial", 80, [0, 20, 40, 60, 80]);
}

$('.block-card .block-card-collapsed').on('click', function() {
  $(this).addClass("d-none");
  $(this).parent().find(".block-card-expand").removeClass("d-none");
  if($(this).parent().find(".block-card-expand .gauge").length) {
    drawDial("#" + $(this).parent().find(".block-card-expand .gauge").attr('id'));
  }
});

$('.program-title').on('click', function () {
  if($(this).hasClass('active'))
    $(this).removeClass('active');
  else
    $(this).addClass('active');
});

$('.program-title').on('hide.bs.collapse', function () {
  $(this).removeClass('active');
});

$(document).ready(function(){
  // init();
});