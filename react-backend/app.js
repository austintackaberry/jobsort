var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static('client/build'));
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === "production") {
  app.use(express.static('client/build'));
}
// app.post('/yelpsearch', function(req, res) {
//   console.log('yelp search received request');
//   var yelpSearchTerms = JSON.parse(req.body);
//   yelp.accessToken(process.env.YELP_CLIENT_ID, process.env.YELP_CLIENT_SECRET).then(resp => {
//     const client = yelp.client(resp.jsonBody.access_token);
//     client.search(yelpSearchTerms).then(response => {
//       res.send(response.jsonBody);
//     }).catch(e => {
//       console.log(e);
//     });
//   }).catch(e => {
//     console.log(e);
//   });
// });
// app.post('/googlesearch', function(req, res) {
//   console.log('google search received request');
//   var googleSearchTerms = JSON.parse(req.body);
//   var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=' + process.env.GOOGLE_API_KEY + '&location=' + googleSearchTerms.location + '&radius=' + googleSearchTerms.radius + '&keyword=' + googleSearchTerms.keyword;
//   if ('pagetoken' in googleSearchTerms) {
//     url += '&pagetoken=' + googleSearchTerms.pagetoken;
//   }
//   fetch(url, {
//     method: 'GET'
//   })
//   .then(res => res.json())
//   .catch(e => {
//     console.log(e);
//   })
//   .then(data => {
//     res.send(data);
//   })
//   .catch(e => {
//     console.log(e);
//   });
// });
// app.post('/googlelocationsearch', function(req, res) {
//   console.log('google location search received request');
//   var googleSearchTerms = JSON.parse(req.body);
//   var url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?key=' + process.env.GOOGLE_API_KEY + '&query=' + googleSearchTerms.query;
//   fetch(url, {
//     method: 'GET'
//   })
//   .then(res => res.json())
//   .catch(e => {
//     console.log(e);
//   })
//   .then(data => {
//     console.log(data);
//     res.send(data);
//   })
//   .catch(e => {
//     console.log(e);
//   });
// });
app.listen(process.env.PORT || 3001);
console.log('listening on 3001');

module.exports = app;
