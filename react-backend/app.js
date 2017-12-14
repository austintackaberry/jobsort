var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var async = require('async');
const cheerio = require('cheerio');
const rp = require('request-promise');
var htmlToText = require('html-to-text');

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

function UTCDateToTimeElapsed(passedDate) {
  let milliseconds = Date.now() - Date.parse(passedDate);
  let seconds = milliseconds/1000.0;
  if (seconds < 60) {
    return Math.round(seconds) + "s ago";
  }
  let minutes = seconds/60;
  if (minutes < 60) {
    return Math.round(minutes) + "min ago";
  }
  let hours = minutes/60;
  if (hours < 24) {
    return Math.round(hours) + "h ago";
  }
  let days = hours/24;
  if (days < 7) {
    return Math.round(days) + "d ago";
  }
  let weeks = days/7;
  return Math.round(weeks) + "w ago";
}

function getDistanceInMilesFromUser(userCoordinates, jobCoordinates) {
  lat1 = userCoordinates.lat;
  lon1 = userCoordinates.lon;
  lat2 = jobCoordinates.lat;
  lon2 = jobCoordinates.lon;
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d/1.60934; //Distance in miles
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function parseHackerNewsPostTime(timeString) {
  let timeArr = timeString.split(' ');
  if (timeArr[1] == 'seconds') {
    timeArr[0] = timeArr[0] + 's';
  }
  if (timeArr[1] == 'minutes') {
    timeArr[0] = timeArr[0] + 'min';
  }
  if (timeArr[1] == 'hours') {
    timeArr[0] = timeArr[0] + 'h';
  }
  if (timeArr[1] == 'days') {
    if (parseInt(timeArr[0]) < 7) {
      timeArr[0] = timeArr[0] + 'd';
    }
    else if (parseInt(timeArr[0]) < 30) {
      timeArr[0] = Math.round(parseInt(timeArr[0])/7.0).toString() + 'w';
    }
    else {
      timeArr[0] = Math.round(parseInt(timeArr[0])/30.4).toString() + 'mon';
    }
  }
  if (timeArr[1] == 'years') {
    timeArr[0] = timeArr[0] + 'y';
  }
  timeArr.splice(1,1);
  return timeArr.join(' ');
}

function rankScore(dataPackage, description) {
  let allTechsCount = [];
  let descriptionHasTech = [];
  let rankScore = 0;
  for (let i = 0; i < dataPackage.allTechs.length; i++) {
    let test;
    let regexVar = dataPackage.allTechs[i];
    if (regexVar === '.net') {
      re = new RegExp(/[^a-z0-9]\.net[^a-z0-9]/i);
    }
    else if (regexVar === 'c++') {
      re = new RegExp(/c\+\+/i);
    }
    else {
      re = new RegExp(regexVar, 'i');
    }
    if (regexVar === 'r') {
      re = new RegExp(/[^a-zA-Z0-9é]r[^a-zA-Z0-9é&]/i);
    }
    else if (regexVar === 'bootstrap') {
      re = new RegExp(/[^a-zA-Z0-9]bootstrap[^a-zA-Z0-9]/i);
    }
    else if (regexVar === 'scala') {
      re = new RegExp(/[^a-zA-Z0-9]scala[^a-zA-Z0-9]/i);
    }
    else if (regexVar === 'sql') {
      re = new RegExp(/[^a-zA-Z0-9]sql[^a-zA-Z0-9]/i);
    }
    else if (regexVar === 'html') {
      re = new RegExp(/^\.html/i);
    }
    else if (regexVar === 'react native') {
      re = new RegExp(/react\s?native/i);
    }
    else if (regexVar === 'java') {
      re = new RegExp(/java(?!script)/i);
    }
    else if (regexVar === 'objective-c') {
      re = new RegExp(/(objective-c)|(objective\sc)/i);
    }
    else if (regexVar === 'react') {
      re = new RegExp(/react(?![a-ik-z])(?!\s?native)/i);
    }
    if (regexVar === 'c') {
      let tempDescription = description;
      tempDescription = tempDescription.replace(/objective\sc|objective\-c|series\sc/ig, "");
      re = new RegExp(/[^a-zA-Z0-9]c(?!\+\+)(?![\#a-zA-Z0-9])/i);
      test = re.test(tempDescription);
    }
    else {
      test = re.test(description);
    }
    allTechsCount.push({language: dataPackage.allTechs[i]});
    if (test) {
      allTechsCount[i].isInDescription = 1;
      descriptionHasTech.push(dataPackage.allTechs[i]);
      dataPackage.userData.map((element) => {
        if (element.language == dataPackage.allTechs[i]) {
          rankScore += element.weight * allTechsCount[i].isInDescription;
        }
        return element.language == dataPackage.allTechs[i];
      });
    }
    else {
      allTechsCount[i].isInDescription = 0;
    }
  }
  let rankTotal = 0;
  allTechsCount.map((element) => {rankTotal += element.isInDescription;});
  if (rankTotal === 0) {
    rankScore = 0.000000001;
  }
  else {
    rankScore /= rankTotal;
  }
  return {rankScore:rankScore, descriptionHasTech:descriptionHasTech};
}

function jobSort(listingData) {
  listingData.sort((a, b) => {
    return b.rankScore - a.rankScore;
  });
  return listingData;
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static('client/build'));
}
app.post('/getresults', function(req, res) {
  console.log('getresults received request');
  var dataPackage = JSON.parse(req.body);
  var returnDataPackage = [];
  var stackOverflowFormatted = [];
  var asyncFns = [];
  var asyncFns2 = [];
  var asyncHnLocationFns = [];
  asyncHnLocationFns.push()
  var githubFormatted = [];
  var userCoordinates = {};
  let asyncSoJobListingFns = [];
  var hnFormatted = [];

  var getUserCoordinates = function (callback) {
    if (dataPackage.jobLocation) {
      let url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + dataPackage.jobLocation + "&key=AIzaSyAFco2ZmRw5uysFTC4Eck6zXdltYMwb4jk";
      fetch(url, {
        method: 'GET'
      })
      .then(res => res.json())
      .catch(e => {
        console.log(e);
      })
      .then(data => {
        if (!data.results[0]) {
          console.log(data);
        }
        userCoordinates = data.results[0].geometry.location;
        callback();
      })
      .catch(e => {
        console.log(e);
      });
    }
    else {
      userCoordinates = false;
      callback();
    }
  };

  var githubAPI = function (callback) {
    if (dataPackage.checked.github) {
      var githubData = {};
      var url = "https://jobs.github.com/positions.json?search=" + dataPackage.jobTitle + '&location=' + dataPackage.jobLocation;
      fetch(url, {
        method: 'GET'
      })
      .then(res => res.json())
      .catch(e => {
        console.log(e);
      })
      .then(data => {
        githubData = data;
        for (let j = 0; j < githubData.length; j++) {
          let rankScoreObj = rankScore(dataPackage, htmlToText.fromString(githubData[j].description, {wordwrap: 80}));
          githubFormatted.push(
            {
              url: 'https://jobs.github.com/positions/' + githubData[j].id,
              title: githubData[j].title,
              postTime: UTCDateToTimeElapsed(githubData[j].created_at),
              location: githubData[j].location,
              type: githubData[j].type,
              descriptionHTML: githubData[j].description,
              descriptionText: htmlToText.fromString(githubData[j].description, {wordwrap: 1}),
              descriptionHasTech: rankScoreObj.descriptionHasTech,
              source: "github",
              rankScore: rankScoreObj.rankScore,
              readMore: false,
              hidden: false
            }
          );
        }
        callback();
      })
      .catch(e => {
        console.log(e);
      });
    }
    else {
      callback();
    }
  };
  var scrapeHackerNews = function (callback) {
    if (dataPackage.checked.hackerNews) {
      const options = {
        uri: 'https://news.ycombinator.com/submitted?id=whoishiring',
        transform: (body) => {return cheerio.load(body);}
      };
      rp(options)
      .then(($) => {
        let whoIsHiringLink;
        $('.storylink').each(function(index, value) {
          let text = $(this).text();
          if (text.includes('Who is hiring?')) {
            whoIsHiringLink = 'https://news.ycombinator.com/' + value.attribs.href;
            return false;
          }
        });
        const options = {
          uri: whoIsHiringLink,
          transform: (body) => {return cheerio.load(body);}
        };
        rp(options)
        .then(($) => {
          $('.c00').each(function(index, value) {
            let text = $(this).text();
            let topLine = $($(this).contents()[0]).text();
            let listingInfo = topLine.split("|");
            if (listingInfo.length > 1) {
              let i = 0;
              let descriptionHTML;
              let fullPost = $(this);
              fullPost.find('.reply').remove();
              fullPost = fullPost.html();
              let postTime = $(this).parents().eq(2).find('.age').text();
              hnFormatted.push(
                {
                  source:"hackerNews",
                  fullPostText:text,
                  descriptionHTML:fullPost,
                  readMore: false,
                  hidden: false,
                  postTime: parseHackerNewsPostTime(postTime)
                }
              );
              if ($($(this).contents()[1]).attr('href')) {
                hnFormatted[hnFormatted.length -1].url = $($(this).contents()[1]).attr('href');
                descriptionText = $($(this).contents().slice(2)).text();
              }
              else {
                descriptionText = $($(this).contents().slice(1)).text();
              }
              let rankScoreObj = rankScore(dataPackage, text);
              hnFormatted[hnFormatted.length -1].companyName = listingInfo.shift();
              hnFormatted[hnFormatted.length -1].descriptionText = descriptionText;
              hnFormatted[hnFormatted.length - 1].rankScore = rankScoreObj.rankScore;
              hnFormatted[hnFormatted.length - 1].descriptionHasTech = rankScoreObj.descriptionHasTech;
              while (i < listingInfo.length) {
                if (listingInfo[i].includes('http')) {
                  hnFormatted[hnFormatted.length -1].url = listingInfo.splice(i, 1);
                }
                else if (/%|salary|€|\$|£|[0-9][0-9]k/.test(listingInfo[i])) {
                  hnFormatted[hnFormatted.length -1].compensation = listingInfo.splice(i, 1)[0];
                }
                else if (/position|engineer|developer|senior|junior|scientist|analyst/i.test(listingInfo[i])) {
                  hnFormatted[hnFormatted.length -1].title = listingInfo.splice(i, 1)[0];
                }
                else if (/permanent|intern|flexible|remote|on\W*site|part\Wtime|full\Wtime|full/i.test(listingInfo[i])) {
                  hnFormatted[hnFormatted.length -1].type = listingInfo.splice(i, 1)[0];
                }
                else if (/boston|seattle|london|new york|san francisco|bay area|nyc|sf/i.test(listingInfo[i])) {
                  hnFormatted[hnFormatted.length -1].location = listingInfo.splice(i, 1)[0];
                }
                else if (/\W\W[A-Z][a-zA-Z]/.test(listingInfo[i])) {
                  hnFormatted[hnFormatted.length -1].location = listingInfo.splice(i, 1)[0];
                }
                else if (/[a-z]\.[a-z]/i.test(listingInfo[i])) {
                  hnFormatted[hnFormatted.length -1].url = "http://" + listingInfo.splice(i, 1)[0];
                }
                else if (listingInfo[i] === " ") {
                  listingInfo.splice(i, 1);
                }
                else {
                  i++;
                }
              }
              let indexHnFormatted = hnFormatted.length -1;
              if (hnFormatted[hnFormatted.length -1].location && userCoordinates) {
                asyncHnLocationFns.push(
                  (callback) => {
                    let location = hnFormatted[indexHnFormatted].location.replace(/[^a-zA-Z0-9-_]/g, ' ')
                    let url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyAFco2ZmRw5uysFTC4Eck6zXdltYMwb4jk";
                    fetch(encodeURI(url), {
                      method: 'GET'
                    })
                    .then(res => res.json())
                    .catch(e => {
                      console.log(e);
                    })
                    .then(data => {
                      if (!data.results[0]) {
                        hnFormatted[indexHnFormatted].distance = false;
                        console.log(data);
                      }
                      else {
                        let hnJobCoordinates = data.results[0].geometry.location;
                        let distance = getDistanceInMilesFromUser(userCoordinates, hnJobCoordinates);
                        if (distance < 100) {
                          hnFormatted[indexHnFormatted].distance = distance;
                        }
                        else {
                          hnFormatted[indexHnFormatted].distance = false;
                        }
                      }
                      callback();
                    })
                    .catch(e => {
                      console.log(e);
                    });
                  }
                );
              }
              else {
                hnFormatted[indexHnFormatted].distance = false;
              }
              // if (listingInfo.length > 0) {
              //   console.log(listingInfo);
              // }
            }
          });
          async.parallel(asyncHnLocationFns, function(err, results) {
            callback();
          });
        })
        .catch((err) => {
          console.log(err);
        });
      })
      .catch((err) => {
        console.log(err);
      });
    }
    else {
      callback();
    }
  };
  var scrapeStackOverflowJobSearchPage = function (callback) {
    if (dataPackage.checked.stackOverflow) {
      const options = {
        uri: 'https://stackoverflow.com/jobs?q=' + dataPackage.jobTitle + '&l=' + dataPackage.jobLocation + '&d=20&u=Miles&sort=i',
        transform: (body) => {return cheerio.load(body);}
      };
      rp(options)
      .then(($) => {
        $('.-job-item').each(function(index, value) {
          let stackOverflowJobListingFn = (callback) => {
            stackOverflowFormatted.push({});
            let postTime = $(this).find('.-posted-date.g-col').text();
            stackOverflowFormatted[index].postTime = postTime.trim();
            var url = 'https://stackoverflow.com/jobs/' + $(this).attr('data-jobid');
            const options = {
              uri: url,
              transform: (body) => {return cheerio.load(body);}
            };
            rp(options)
            .then(($) => {
              let rankScoreObj = rankScore(dataPackage, $('div.description').text());
              stackOverflowFormatted[index].title = $('a.title.job-link').attr('title');
              stackOverflowFormatted[index].companyName = $('a.employer').text();
              stackOverflowFormatted[index].location = $('div.-location').first().text().trim().replace("- \n","");
              stackOverflowFormatted[index].url = url;
              stackOverflowFormatted[index].readMore = false;
              stackOverflowFormatted[index].hidden = false;
              stackOverflowFormatted[index].source = "stackOverflow";
              stackOverflowFormatted[index].descriptionHTML = $('div.description').html();
              stackOverflowFormatted[index].descriptionText = $('div.description').text();
              stackOverflowFormatted[index].rankScore = rankScoreObj.rankScore;
              stackOverflowFormatted[index].descriptionHasTech = rankScoreObj.descriptionHasTech;
              callback();
            })
            .catch((err) => {
              console.log(err);
            });
          }
          asyncSoJobListingFns.push(stackOverflowJobListingFn);
        });
        async.parallel(asyncSoJobListingFns, function(err, results) {
          callback();
        });
      })
      .catch((err) => {
        console.log(err);
      });
    }
    else {
      callback();
    }
  }

  var hackerNewsTrack = function(callback2) {
    async.parallel(
      [
        getUserCoordinates,
        scrapeHackerNews
      ],
      function(err, results) {
        callback2();
      }
    );
  }

  async.parallel(
    [
      hackerNewsTrack,
      githubAPI,
      scrapeStackOverflowJobSearchPage
    ],
    function(err, results) {
      let i = 0;
      while (i < hnFormatted.length) {
        if (!hnFormatted[i].distance) {
          hnFormatted.splice(i, 1);
        }
        else {
          i++;
        }
      }
      returnDataPackage = returnDataPackage.concat(hnFormatted.concat(githubFormatted.concat(stackOverflowFormatted)));
      returnDataPackage = jobSort(returnDataPackage);
      res.send(returnDataPackage);
    }
  );

});

//   Promise.all(asyncFns).then(() => {
//     Promise.all(asyncFns2).then(() => {
//       res.send(jobSort(returnDataPackage));
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// });

app.listen(process.env.PORT || 3001);
console.log('listening on 3001');

module.exports = app;
