//########## Dependencies
const express = require('express');
const https = require('https');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const fs = require('fs');
const request = require('request');
const mysql = require('mysql2/promise');
const config = require('./config');
const globalConnection = mysql.createConnection(config.mysql);
const app = express();

const options = {
  key: fs.readFileSync('SSL/deansalter.key'),
  cert: fs.readFileSync('SSL/www.deansalter.com.crt')
};

//########## Server set up

//Set up a http server to listen to port 5000 ,
//this will redirect to https so no need to assign it to anything, it just needs to listen using app
http.createServer(app).listen(8081);
const server = https.createServer(options, app).listen(8080);
const io = socketIO(server);

//Redirects user to https if they are using http , also changes port as cant have 2 servers
//on the same port.
// function redirectHTTPS(request,response){
//   if(!request.secure){
//     response.redirect("https://" + (request.headers.host).split(":")[0] +":5001" + request.url);
//   }
// }

//########## Server routes
console.log((app.locals.settings.views).split("views")[0])
app.get('/', function(request, response) {
  app.use(express.static('.'))
  response.sendFile(path.join(__dirname, 'index.html'));
  //redirectHTTPS(request,response)
});
app.use('*/Messages',express.static((app.locals.settings.views).split("views")[0] +'/Messages'));
app.use('*/Messages/settings',express.static((app.locals.settings.views).split("views")[0] + '/MessagesSettings'));
app.use('*/Messages/submission',express.static('./MessagesSubmission'));
app.use('*/Messages/buildings',express.static('./MessagesBuildingSubmission'));

let socketIDs =[];
let weatherData =[]

async function getAllSettingsFromDB(){
  const myConn = await globalConnection;
  const [rows] = await myConn.execute(
    'SELECT * FROM messagesSettings');
  return rows;
}
async function getSettingsFromDB(id) {
  const myConn = await globalConnection;
  const [rows] = await myConn.execute(
    'SELECT * FROM messagesSettings WHERE id=(?)',[id]);
  return rows;
}

async function saveSettingsInDB(settings) {
  const myConn = await globalConnection;
  return myConn.execute(
    'INSERT INTO messagesSettings (id,city,building,buildingInfo,mainInfo) VALUES (?,?,?,?,?)',
    [settings[0],settings[1],settings[2],settings[3],settings[4]]);
}
async function updateSettingsInDB(settings){
  const myConn = await globalConnection;
  return myConn.execute(
    'UPDATE messagesSettings SET city= ?, building = ? , buildingInfo = ? , mainInfo = ? WHERE id=?',
    [settings[1], settings[2],settings[3],settings[4],settings[0]]);
}

async function deleteSettingFromDB(settings){
  const myConn = await globalConnection;
  return myConn.execute(
    'DELETE FROM messagesSettings WHERE id=?',
    [settings[0]]);
}
async function deleteAllSettingsFromDB(){
  const myConn = await globalConnection;
  let [rows] = await myConn.execute(
    'TRUNCATE messagesSettings');
}

async function getAllMessagesFromDB() {
  const myConn = await globalConnection;
  const [rows] = await myConn.execute(
    'SELECT * FROM messages');
  return rows;
}
async function getMessagesFromDB(id) {
  const myConn = await globalConnection;
  const [rows] = await myConn.execute(
    'SELECT * FROM messages WHERE id=(?)',[id]);
  return rows;
}

async function getSpecificMessageFromDB(settings) {
  const myConn = await globalConnection;
  const [rows] = await myConn.execute(
    'SELECT * FROM messages WHERE uniqueID=?',[settings[0]]);
  return rows;
}
async function updateMessageInDB(settings){
  const myConn = await globalConnection;
  return myConn.execute(
    'UPDATE messages SET id = ? ,message= ? WHERE uniqueID=?',
    [settings[1], settings[2],settings[0]]);
}
async function saveMessageInDB(settings) {
  const myConn = await globalConnection;
  return myConn.execute(
    'INSERT INTO messages (id,message) VALUES (?,?)',
    [settings[0],settings[1]]);
}

async function deleteMessageFromDB(settings){
  const myConn = await globalConnection;
  return myConn.execute(
    'DELETE FROM messages WHERE uniqueID=?',
    [settings]);
}
async function deleteAllMessagesFromDB(){
  const myConn = await globalConnection;
  let [rows] = await myConn.execute(
    'TRUNCATE messages');
}

async function saveBuildingInDB(settings) {
  const myConn = await globalConnection;
  return myConn.execute(
    'INSERT INTO buildings (building) VALUES (?)',
    [settings]);
}
async function getSpecificBuildingFromDB(settings) {
  const myConn = await globalConnection;
  const [rows] = await myConn.execute(
    'SELECT * FROM buildings WHERE building=?',[settings]);
  return rows;
}
async function getAllBuildingsFromDB(){
  const myConn = await globalConnection;
  const [rows] = await myConn.execute(
    'SELECT * FROM buildings');
  return rows;
}

