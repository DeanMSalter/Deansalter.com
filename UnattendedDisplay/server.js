//########## Dependencies
const express = require('express');
const https = require('https');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const baller = require('./baller');
const fs = require('fs');
const app = express();

const options = {
  key: fs.readFileSync('SSL/deansalter.key'),
  cert: fs.readFileSync('SSL/www.deansalter.com.crt')
};

//########## Server set up

//Set up a http server to listen to port 5000 ,
//this will redirect to https so no need to assign it to anything, it just needs to listen using app
http.createServer(app).listen(5000);
const server = https.createServer(options, app).listen(5001);

//Using the https server , set up the sockets that will communicate with clients
const io = socketIO(server);

//Set up the routes for the sockets , allowing the client to communicate
const tagDefense = io.of("/TagDefense")
const tagDefenseDesktop = io.of("/TagDefenseDesktop")
const tagDesktop = io.of("/tagDesktop")
const tagMobile = io.of("/tagMobile")
const messages = io.of("/messages")

//########## functions

//Redirects user to https if they are using http , also changes port as cant have 2 servers
//on the same port.
function redirectHTTPS(request,response){
  if(!request.secure){
    console.log("insecure")
    response.redirect("https://" + (request.headers.host).split(":")[0] +":5001" + request.url);
  }
}


//########## Server routes
app.get('/', function(request, response) {
  app.use(express.static('.'))
  response.sendFile(path.join(__dirname, 'index.html'));
  redirectHTTPS(request,response)
});
app.get('/tagDefense', function(request, response) {
  app.use(express.static('TagDefense'))
  response.sendFile(path.join(__dirname, 'TagDefense/index.html'));
  redirectHTTPS(request,response)
});
app.get('/tagDefenseDesktop', function(request, response) {
  app.use(express.static('TagDefenseDesktop'))
  response.sendFile(path.join(__dirname, 'TagDefenseDesktop/index.html'));
  redirectHTTPS(request,response)
});
app.get('/tag', function(request, response) {
  app.use(express.static('Tag'))
  response.sendFile(path.join(__dirname, 'Tag/index.html'));
  redirectHTTPS(request,response)
});
app.get('/tagDisplayMobile', function(request, response) {
  app.use(express.static('Tag'))
  response.sendFile(path.join(__dirname, 'Tag/displayOnly.html'));
  redirectHTTPS(request,response)
});
app.get('/tagDesktop', function(request, response) {
  app.use(express.static('TagDesktop'))
  response.sendFile(path.join(__dirname, 'TagDesktop/index.html'));
  redirectHTTPS(request,response)
});
app.get('/tagDisplayDesktop', function(request, response) {
  app.use(express.static('TagDesktop'))
  response.sendFile(path.join(__dirname, 'TagDesktop/displayOnly.html'));
  redirectHTTPS(request,response)
});
app.use('*/Messages',express.static('Messages'));
app.use('*/Messages/settings',express.static('MessagesSettings'));
app.use('*/Messages/submission',express.static('MessagesSubmission'));
app.use('*/Messages/buildings',express.static('MessagesBuildingSubmission'));
// app.get('/Messages', function(request, response) {
//   app.use(express.static('Messages'))
//   response.sendFile(path.join(__dirname, 'Messages/index.html'));
//   redirectHTTPS(request,response)
// });
// app.get('/Messages/settings', function(request, response) {
//   app.use(express.static('MessagesSettings'))
//   response.sendFile(path.join(__dirname, 'MessagesSettings/index.html'));
//   redirectHTTPS(request,response)
// });

//########## exterior server file set up

//assigns a variable as the file containing the server settings for that specific page
//and also passes it the socket route required for that server
//the socket then emits the functions contained within that server file.

//Therefore any calls to that socket will be handled by the functions within the respective files

//This is purely to keep the code easier to maintain and partioned
let tagDesktopServer = require('./tagDesktopServer.js')(tagDesktop)
tagDesktop.emit(tagDesktopServer)

let tagMobileServer = require('./tagMobileServer.js')(tagMobile)
tagMobile.emit(tagMobileServer)

let tagDefenseDesktopServer = require('./tagDefenseDesktopServer.js')(tagDefenseDesktop)
tagDefenseDesktop.emit(tagDefenseDesktopServer)

let tagDefenseMobileServer = require('./tagDefenseMobileServer.js')(tagDefense)
tagDefense.emit(tagDefenseMobileServer)

let messagesServer = require('./messagesServer.js')(messages)
messages.emit(messagesServer)
