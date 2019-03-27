exports = module.exports = function(io){
  const request = require('request');
  const mysql = require('mysql2/promise');
  const config = require('./config');
  const globalConnection = mysql.createConnection(config.mysql);

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
      'INSERT INTO messagesSettings (id,city,building,gameInfo,buildingInfo,mainInfo) VALUES (?,?,?,?,?,?)',
      [settings[0],settings[1],settings[2],settings[3],settings[4],settings[5]]);
  }
  async function updateSettingsInDB(settings){
    const myConn = await globalConnection;
    return myConn.execute(
      'UPDATE messagesSettings SET city= ?, building = ? , gameInfo = ? , buildingInfo = ? , mainInfo = ? WHERE id=?',
      [settings[1], settings[2],settings[3],settings[4],settings[5],settings[0]]);
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
    if (typeof object === "undefined" || object.length == 0){
      return true;
    }else{
      return false;
    }
  }
  function updateClients(data,weather="NA",messages="NA"){
    let sections = {
      gameInfo:data.gameInfo,
      buildingInfo:data.buildingInfo,
      mainInfo:data.mainInfo
    }

    for(let i = 0;i<socketIDs[data.id].length;i++){
        io.to(socketIDs[data.id][i]).emit("updateSections",sections)
        io.to(socketIDs[data.id][i]).emit("updateLocation",data.building)
        if(weather!="NA"){
          io.to(socketIDs[data.id][i]).emit("weather",weather)
        }
        if(messages!="NA"){
            io.to(socketIDs[data.id][i]).emit("updateMessagesList",messages)
        }

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
  async function updateMessages(id){
      let messages;
      if(id==null || id=="undefined"){
        io.emit("updateMessagesList");
      }else{
        if(isEmpty(socketIDs[id])){return}
        messages = await getMessagesFromDB(id)
        for(let i = 0;i<socketIDs[id].length;i++){
          io.to(socketIDs[id][i]).emit("updateMessagesList",messages)
        }
      }

      console.log(id)


  }

  io.on('connection', function(socket) {
    updateSettingsList()
    updateMessagesList()
    updateBuildingList()
    async function updateSettingsList(){
        let settings = await getAllSettingsFromDB()
        io.emit("updateSettingsList",settings)
    };
    async function updateMessagesList(){
        let messages = await getAllMessagesFromDB()

        console.log("updating messages")
        socket.emit("updateAllMessagesList",messages)

    };
    async function updateBuildingList(){
      let buildings = await getAllBuildingsFromDB()
      socket.emit("updateBuildingList",buildings)
      console.log(socketIDs)
    }
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
      updateClients(databaseResults[0],weather,messages)


    });

    socket.on('saveSettings', async function(data){
        let savedSetting = await getSettingsFromDB(data.id)
        let weather = await setWeather(data.city)
        let settings = [data.id,data.city,data.building,data.gameInfo,data.buildingInfo,data.mainInfo]

        //If its not a valid city then stop.
        if(!validCity(weather,socket.id)){
          return;
        }

        //If the id has no settings stored then save a new one, else update the saved one.
        if(isEmpty(savedSetting)){
          await saveSettingsInDB(settings)
          updateSettingsList()
        }else{
          await updateSettingsInDB(settings)
          updateSettingsList()
        }

        //If no clients are using this ID , then dont do anything , else update them
        if(isEmpty(socketIDs[data.id])){
          return
        }else{
          updateClients(data,weather)
        };
    });
    socket.on("purgeSettings",async function(){
      await deleteAllSettingsFromDB()
      updateSettingsList()
    })
    socket.on("deleteSetting",async function(data){
      await deleteSettingFromDB([data.id,data.city,data.building,data.gameInfo,data.buildingInfo,data.mainInfo])
      updateSettingsList()
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
        console.log(data.uniqueID)
        let savedMessage = await getSpecificMessageFromDB(data.uniqueID)
        console.log("desired")
        console.log(savedMessage)
        if(!isEmpty(savedMessage)){
          console.log("found")
          await updateMessageInDB([data.uniqueID,data.id,data.message])
        }else{
          await saveMessageInDB([data.id,data.message])
        }
      }else{
        await saveMessageInDB([data.id,data.message])
      }


      updateMessagesList()
      updateMessages(data.id)
    })
    socket.on("purgeMessages",async function(data){
      await deleteAllMessagesFromDB()
      updateMessagesList()
      updateMessages()
    })
    socket.on("deleteMessage",async function(data){
      await deleteMessageFromDB(data.uniqueID)
      updateMessagesList()
      updateMessages(data.id)
    })
    socket.on("saveBuilding",async function(data){
      let savedBuilding = await getSpecificBuildingFromDB(data)
      if(!isEmpty(savedBuilding)){
        console.log("already saved")
        socket.emit("duplicateBuilding",true)
      }else{
        saveBuildingInDB(data)
          socket.emit("duplicateBuilding",false)
      }

    })

  });



}
