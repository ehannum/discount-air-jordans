var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var querystring = require('querystring');
var http = require('http');
var server = http.Server(app);
var path = require('path');

// firebase initialization
var firebase = require('firebase');
var fKey = process.env.FIREBASE_KEY || null;
var db = null;

// -- FIREBASE DATABASE SETUP

if (fKey) {
  firebase.initializeApp({
    serviceAccount: JSON.parse(fKey),
    databaseURL: 'https://discount-air-jordans.firebaseio.com/'
  });

  db = firebase.database();
  console.log('Connected and authenticated to Firebase.');
} else {
  console.log('Firebase authentication failure: No Private Key found.');
}

// -- SERVE STATIC FILES and JSON

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// -- SHIT

app.get('/trash', function (req, res) {
  if (!db) {
    console.log('Error: Firebase authentication failed');
    res.send('Error: Firebase authentication failed');
    return;
  }

  var ref = db.ref('posts');

  ref.once('value', function (data) {
    res.send(data.val());
  });
});

app.post('/trash', function (req, res) {
  if (!db) {
    console.log('Error: Firebase authentication failed');
    res.send('Error: Firebase authentication failed');
    return;
  }

  var ref = db.ref('posts');

  var postRef = ref.push();

  postRef.set(
    {
      content: req.body.content
    }, function (err) {
      if (err) {
        console.log('error:', err);
        res.send('ERROR: ' + err);
      } else {
        res.send('I sure hope nobody BREAKS MY WEBSITE.');
      }
    }
  );
});

// -- START SERVER

var port = process.env.PORT || 3030;
console.log('Listening on port', port);
server.listen(port);
