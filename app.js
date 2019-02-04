var express = require("express");
var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");
var fetch = require("node-fetch");
const AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-1" });

const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

var app = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

function getDistanceInMilesFromUser(userCoordinates, jobCoordinates) {
  const lat1 = userCoordinates.lat;
  const lon1 = userCoordinates.lng;
  const lat2 = jobCoordinates.lat;
  const lon2 = jobCoordinates.lng;
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d / 1.60934; //Distance in miles
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function getHnDistance(userCoordinates, latitude, longitude) {
  let jobCoordinates = {
    lat: latitude,
    lng: longitude
  };
  return getDistanceInMilesFromUser(userCoordinates, jobCoordinates);
}

function hackerNewsFormatTimePosted(postTime) {
  let dateNow = new Date();
  let timeNow = dateNow.getTime();
  let relativePostTime;
  if (isNaN(postTime)) {
    relativePostTime = timeNow - Date.parse(postTime);
  } else {
    relativePostTime = timeNow - postTime;
  }

  let seconds = relativePostTime / 1000.0;
  let postTimeStr;
  if (seconds < 60) {
    postTimeStr = `${Math.round(seconds)}s ago`;
    return postTimeStr;
  }

  let minutes = seconds / 60;
  if (minutes < 60) {
    postTimeStr = `${Math.round(minutes)}min ago`;
    return postTimeStr;
  }

  let hours = minutes / 60;
  if (hours < 24) {
    postTimeStr = `${Math.round(hours)}h ago`;
    return postTimeStr;
  }

  let days = hours / 24;
  if (days < 7) {
    postTimeStr = `${Math.round(days)}d ago`;
    return postTimeStr;
  }

  let weeks = days / 7;
  postTimeStr = `${Math.round(weeks)}w ago`;
  return postTimeStr;
}

function rankScore(dataPackage, description) {
  let allTechsCount = [];
  let descriptionHasTech = [];
  let rankScore = 0;
  for (let i = 0; i < dataPackage.allTechs.length; i++) {
    let test;
    let regexVar = dataPackage.allTechs[i];
    let re = generateRegex(regexVar);
    if (regexVar === "c") {
      let tempDescription = description;
      tempDescription = tempDescription.replace(
        /objective\sc|objective\-c|series\sc/gi,
        ""
      );
      re = new RegExp(/[^a-zA-Z0-9]c(?!\+\+)(?![\#a-zA-Z0-9])/i);
      test = re.test(tempDescription);
    } else {
      test = re.test(description);
    }
    allTechsCount.push({ language: dataPackage.allTechs[i] });
    if (test) {
      allTechsCount[i].isInDescription = 1;
      descriptionHasTech.push(dataPackage.allTechs[i]);
      dataPackage.userTechnologies.map(element => {
        if (element.language == dataPackage.allTechs[i]) {
          rankScore += element.weight;
        }
        return element.language == dataPackage.allTechs[i];
      });
    } else {
      allTechsCount[i].isInDescription = 0;
    }
  }
  let rankTotal = 0;
  allTechsCount.map(element => {
    rankTotal += element.isInDescription;
  });
  if (rankTotal === 0) {
    rankScore = 0.000000001;
  } else {
    rankScore = rankScore / rankTotal;
  }
  return { rankScore: rankScore, descriptionHasTech: descriptionHasTech };
}

function generateRegex(regexVar) {
  let re;
  if (regexVar === ".net") {
    re = new RegExp(/[^a-z0-9]\.net[^a-z0-9]/i);
  } else if (regexVar === "c++") {
    re = new RegExp(/c\+\+/i);
  } else {
    re = new RegExp(`[^a-zA-Z0-9é]${regexVar}[^a-zA-Z0-9é&]`, "i");
  }
  if (regexVar === "html") {
    return new RegExp(/[^\.]html/i);
  } else if (regexVar === "react native") {
    return new RegExp(/react\s?native/i);
  } else if (regexVar === "java") {
    return new RegExp(/java(?!script)/i);
  } else if (regexVar === "objective-c") {
    return new RegExp(/(objective-c)|(objective\sc)/i);
  } else if (regexVar === "node") {
    return new RegExp(
      /([^a-zA-Z0-9é]node[^a-zA-Z0-9é&])|([^a-zA-Z0-9é]nodejs[^a-zA-Z0-9é&])/i
    );
  } else if (regexVar === "javascript") {
    return new RegExp(
      /([^a-zA-Z0-9é]javascript[^a-zA-Z0-9é&])|([^a-zA-Z0-9é\.]js[^a-zA-Z0-9é&])/i
    );
  } else if (regexVar === "react") {
    return new RegExp(/react(?![a-ik-z])(?!\s?native)/i);
  }
  return re;
}

function jobSort(listingData) {
  listingData.sort((a, b) => {
    return b.rankScore - a.rankScore;
  });
  return listingData;
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.post("/getresults", function(req, res) {
  console.log("getresults received request");
  var dataPackage = JSON.parse(req.body);
  var userCoordinates = {};
  var hnFormatted = [];

  async function fetchGeocodeData(url) {
    const fetchRes = await fetch(url, {
      method: "GET"
    });
    const response = fetchRes.json();
    return response;
  }

  async function getUserCoordinates(userLocation) {
    if (userLocation) {
      let re = /remote/gi;
      if (!re.test(userLocation)) {
        let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${userLocation}&key=${
          process.env.GOOGLE_API_KEY
        }`;
        const data = await fetchGeocodeData(url);
        if (!data.results[0]) {
          console.log(data);
          userCoordinates = false;
        } else {
          userCoordinates = data.results[0].geometry.location;
        }
        return Promise.resolve(userCoordinates);
      } else {
        return Promise.resolve("remote");
      }
    } else {
      return Promise.resolve(false);
    }
  }

  const getHnData = userCoordinates => {
    return new Promise(async function(resolve, reject) {
      try {
        const results = await callSelectQuery();
        console.log("success!");
        hnFormatted = results.slice();
        hnFormatted.map((listing, index) => {
          hnFormatted[index].postTimeStr = hackerNewsFormatTimePosted(
            listing.postTimeInMs
          );
          if (userCoordinates == "remote") {
            let re = /remote/gi;
            if (re.test(listing.type)) {
              hnFormatted[index].distance = 5;
            } else {
              hnFormatted[index].distance = false;
            }
          } else {
            let distance = getHnDistance(
              userCoordinates,
              listing.latitude,
              listing.longitude
            );
            if (
              distance > 100 ||
              (listing.latitude == 0 && listing.longitude == 0)
            ) {
              hnFormatted[index].distance = false;
            } else {
              hnFormatted[index].distance = distance;
            }
          }
          hnFormatted[index].fullPostText = new Buffer(
            listing.fullPostText
          ).toString("utf8");
          hnFormatted[index].descriptionText = new Buffer(
            listing.descriptionText
          ).toString("utf8");
          if (listing.compensation) {
            hnFormatted[index].compensation = new Buffer(
              listing.compensation
            ).toString("utf8");
          }
          if (listing.location) {
            hnFormatted[index].location = new Buffer(listing.location).toString(
              "utf8"
            );
          }
          hnFormatted[index].hidden = false;
          hnFormatted[index].readMore = false;
          let rankScoreObj = rankScore(dataPackage, listing.fullPostText);
          hnFormatted[index].rankScore = rankScoreObj.rankScore;
          hnFormatted[index].descriptionHasTech =
            rankScoreObj.descriptionHasTech;
        });
        resolve(hnFormatted);
      } catch (error) {
        console.log(`Query Error: ${error}`);
        reject(error);
      }
    });
  };
  async function callSelectQuery() {
    var params = {
      TableName: "jobsort"
    };
    return new Promise((resolve, reject) => {
      docClient.scan(params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          console.log("Received all documents...");
          resolve(data.Items);
        }
      });
    });
  }

  async function getAsyncData() {
    const userCoordinates = await getUserCoordinates(dataPackage.userLocation);
    const hnFormatted = await getHnData(userCoordinates);
    return Promise.resolve({
      hnFormatted: hnFormatted,
      userCoordinates: userCoordinates
    });
  }

  getAsyncData().then(results => {
    let i = 0;
    if (results.userCoordinates) {
      while (i < results.hnFormatted.length) {
        if (!results.hnFormatted[i].distance) {
          results.hnFormatted.splice(i, 1);
        } else {
          i++;
        }
      }
    }
    const returnDataPackage = jobSort(results.hnFormatted);
    res.send(returnDataPackage);
  });
});

app.listen(process.env.PORT || 3001);
console.log("listening on 3001");

module.exports = app;
