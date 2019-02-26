//########## Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const baller = require('./baller');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const tagDefense = io.of("/TagDefense")
const tagDefenseDesktop = io.of("/TagDefenseDesktop")
const tagDesktop = io.of("/tagDesktop")
const tagMobile = io.of("/tagMobile")
//########## Server set up
app.set('port', 5000);
app.use(express.static('.'))
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

app.get('/tagDefense', function(request, response) {
  app.use(express.static('TagDefense'))
  response.sendFile(path.join(__dirname, 'TagDefense/index.html'));
});
app.get('/tagDefenseDesktop', function(request, response) {
  app.use(express.static('TagDefenseDesktop'))
  response.sendFile(path.join(__dirname, 'TagDefenseDesktop/index.html'));
});
app.get('/tag', function(request, response) {
  app.use(express.static('Tag'))
  response.sendFile(path.join(__dirname, 'Tag/index.html'));
});
app.get('/tagDisplayMobile', function(request, response) {
  app.use(express.static('Tag'))
  response.sendFile(path.join(__dirname, 'Tag/displayOnly.html'));
});
app.get('/tagDesktop', function(request, response) {
  app.use(express.static('TagDesktop'))
  response.sendFile(path.join(__dirname, 'TagDesktop/index.html'));
});
app.get('/tagDisplayDesktop', function(request, response) {
  app.use(express.static('TagDesktop'))
  response.sendFile(path.join(__dirname, 'TagDesktop/displayOnly.html'));
});

let tagDesktopServer = require('./tagDesktopServer.js')(tagDesktop)
tagDesktop.emit(tagDesktopServer)

let tagMobileServer = require('./tagMobileServer.js')(tagMobile)
tagMobile.emit(tagMobileServer)

let tagDefenseDesktopServer = require('./tagDefenseDesktopServer.js')(tagDefenseDesktop)
tagDefenseDesktop.emit(tagDefenseDesktopServer)

let tagDefenseMobileServer = require('./tagDefenseMobileServer.js')(tagDefense)
tagDefense.emit(tagDefenseMobileServer)
