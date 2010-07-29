var ws = require(__dirname + '/node-websocket-server/lib/ws'),
    server = ws.createServer();

console.log('created server');

server.addListener("connection", function(conn){
  console.log('connection');

  conn.addListener("message", function(message){
    message = JSON.parse(message);
    message['id'] = conn.id
    conn.broadcast(JSON.stringify(message));
  });
});

server.addListener("close", function(conn){
  conn.broadcast(JSON.stringify({'id': conn.id, 'action': 'close'}));
});

server.listen(8000);

console.log('listening on port 8000');

