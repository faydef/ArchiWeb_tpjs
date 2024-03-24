var express = require('express'); //import de la bibliothèque Express
var app = express(); //instanciation d'une application Express

var counter = 0;
var allMsgs = ["Hello World", "foobar", "CentraleSupelec Forever"];
var likes = [0, 0, 0];


// Pour s'assurer que l'on peut faire des appels AJAX au serveur
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Ici faut faire faire quelque chose à notre app...
// On va mettre les "routes"  == les requêtes HTTP acceptéés par notre application.

app.get("/", function(req, res) {
  res.send("Hello")
})

app.get('/test/*', function(req, res) {
  var dynamicPart = req.url.substr(6);
  var responseObject = { "msg": dynamicPart };
  res.json(responseObject);
});


app.get('/cpt/query', function(req, res) {
  res.json({ "value": counter });
});

app.get('/cpt/inc', function(req, res) {
  if (req.query.v && !isNaN(req.query.v) && Number.isInteger(parseFloat(req.query.v))) {
    counter += parseInt(req.query.v, 10);
    res.json({ "code": 0 });
  } else if (req.query.v) {
    res.json({ "code": -1 });
  } else {
    counter += 1;
    res.json({ "code": 0 });
  }
});

app.get('/msg/post/*', function(req, res) {
  var message = unescape(req.url.substr(10));
  allMsgs.push(message);
  likes.push(0);
  res.json({ "code": 1, "msgId": allMsgs.length - 1 });
});

app.get('/msg/get/*', function(req, res) {
  var msgId = parseInt(req.url.substr(9));
  if (isNaN(msgId) || msgId < 0 || msgId >= allMsgs.length) {
    res.json({ "code": 0 });
  } else {
    res.json({ "code": 1, "msg": allMsgs[msgId] });
  }
});

app.get('/msg/getAll', function(req, res) {
  res.json(allMsgs);
});

app.get('/msg/nber', function(req, res) {
  res.json(allMsgs.length);
});

app.get('/msg/del/*', function(req, res) {
  var msgId = parseInt(req.url.substr(9));
  if (isNaN(msgId) || msgId < 0 || msgId >= allMsgs.length) {
    res.json({ "code": 0 });
  } else {
    allMsgs.splice(msgId, 1);
    likes.splice(msgId, 1);
    res.json({ "code": 1 });
  }
});

app.get('/msg/like/:id', function(req, res) {
  var msgId = parseInt(req.params.id);
  if (isNaN(msgId) || msgId < 0 || msgId >= allMsgs.length) {
    res.json({ "code": -1, "msg": "Invalid message ID" });
  } else {
    likes[msgId] += 1;
    res.json({ "code": 1, "likes": likes[msgId] });
  }
});

app.get('/msg/likes', function(req, res) {
  res.json(likes);
});

app.listen(8080);
console.log("App listening on port 8080...");



