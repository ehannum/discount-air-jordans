var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var querystring = require('querystring');
var http = require('http');
var server = http.Server(app);
var path = require('path');

// firebase initialization
var firebase = require('firebase');
var db = null;

// -- FIREBASE DATABASE SETUP

firebase.initializeApp({
  databaseURL: 'https://discount-air-jordans.firebaseio.com/'
});

db = firebase.database();
console.log('Connected to Firebase, no authentication required.');

// -- SERVE STATIC FILES and JSON

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// -- SHIT

app.get('/trash', function (req, res) {

  var ref = db.ref('posts');

  ref.once('value', function (data) {
    res.send(data.val());
  });
});

app.post('/trash', function (req, res) {

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

app.get('/archive', function (req, res) {

  var oldRef = db.ref('posts');
  var newRef = db.ref('archive');

  oldRef.once('value', function(snap)  {
    newRef.set( snap.val(), function(error) {
      if( !error ) {
        oldRef.remove();
        res.send('Yeah it looks like that may have actually worked.');
      } else {
        console.log(error);
        res.send(error);
      }
    });
  });
});

app.get('/unarchive', function (req, res) {

  var oldRef = db.ref('archive');
  var newRef = db.ref('posts');

  oldRef.once('value', function(snap)  {
    newRef.set( snap.val(), function(error) {
      if( !error ) {
        oldRef.remove();
        res.send('Yeah it looks like that may have actually worked.');
      } else {
        console.log(error);
        res.send(error);
      }
    });
  });
});

// -- START SERVER

var port = process.env.PORT || 3030;
console.log('Listening on port', port);
server.listen(port);
