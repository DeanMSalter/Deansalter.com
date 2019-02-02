const express = require('express');
const mysql = require('mysql2/promise');

const config = require('./config');
const util = require('./util');

const globalConnection = mysql.createConnection(config.mysql);

const router = express.Router();

router.get('/position', getMessages);
router.post('/position', postMessage);

async function getMessages(req, res) {
  try {
    res.json(await getMessagesFromDB());
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

async function postMessage(req, res) {
  if (!util.checkBodyIsValid(req, res)) return;

  try {
    await saveMessageInDB(req.body.id,req.body.x,req.body.y);
    res.json(await getMessagesFromDB());

  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}


async function saveMessageInDB(id,x,y) {
  const myConn = await globalConnection;
  myConn.execute('DELETE FROM ballPositions where id = '+ id);


  return myConn.execute(
    'INSERT INTO ballPositions (id,x,y) VALUES (?,?,?)',[id,x,y]);
}

async function getMessagesFromDB() {
  const myConn = await globalConnection;
  const [rows] = await myConn.execute(
    'SELECT id,x,y FROM ballPositions');

  return rows
}


module.exports = router;
