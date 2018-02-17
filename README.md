[![Coverage Status](https://coveralls.io/repos/github/austintackaberry/jobsort/badge.svg?branch=master)](https://coveralls.io/github/austintackaberry/jobsort?branch=master)
[![Build Status](https://travis-ci.org/austintackaberry/jobsort.svg?branch=master)](https://travis-ci.org/austintackaberry/jobsort)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# jobSort()

jobSort() is a web application that queries a MySQL database for Hacker News data. A separate node app scrapes Hacker News and populates the database hourly. The job listings are sorted by which languages the user knows and how familiar the user is with each of them. Optimized for desktop and mobile.

## Getting Started

In order to run a dev server on your local host, you will need to first install all the required npm packages.

`npm install`

`cd react-backend && npm install`

`cd client && npm install`
  
Next you will need to navigate to the client folder and execute:

`cd job-sort/react-backend/client`

`npm start`
  
This will spin up a server on port 3000 for the frontend. Next you will need to open up an additional terminal and start up a server for the backend on port 3001:

`cd ..`

`node app.js`
  
Now you are all set up!

## Running the tests

Tests were created using mocha, chai, enzyme, and sinon

Running these tests is as easy as...

`cd job-sort/react-backend/client`

`npm run coverage`

## Built With

* React
* Redux
* Nodejs
* Express
* Cheerio
* MySQL
* AWS

## Authors

Austin Tackaberry

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
