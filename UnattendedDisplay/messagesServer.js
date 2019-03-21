exports = module.exports = function(io){
  let request = require('request');
  

  //Done first time the server starts and then once every 10 minutes
  //(The frequency the API updates)


  io.on('connection', function(socket) {
    let city = "portsmouth"
    let weather;
    //Using OpenWeatherMap , we request a json full of weather data using the apiKey
    //Once the request is complete we send that weather data to the client.
    function setWeather(city){
        let apiKey = "51eb3a9ddb0aa9ed4185ff72ffaf4c53"
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        request(url, function (err, response, body) {
          console.log("request")
          if(err){
            console.log('error:', error);
          } else {
            weather = JSON.parse(body);
            console.log(socket.id)
            console.log(city)
            if(weather.cod == 200){
              io.to(socket.id).emit("weather",weather)
            }else{
              io.to(socket.id).emit("notValid")
            }

          }
        });
    }
    //Everytime i new client connects , we send them weather data
    setWeather(city)
    setInterval(function(){
      setWeather(city)
    },1000*600);
    //a request to updatelocation gets new weather data with the city requested
    socket.on('updateLocation',function(data){
      io.to(socket.id).emit("updateLocation")
      setWeather(data.city)

    });

  });



}
