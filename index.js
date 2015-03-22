var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.writeHead(301,
    {Location: 'https://wakatime.com/slack'}
  );
  res.end();
});

http.listen(80, function() {
  console.log('listening on *:80.');
});

io.on('connection', function(socket){
  console.log('a user connected.');
});
