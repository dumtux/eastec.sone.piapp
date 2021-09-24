var SaunaID = "foo_sauna";

var BaseUrl = 'http://localhost:8010/proxy/sauna/' + SaunaID;


function _getStatus() {
  
  fetch(BaseUrl + '/status')
  .then(response => response.json())
  .then(data => {
    configureStatus(data)
  })
  .catch((error) => {
    console.error('Error:', error);
  });

  fetch(BaseUrl + '/schedules')
  .then(response => response.json())
  .then(data => {
    configureSchedule(data)
  })
  .catch((error) => {
    console.error('Error:', error);
  });


}

function _setStatus(field, value) {

}

function _getSchecule() {

}


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
  $startHeat.addClass("d-none");
  $stopHeat.removeClass("d-none");
  $pauseHeat.addClass("d-none");
  $continueHeat.removeClass("d-none");
  $saunaControlPage.addClass("heat");
}

function continueHeat() {
  $startHeat.addClass("d-none");
  $stopHeat.removeClass("d-none");
  $continueHeat.addClass("d-none");
  $pauseHeat.removeClass("d-none");
  $saunaControlPage.addClass("heat");
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
        digit.offset({left: peakOffset.left - 10, top: peakOffset.top + 15});
      }

      setTimeout(function () {
          gaugeDigits.addClass('scale');
      }, 1)
      }
  }
}

$('.block-card .block-card-collapsed').on('click', function() {
  openCard($(this).parent());
});

function openCard(ele) {
  ele.find(".block-card-collapsed").addClass("d-none");
  ele.find(".block-card-expand").removeClass("d-none");
  if(ele.find(".block-card-expand .gauge").length) {
    drawDial("#" + ele.find(".block-card-expand .gauge").attr('id'));
  }
}

function closeCard(ele) {
  ele.find(".block-card-collapsed").removeClass("d-none");
  ele.find(".block-card-expand").addClass("d-none");
}

$('.program-title').on('click', function () {
  if($(this).hasClass('active'))
    $(this).removeClass('active');
  else
    $(this).addClass('active');
});

$('.program-title').on('hide.bs.collapse', function () {
  $(this).removeClass('active');
});

function configureStatus(status) {
  console.log(status);
  if(status.state == "standby") {
    stopHeat();
  } else if(status.state == "heat") {
    startHeat();
  } else if(status.state == "pause") {
    continueHeat();
  }

  $(".current_temperature").html(calcTemp(status.current_temperature));
  $(".target_temperature").html(calcTemp(status.set_temperature));
  $(".program_temperature").html(calcTemp(status.program.target_temperature));
  $("#temperature-dial").data("label", calcTemp(status.current_temperature));
  $("#temperature-dial").data("digit", status.current_temperature);
  

  $(".remaining_timer").html(calcTimer(status.remaining_timer));
  $(".program_timer").html(calcTimer(status.program.timer_duration));
  $("#time-dial").data("label", calcTimer(status.remaining_timer));
  $("#time-dial").data("digit", status.remaining_timer);

  if(status.lights[0]) {
    if(status.lights[0].state == "on") {
      $("#halo_light input").val(RGBToHex(status.lights[0].color.r, status.lights[0].color.g, status.lights[0].color.b));
      openCard($("#halo_light"));
    } else {
      closeCard($("#halo_light"));
    }
  }

  if(status.lights[1]) {
    if(status.lights[1].state == "on") {
      $("#halo_light input").val(RGBToHex(status.lights[0].color.r, status.lights[0].color.g, status.lights[0].color.b));
      openCard($("#halo_light"));
    } else {
      closeCard($("#halo_light"));
    }
  }

  $("#current_program .program-time > span").html(calcTimer(status.program.timer_duration));
  $("#current_program .program-temperature > span").html(calcTemp(status.program.target_temperature));
  
}

function configureSchedule(status) {
  console.log(status);
  var program_cnt = status.length;
  var content = `<div><h3 class="card-section-title">Program Lists</h3></div>`;
  for (i = 0;i<program_cnt;i++) {
    content += `<div class="program-card">
                  <div class="program-card-header">
                      <div class="program-time">
                          <img src="./assets/images/icons/time-color.png">
                          <span> ${calcTimer(status[i].program.timer_duration)} </span>
                      </div>
                      <div class="program-temperature">
                          <img src="./assets/images/icons/temperature-color.png">
                          <span> ${calcTemp(status[i].program.target_temperature)} </span>
                      </div>
                  </div>
                  <div class="program-card-body">
                      <h4 class="program-title" data-toggle="collapse" data-target="#program1">${status[i].program.name}</h4>
                      <div id="program1" class="program-detail collapse">
                          <ul>
                              <li>Frequency: ${status[i].frequency}</li> 
                              <li>User: ${status[i].user}</li>
                              <li>Sauna: ${status[i].sauna}</li>
                          </ul>
                          <button id="program_start" class="btn btn-primary">Start</button>
                      </div>
                  </div>
              </div>`;
  }
  $("#program_lists").html(content)
}

function configureApp() { 

  // drawDial("#temperature-dial", 100, [0, 25, 50, 75, 100]);
  // drawDial("#time-dial", 80, [0, 20, 40, 60, 80]);  
}

function calcTemp(temp) {
  return Math.round(temp) + "°C";
}

function calcTimer(timer) {

  if( timer <= 60)
    return timer + "s"
  
  var minutes = Math.floor(timer / 60);
  var seconds = timer - minutes * 60;

  return minutes + "m " + seconds + "s"
}

function RGBToHex(r,g,b) {
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}


$(document).ready(function(){
  _getStatus();
  setTimeout(function(){$("#loading").addClass("d-none");}, 1500);
});