async function getAllBuildingMessages(settings) {
  const myConn = await globalConnection;
  const [rows] = await myConn.execute(
    'SELECT * FROM buildingMessages');
  return rows;
}
async function getBuildingMessages(settings) {
  const myConn = await globalConnection;
  const [rows] = await myConn.execute(
    'SELECT * FROM buildingMessages WHERE id=?',[settings]);
  return rows;
}
async function saveBuildingMessageInDB(settings) {
  const myConn = await globalConnection;
  return myConn.execute(
    'INSERT INTO buildingMessages (id,message) VALUES (?,?)',
    [settings[0],settings[1]]);
}
async function deleteAllBuildingMessages(settings) {
  const myConn = await globalConnection;
  return myConn.execute(
    'TRUNCATE buildingMessages'
  )
}
async function deleteBuildingMessageFromDB(settings){
  const myConn = await globalConnection;
  return myConn.execute(
    'DELETE FROM buildingMessages WHERE uniqueID=?',
    [settings]);
}
async function getSpecificBuildingMessageFromDB(settings) {
  console.log([settings[0]])
  const myConn = await globalConnection;
  const [rows] = await myConn.execute(
    'SELECT * FROM buildingMessages WHERE uniqueID=?',[settings[0]]);
  return rows;
}
async function updateBuildingMessageInDB(settings){
  const myConn = await globalConnection;
  return myConn.execute(
    'UPDATE buildingMessages SET id = ?,message=? WHERE uniqueID=?',
    [settings[1], settings[2],settings[0]]);
}

function setWeather(city,id){
  return new Promise(function (resolve,reject){
    let apiKey = "51eb3a9ddb0aa9ed4185ff72ffaf4c53"
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    request(url, function (err, response, body) {
      console.log("request")
      if(err){
        console.log('error:', error);
        reject(err)
      }else{
        let weather = JSON.parse(body);
        if(weather.cod == 200){
          weatherData[city] = weather
        }
        resolve(JSON.parse(body))
      }

    });
  })
}
function validCity(weather,id){
  if(weather.cod != 200){
    io.to(id).emit("notValid")
    return false;
  }else{
    io.to(id).emit("valid")
    return true;
  }
}
function isEmpty(object){
  if (object == null|| object.length == 0){
    return true;
  }else{
    return false;
  }
}


(function updateWeather(){
let cityCounter = 0
let defaultSpeed = 600;
let speed = 600;
setInterval(function(){
  let cities = Object.keys(weatherData)
  if(cities.length == 0){return};

  setWeather(cities[cityCounter])

  cityCounter += 1
  if(cityCounter >= (cities).length){
    cityCounter = 0;
  }

  if(speed > 10){
      speed = defaultSpeed - cities.length*10
  }
},1000*speed);
})();


