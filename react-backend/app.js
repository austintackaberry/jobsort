var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');

// var index = require('./routes/index');
// var users = require('./routes/users');

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
app.post('/getresults', function(req, res) {
  console.log('getresults received request');
  // console.log(req);
  var githubData = {};
  var dataPackage = JSON.parse(req.body);
  var url = "https://jobs.github.com/positions.json?search=" + dataPackage.jobTitle + '&location=' + dataPackage.jobLocation;
  fetch(url, {
    method: 'GET'
  })
  .then(res => res.json())
  .catch(e => {
    console.log(e);
  })
  .then(data => {
    // console.log(data);
    githubData = data;
    var githubFormatted = [];
    for (let j = 0; j < githubData.length; j++) {
      githubFormatted.push(
        {
          id: githubData[j].id,
          title: githubData[j].title,
          postTime: githubData[j].created_at,
          location: githubData[j].location,
          type: githubData[j].type
        }
      );
      let allLangsCount = [];
      let rankScore = 0;
      for (let i = 0; i < dataPackage.allLangs.length; i++) {
        let regexVar = dataPackage.allLangs[i].replace(/\+/g,"\\$&");
        var re = new RegExp(regexVar, 'i');
        if (regexVar === 'c') {
          var re = new RegExp(/[^a-zA-Z0-9]c[^a-zA-Z0-9]/i);
        }
        if (regexVar === 'r') {
          var re = new RegExp(/[^a-zA-Z0-9]r[^a-zA-Z0-9]/i);
        }
        allLangsCount.push({language: dataPackage.allLangs[i]});
        console.log(githubData[j].description.match(re));
        if (githubData[j].description.match(re)) {
          allLangsCount[i].isInDescription = 1;
          dataPackage.userData.map((element) => {
            if (element.language == dataPackage.allLangs[i]) {
              rankScore += element.weight * allLangsCount[i].isInDescription;
            }
            return element.language == dataPackage.allLangs[i];
          });
        }
        else {
          allLangsCount[i].isInDescription = 0;
        }
        githubFormatted[j].rankScore = rankScore;
      }
      let rankTotal = 0;
      allLangsCount.map((element) => {rankTotal += element.isInDescription;});
      githubFormatted[j].rankScore /= rankTotal;
      console.log(githubData[j].description);
      console.log(allLangsCount);
    }
    githubFormatted.sort((a, b) => {
      if (b.rankScore === a.rankScore) {
        return b.postTime - a.postTime;
      }
      return b.rankScore - a.rankScore;
    });
    res.send(githubFormatted);
  })
  .catch(e => {
    console.log(e);
  });
});
// app.post('/googlesearch', function(req, res) {
//   console.log('google search received request');
//   var googleSearchTerms = JSON.parse(req.body);
//   var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=' + process.env.GOOGLE_API_KEY + '&location=' + googleSearchTerms.location + '&radius=' + googleSearchTerms.radius + '&keyword=' + googleSearchTerms.keyword;
//   if ('pagetoken' in googleSearchTerms) {
//     url += '&pagetoken=' + googleSearchTerms.pagetoken;
//   }

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
