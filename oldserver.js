"use strict";
let express = require('express');
const bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json());

let cors = require('cors')
const apiv1 = require('./apiv1');
app.use(cors())
app.use(apiv1);

// con.connect(function(err) {
//   //Create database if its not already there
//   if (err) throw err;
//   console.log("Connected!");
//   con.query("CREATE DATABASE IF NOT EXISTS Drag", function (err, result) {
//     if (err) throw err;
//     console.log("Database created");
//   });
//
//   //Create table if its not already there
//   let sql = "CREATE TABLE IF NOT EXISTS Drag.ballPositions (id INT(6), x INT(4) , y INT(4))";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table created");
//   });
//
//   //insert into table
//   let sql2 = "INSERT INTO Drag.ballPositions (id, x,y) VALUES (1, 363,5)";
//     con.query(sql2, function (err, result) {
//       if (err) throw err;
//       console.log("1 record inserted");
//     });
//
//   con.query("SELECT * FROM Drag.ballPositions", function (err, result, fields) {
//    if (err) throw err;
//    console.log(result);
//  });

//});









app.use(express.static(__dirname+"/dev/"))


app.listen(8080, function (req,res) {
    console.log('Dev app listening on port 8080!');
    console.log(__dirname+"/dev/")
    console.log('Path of file in parent dir:', require('path').resolve(__dirname, '../app.js'));
});
