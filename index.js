var app = require('express')();
var bodyParser = require('body-parser');
var fs = require('fs');
var http = require('http');
var https = require('https');
var multer = require('multer');
var querystring = require('querystring');
var random = require('random-js')();
var request = require('request');
var secrets = require('./secrets');

var server = http.createServer(app);
var options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
};
var server_ssl = https.createServer(options, app);
var io = require('socket.io')(server_ssl);

var USERS = {};

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

function postSlackMessage(data) {
    var headers = {
      'User-Agent': 'WakaTime Chat/0.0.1',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    data.token = secrets.slack_token;
    var options = {
      method: 'POST',
      url: 'https://slack.com/api/chat.postMessage',
      headers: headers,
      form: data,
    };

    request(options, function (error, response, body) {
        if (error) {
          console.log(response.statusCode);
          console.log(body);
        }
    });
}

io.on('connection', function(socket) {
  socket.id = random.string(6);
  USERS[socket.id] = socket;
  console.log(socket.id + ' has connected.');

  socket.on('join', function(data) {
    socket.username = data.username;
    console.log(socket.username + '(' + socket.id + ') has joined.');
    postSlackMessage({
      'channel': secrets.slack_channel,
      'text': socket.username + '(' + socket.id + ') has joined.',
      'username': 'WakaTime',
      'icon_url': 'https://wakatime.com/static/img/wakatime-48.png',
    });
  });

  socket.on('disconnect', function() {
    delete USERS[socket.id];
    console.log(socket.username + '(' + socket.id + ') has left.');
    postSlackMessage({
      'channel': secrets.slack_channel,
      'text': socket.username + '(' + socket.id + ') has left.',
      'username': 'WakaTime',
      'icon_url': 'https://wakatime.com/static/img/wakatime-48.png',
    });
  });

  socket.on('message', function(data) {
    var text = socket.username + '(' + socket.id + '): ' + data.text;
    postSlackMessage({
      'channel': secrets.slack_channel,
      'text': text,
      'username': 'WakaTime',
      'icon_url': 'https://wakatime.com/static/img/wakatime-48.png',
    });
  });
});

app.get('/', function(req, res) {
  res.writeHead(302,
    {Location: 'https://wakatime.com/slack'}
  );
  res.end();
});

app.post('/webhooks/slack', function(req, res) {
  if (req.body['token'] === secrets.command_token) {
    var id;
    var text = req.body['text'];
    if (text) {
      id = text.split(' ')[0];
      text = text.slice(id.length + 1);
    }
    if (id && USERS[id]) {
      var data = {
        sender: {
          name: 'alan',
          avatar: 'https://secure.gravatar.com/avatar/5bbde3a573d9012842f5fd261caa0bfe?s=150&d=identicon',
        },
        text: text,
      };
      USERS[id].emit('message', data);
      res.status(201).send(JSON.stringify({status: 'sent', text: text}));
    } else {
      res.status(400).send(JSON.stringify({error: 'user is offline.'}));
    }
  } else {
    res.status(403).send(JSON.stringify({error: 'invalid token.'}));
  }
});

server.listen(secrets.http_port, function() {
  console.log('listening on *:'+secrets.http_port+'.');
});
server_ssl.listen(secrets.https_port, function() {
  console.log('listening on *:'+secrets.https_port+'.');
});