io.on('connection', function(socket) {
  async function clearMessages(){
    io.emit("updateMessagesList");
    updateBackEndScreens()
  }
  async function clearBuildingMessages(){
    io.emit("updateLocationMessages");
    updateBackEndScreens()
  }
  async function updateMessageScreen(screenID,buildingID){
    let buildingMessages;
    console.log("updatemessagesScreen")


    if(!isEmpty(buildingID)){
      let allSettings = await getAllSettingsFromDB()
      buildingMessages = await getBuildingMessages(buildingID)
      for(let n=0;n<allSettings.length;n++){
        if(allSettings[0].building == buildingID){
            for(let p=0;p<socketIDs.length;p++){
                io.to(socketIDs[allSettings[0].id][p]).emit("updateLocationMessages",buildingMessages)
            }

        }
      }
    }
    if(isEmpty(screenID)){
      return;
    }
    let building;
    let settings = await getSettingsFromDB(screenID)
    let buildings = await getAllBuildingsFromDB()
    buildingMessages = await getBuildingMessages(settings[0].building)
    let messages = await getMessagesFromDB(screenID)
    if(!weatherData[settings[0].city]){
      weather = await setWeather(settings[0].city)
    }else{
      weather = weatherData[settings[0].city]
    }

    let sections = {
      buildingInfo:settings[0].buildingInfo,
      mainInfo:settings[0].mainInfo
    }
    for(let o=0;o<buildings.length;o++){
      if(settings[0].building == buildings[o].uniqueID){
        building = buildings[o].building
      }
    }

    if(socketIDs[screenID] == null || socketIDs == "undefinied"){
      return
    }
    for(let i=0;i<socketIDs[screenID].length;i++){
      io.to(socketIDs[screenID][i]).emit("updateSections",sections)
      io.to(socketIDs[screenID][i]).emit("updateLocation",building)
      io.to(socketIDs[screenID][i]).emit("updateLocationMessages",buildingMessages)
      io.to(socketIDs[screenID][i]).emit("weather",weather)
      io.to(socketIDs[screenID][i]).emit("updateMessagesList",messages)
    }
  }
  async function updateBackEndScreens(){
    let settings = await getAllSettingsFromDB()
    let messages = await getAllMessagesFromDB()
    let buildings = await getAllBuildingsFromDB()
    let buildingMessages = await getAllBuildingMessages()
    socket.emit("updateSettingsList",settings)
    socket.emit("updateAllMessagesList",messages)
    socket.emit("updateBuildingList",buildings)
    socket.emit("updateAllBuildingMessages",buildingMessages)
  }
  updateBackEndScreens()

  socket.on('newClient', async function(id){
    if(socketIDs[id] == null){
      socketIDs[id] = []
      socketIDs[id].push(socket.id)
    }else{
      socketIDs[id].push(socket.id)
    }

    let databaseResults = await getSettingsFromDB(id)
    if(isEmpty(databaseResults)){
      console.log("undefined database results")
      io.emit("updateMessagesList");
      io.emit("updateLocationMessages");

      return;
    }

    let city = databaseResults[0].city
    let weather;

    //If its a new city , get the weather data, else just recieve it from stored weather
    if(!weatherData[city]){
      weather = await setWeather(city)
    }else{
      weather = weatherData[city]
    }
    let messages = await getMessagesFromDB(id)
    updateMessageScreen(databaseResults[0].id)
  });

  socket.on('saveSettings', async function(data){
      let savedSetting = await getSettingsFromDB(data.id)
      let weather = await setWeather(data.city)
      let settings = [data.id,data.city,data.building,data.buildingInfo,data.mainInfo]

      //If its not a valid city then stop.
      if(!validCity(weather,socket.id)){
        return;
      }

      //If the id has no settings stored then save a new one, else update the saved one.
      if(isEmpty(savedSetting)){
        await saveSettingsInDB(settings)
        updateBackEndScreens()
      }else{
        await updateSettingsInDB(settings)
        updateBackEndScreens()
      }

      //If no clients are using this ID , then dont do anything , else update them
      if(isEmpty(socketIDs[data.id])){
        return
      }else{
        updateMessageScreen(data.id)
      };
  });
  socket.on("purgeSettings",async function(){
    await deleteAllSettingsFromDB()
    updateBackEndScreens()
  })
  socket.on("deleteSetting",async function(data){
    await deleteSettingFromDB([data.id,data.city,data.building,data.buildingInfo,data.mainInfo])
    updateBackEndScreens()
  })

  socket.on("saveMessage",async function(data){

    let savedScreen = await getSettingsFromDB(data.id)
    if(isEmpty(savedScreen)){
      socket.emit("ScreenSaved",false)
      return
    }else{
      socket.emit("ScreenSaved",true)
    }

    if(!isEmpty(data.uniqueID)){
      let savedMessage = await getSpecificMessageFromDB(data.uniqueID)
      if(!isEmpty(savedMessage)){
        await updateMessageInDB([data.uniqueID,data.id,data.message])
      }else{
        await saveMessageInDB([data.id,data.message])
      }
    }else{
      await saveMessageInDB([data.id,data.message])
    }

    updateMessageScreen(data.id)
    updateBackEndScreens()
  })
  socket.on("purgeMessages",async function(data){
    await deleteAllMessagesFromDB()
    clearMessages()
  })
  socket.on("deleteMessage",async function(data){
    await deleteMessageFromDB(data.uniqueID)
    updateMessageScreen(data.id)
    updateBackEndScreens()
  })

  socket.on("saveBuilding",async function(data){
    let savedBuilding = await getSpecificBuildingFromDB(data)
    if(!isEmpty(savedBuilding)){
      socket.emit("duplicateBuilding",true)
    }else{
      await saveBuildingInDB(data)
        socket.emit("duplicateBuilding",false)
        updateBackEndScreens()
    }

  })

  socket.on("saveBuildingMessage",async function(data){
      if(!isEmpty(data.uniqueID)){
        let savedMessage = await getSpecificBuildingMessageFromDB(data.uniqueID)
        console.log("saved message = ")
        console.log(savedMessage)
        if(!isEmpty(savedMessage)){
          await updateBuildingMessageInDB([data.uniqueID,data.buildingID,data.message])
        }else{
          await saveBuildingMessageInDB([data.buildingID,data.message])
        }
      }else{
        await saveBuildingMessageInDB([data.buildingID,data.message])
      }

      updateBackEndScreens()
      updateMessageScreen(null,data.buildingID)
  })
  socket.on("purgeBuildingMessages",async function (){
    await deleteAllBuildingMessages()
    clearBuildingMessages()
  })
  socket.on("deleteBuildingMessage",async function (data){
    await deleteBuildingMessageFromDB(data.uniqueID)
    updateMessageScreen(null,data.id)
    updateBackEndScreens()
  })
});
