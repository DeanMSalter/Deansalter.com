'use strict';

function checkBodyIsValid(req, res) {
  if (req.body.x == null || req.body.id == null || req.body.y == null){
          console.log(req.body)
          res.sendStatus(444);
          return false;
  }

  return true;
}

module.exports = {
  checkBodyIsValid,
};
