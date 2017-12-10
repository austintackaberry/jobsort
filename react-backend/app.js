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

function rankScore(dataPackage, description) {
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
    if (description.match(re)) {
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
  }
  let rankTotal = 0;
  allLangsCount.map((element) => {rankTotal += element.isInDescription;});
  rankScore /= rankTotal;
  return rankScore;
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
  async.series([
    (callback) => {
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
          githubFormatted.push(
            {
              url: 'https://jobs.github.com/positions/' + githubData[j].id,
              title: githubData[j].title,
              postTime: githubData[j].created_at,
              location: githubData[j].location,
              type: githubData[j].type,
              description: githubData[j].description,
              source: "github",
              rankScore: rankScore(dataPackage, githubData[j].description)
            }
          );
        }
        returnDataPackage = returnDataPackage.concat(githubFormatted);
        callback();
      })
      .catch(e => {
        console.log(e);
      });

    },
    (callback) => {
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
                  let fullPost = $(this).html();
                  hnFormatted.push({source:"hackerNews", fullPostText:text, fullPostHTML:fullPost})
                  if ($($(this).contents()[1]).attr('href')) {
                    hnFormatted[hnFormatted.length -1].url = $($(this).contents()[1]).attr('href');
                    descriptionHTML = $($(this).contents().slice(2)).text();
                  }
                  else {
                    descriptionHTML = $($(this).contents().slice(1)).text();
                  }
                  hnFormatted[hnFormatted.length -1].companyName = listingInfo.shift();
                  hnFormatted[hnFormatted.length -1].description = descriptionHTML;
                  hnFormatted[hnFormatted.length - 1].rankScore = rankScore(dataPackage, text);
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
              callback();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    (callback) => {
      const options = {
        uri: 'https://stackoverflow.com/jobs?q=' + dataPackage.jobTitle + '&l=' + dataPackage.jobLocation + '&d=20&u=Miles&sort=i',
        transform: (body) => {return cheerio.load(body);}
      };
      rp(options)
      .then(($) => {
        var soLinkFunctions = [];
        $('.-job-item').each(function(index, value) {
          soLinkFunctions.push(
            () => {
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
                  stackOverflowFormatted[index].title = $('a.title.job-link').attr('title');
                  stackOverflowFormatted[index].companyName = $('a.employer').text();
                  stackOverflowFormatted[index].location = $('div.-location').first().text().trim().replace("- \n","");
                  stackOverflowFormatted[index].url = url;
                  stackOverflowFormatted[index].source = "stackOverflow";
                  stackOverflowFormatted[index].description = $('div.description').text();
                  stackOverflowFormatted[index].rankScore = rankScore(dataPackage, stackOverflowFormatted[index].description);
                  resolve();
                })
                .catch((err) => {
                  console.log(err);
                });
              });
            }
          );
        });
        soLinkFunctions.push(
          () => {
            return new Promise((resolve, reject) => {
              returnDataPackage = returnDataPackage.concat(stackOverflowFormatted)
              returnDataPackage = jobSort(returnDataPackage);
              res.send(returnDataPackage);
              resolve();
            });
          }
        );
        var promise = soLinkFunctions[0]();
        for (var i = 1; i < soLinkFunctions.length; i++) {
          promise = promise.then(soLinkFunctions[i]);
        }
        callback();
      })
      .catch((err) => {
        console.log(err);
      });
    }
  ]);
});

app.listen(process.env.PORT || 3001);
console.log('listening on 3001');

module.exports = app;
