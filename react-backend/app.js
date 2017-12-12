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
  let allLangsCount = [];
  let descriptionHasTech = [];
  let rankScore = 0;
  for (let i = 0; i < dataPackage.allLangs.length; i++) {
    let regexVar = dataPackage.allLangs[i].replace(/\+/g,"\\$&");
    var re = new RegExp(regexVar, 'i');
    if (regexVar === 'c') {
      var re = new RegExp(/[^a-zA-Z0-9]c[^a-zA-Z0-9]/i);
    }
    else if (regexVar === 'r') {
      var re = new RegExp(/[^a-zA-Z0-9]r[^a-zA-Z0-9]/i);
    }
    else if (regexVar === 'html') {
      var re = new RegExp(/^\.html/i);
    }
    else if (regexVar === '.net') {
      var re = new RegExp(/\.net(?!\s?core)/i);
    }
    else if (regexVar === 'react native') {
      var re = new RegExp(/react\s?native/i);
    }
    else if (regexVar === 'java') {
      var re = new RegExp(/java\s?script/i);
    }
    let test = re.test(description);
    if (regexVar === 'react') {
      var re1 = new RegExp(/react(?!\s?native)/i);
      var re2 = new RegExp(/react(?![a-ik-z])/i);
      test = re1.test(description) && re2.test(description);
    }
    allLangsCount.push({language: dataPackage.allLangs[i]});
    if (test) {
      allLangsCount[i].isInDescription = 1;
      descriptionHasTech.push(dataPackage.allLangs[i]);
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
  }
  let rankTotal = 0;
  allLangsCount.map((element) => {rankTotal += element.isInDescription;});
  rankScore /= rankTotal;
  if (rankScore === null) {
    rankScore = 0;
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
  if (dataPackage.checked.github) {
    asyncFns.push(
      (() => {
        return new Promise((resolve, reject) => {
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
            var githubFormatted = [];
            for (let j = 0; j < githubData.length; j++) {
              let rankScoreObj = rankScore(dataPackage, htmlToText.fromString(githubData[j].description, {wordwrap: 1}));
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
            returnDataPackage = returnDataPackage.concat(githubFormatted);
            resolve();
          })
          .catch(e => {
            console.log(e);
          });
        });
      })()
    );
  }
  if (dataPackage.checked.hackerNews) {
    asyncFns.push(
      (() => {
        return new Promise((resolve, reject) => {
          const options = {
            uri: 'https://news.ycombinator.com/submitted?id=whoishiring',
            transform: (body) => {return cheerio.load(body);}
          };
          rp(options)
          .then(($) => {
            let whoIsHiringLink;
            var hnFormatted = [];
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
                  let j = 0;
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
                    j++;
                  }
                  // if (listingInfo.length > 0) {
                  //   console.log(listingInfo);
                  // }
                }
              });
              returnDataPackage = returnDataPackage.concat(hnFormatted);
              resolve();
            })
            .catch((err) => {
              console.log(err);
            });
          })
          .catch((err) => {
            console.log(err);
          });
        });
      })()
    );
  }
  if (dataPackage.checked.stackOverflow) {
    asyncFns.push(
      (() => {
        return new Promise((resolve1, reject) => {
          const options = {
            uri: 'https://stackoverflow.com/jobs?q=' + dataPackage.jobTitle + '&l=' + dataPackage.jobLocation + '&d=20&u=Miles&sort=i',
            transform: (body) => {return cheerio.load(body);}
          };
          rp(options)
          .then(($) => {
            $('.-job-item').each(function(index, value) {
              asyncFns2.push(
                ((index) => {
                  return new Promise((resolve, reject) => {
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
                      let rankScoreObj = rankScore(dataPackage, stackOverflowFormatted[index].descriptionText);
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
                      resolve();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                  });
                })(index)
              );
            });
            asyncFns2.push(
              (() => {
                return new Promise((resolve, reject) => {
                  returnDataPackage = returnDataPackage.concat(stackOverflowFormatted)
                  returnDataPackage = jobSort(returnDataPackage);
                  resolve();
                });
              })()
            );
            resolve1();
          })
          .catch((err) => {
            console.log(err);
          });
        });
      })()
    );
  }
  Promise.all(asyncFns).then(() => {
    Promise.all(asyncFns2).then(() => {
      res.send(jobSort(returnDataPackage));
    })
    .catch((err) => {
      console.log(err);
    });
  })
  .catch((err) => {
    console.log(err);
  });
});

app.listen(process.env.PORT || 3001);
console.log('listening on 3001');

module.exports = app;
