var CANVAS_OK = '#00CC66';
var CANVAS_KO = '#FA5858';
var CANVAS_WR = '#F4FA58';

var CANVAS_STR_OK = 'OK';
var CANVAS_STR_KO = 'CRITICAL';
var CANVAS_STR_WR = 'WARNING';

//Connection Status
window.onload = function() {
  var online = window.navigator.onLine;
  if (!online) {
    fatal('Conecte el dispositivo a una red con datos');
  }

  debug('Conectado: ' + online);
  Pusher.register(handleEvents);
};

document.getElementById('pushbtn').addEventListener('click', function() {
  Pusher.sendPush(function(res, error) {
    if (error) {
      updateASResponse(error);
    } else {
      updateASResponse('AS response = ' + JSON.stringify(res));
    }    
  });
});

function handleEvents(evt, data) {
  debug('handleEvents: ' + evt + ' - ' + JSON.stringify(data));
  switch(evt) {
    case 'registered':
      playBeep();
      updateEndpoint(data);
      fill_canvas('pns_status', CANVAS_OK, CANVAS_STR_OK);
      break;

    case 'error':
      debug('Error registering endpoint --> ' + JSON.stringify(data));
      beep('KO', JSON.stringify(data));
      break;

    case 'push':
      showNotification('PushTester new version', 'version = ' +
        data.version);
      updateLastNotificationReceivedTime();
      updateVersion(data.version);
      break;

    case 'push-register':
      break;
  }
}

// UI Management

function updateLastNotificationReceivedTime() {
  document.getElementById('lastNotificationRecvTime').textContent =
    new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
}

function updateVersion(version) {
  document.getElementById('lastVersionRecv').textContent = version;
}

function updateEndpoint(token) {
  document.getElementById('endpointURL').textContent = token;
}

function updateASResponse(msg) {
  document.getElementById('lastASResponse').textContent = msg;
}

function updateNextScheduledCheck(time) {
  document.getElementById('nextScheduledCheck').textContent = time;
}

//Poner cuadrado status con color y msg. Nueva func no hace falta msj, hará
function fill_canvas(id, color, string) {
  var c = document.getElementById(id);
  var ctx = c.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(5, 5, 210, 100);
  ctx.fillStyle = 'white';
  ctx.font = '30px FiraSans';
  ctx.fillText(string, 77, 45);
}
