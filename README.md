# QuizZBot-Server
## Description
QuizZBot-Server is the backend system for [QuizZBot](https://github.com/techahoynyc/QuizZBot) providing a web based leaderboard and database for score tracking.  

## Requirements
The game requires at minimum the following:
* 2 (minimum) QuizZBots
* 1 Raspberry Pi 2/3/4 for the server

## Setup
### Server
The server setup consists of a web server, to display the leaderboard and acts a front-end for the database, and database server, to record the scores for each team.

For this guide we will be running NodeJS (web server) and Postgresql (database server) on a Raspberry Pi 3 and are assuming you have already installed and connected your Raspberry Pi to your network.
__Prerequisites__
1. Install Git
   ```
   sudo apt-get install git
   ```

__Web Server__
1. Install NodeJS
   ```
   sudo apt-get install node.js npm
   ```

1. Clone QuizZBot repository
   ```
   git clone https://github.com/techahoynyc/quizzbot
   ```

1. Download dependencies listed in package.json file
   ```
   ~ $ cd quizzbot/node-quizzbot
   ~/quizzbot/node-quizzbot $ npm install
   ```

__Database Server__
1. Install Postgresql
   ```
   sudo apt install postgresql libpq-dev postgresql-client
   postgresql-client-common -y
   ```

1. Setup Postgresql and grant the pi user access
   ```
   sudo su postgres
   createuser pi -P --interactive
   ```

1. Create the quizzbot database
   ```
   ~ $ psql
   > create database quizzbot
   ```

1. Connect to the quizzbot database
   ```
   psql quizzbot
   ```

1. Create the leaderboard table
   ```
   quizzbot=> create table leaderboard (qbid text, teamname text, score integer);
   ```

## Game Play
__V1__
* [x] Start/Stop race manually
* [x] Access questions page with QButton
* [ ] Points and penalties dependent on right or wrong answer, respectively
 * Points: Correct answer is +10 points
 * Banana penalty: QZB spins in place for some seconds and +0 points
* [ ] Leaderboard to display leaders using QZB unique ID

__V2__
* [ ] Grafan metrics
* [ ] Leaderboard is composed of users or team names requiring sign-in independent of car
* [ ] Thoughtfulness()
* [ ] Easily change QSet
* [ ] At preset intervals the user is prompted to answer questions
* [ ] Rewards for correct answer
* [ ] Time racers

## Refernce links
__ZeroBot__
https://hackaday.io/project/25092/instructions  
https://github.com/alphacharlie/node-ads1x15/issues/4  

__Postgresql__
https://opensource.com/article/17/10/set-postgres-database-your-raspberry-pi  
https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/  

__NodeJS__
https://medium.com/@paupavon/handling-form-submissions-in-nodejs-876bc980dc0a  
https://flaviocopes.com/express-forms/  
https://hub.packtpub.com/using-handlebars-express/  
https://stackabuse.com/reading-and-writing-json-files-with-node-js/  
https://www.npmjs.com/package/express-handlebars  
