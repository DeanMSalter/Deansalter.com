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
      'SELECT id, city,building FROM messagesSettings');
    return rows;
  }
  async function getSettingsFromDB(id) {
    const myConn = await globalConnection;
    const [rows] = await myConn.execute(
      'SELECT id, city,building FROM messagesSettings WHERE id=(?)',[id]);
    return rows;
  }
  async function saveSettingsInDB(settings) {
    console.log("savving")
    const myConn = await globalConnection;
    return myConn.execute(
      'INSERT INTO messagesSettings (id,city,building) VALUES (?,?,?)',
      [settings[0],settings[1],settings[2]]);
  }
  async function updateSettingsInDB(settings){
    const myConn = await globalConnection;
    return myConn.execute(
      'UPDATE messagesSettings SET city= ?, building = ? WHERE id=?',
      [settings[1], settings[2],settings[0]]);
  }



  //Using OpenWeatherMap , we request a json full of weather data using the apiKey
  //Once the request is complete we send that weather data to the client.
function setWeather(city,socketID){
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
        resolve(body)
      }

    });
  })
}



  //every 10 seconds , a city recieves updatted weather information.
  //Then the next city in the array is updated 10 seconds later and so on

  //The API only updates weather information every 10 minutes and restricts calls to 60 per minute
  //This ensures we dont go over the max amount of requests and means we can have up to 60 unique cities
  // updatted atleast once every 10 minutes

  //its relative to the amount of citties as to prevent unnecesary api calls

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
    console.log(speed)
  },1000*speed);



  io.on('connection', function(socket) {
    let socketID;
    let city;
    let building;

    async function updateSettingsList(){
        let database = await getAllSettingsFromDB()
        socket.emit("updateSettingsList",database)
        console.log("emitting")
    }

    socket.on('newClient',function(id){
      if(socketIDs[id] == null){
        socketIDs[id] = []
        socketIDs[id].push(socket.id)
      }else{
        socketIDs[id].push(socket.id)
      }
      socketID=id;

      //Self calling annonymous function ,  that waits for the database to return data
      (async function(){
        let weather;
        let databaseResults = await getSettingsFromDB(id)
        if(typeof databaseResults === "undefined" || databaseResults.length == 0){
          console.log("undefined database results")
          for(let i = 0;i<socketIDs[socketID].length;i++){
                io.to(socketIDs[socketID][i]).emit("updateLocation",("No Settings saved for " + socketID))
          }
          return;
        }
        city = databaseResults[0].city
        building = databaseResults[0].building

        //If its a new city , get the weather data, else just recieve it from stored weather
        if(!weatherData[city]){
          setWeather(city,socketID)
        }else{
          weather = weatherData[city]
          for(let i = 0;i<socketIDs[socketID].length;i++){
              io.to(socketIDs[socketID][i]).emit("weather",weather)
          }
        }
        for(let i = 0;i<socketIDs[socketID].length;i++){
            io.to(socketIDs[socketID][i]).emit("updateLocation",building)
        }
      })();
    });

    socket.on('saveSettings',function(data){

      (async function(){
        console.log("saving")
        let entry = await getSettingsFromDB(data.id)
        let weatherData = await setWeather(data.city)
        let weather = JSON.parse(weatherData)

        if(weather.cod != 200){
          io.to(socket.id).emit("notValid")
          return;
        }else{
            io.to(socket.id).emit("valid")
        }
        console.log(entry)
        if(typeof entry === "undefined" || entry.length == 0){
          console.log("save1")
          await saveSettingsInDB([data.id,data.city,data.building])
          updateSettingsList()
        }else{
          console.log("updat2e")
          await updateSettingsInDB([data.id,data.city,data.building])
          updateSettingsList()
        }

        console.log()
        if(typeof socketIDs[data.id] === "undefined" || socketIDs[data.id].length == 0){
          return
        }else{
          for(let i = 0;i<socketIDs[data.id].length;i++){
              io.to(socketIDs[data.id][i]).emit("weather",weather)
          }
        }

      })();

    });
    socket.on("getSettingsUpdate",function(){
      updateSettingsList()
    });
    socket.on("purgeSettings",async function(){
      const myConn = await globalConnection;
      return [rows] = await myConn.execute(
        'TRUNCATE messagesSettings');
    })


  });



}
