# QuizZBot
## Description
QuizZBot is built off of [CoreTechR's](https://github.com/CoretechR) Raspberry Pi Zero FPV Robot and utilizes in game questions to challenge players as they race around a predefined course.

The questions are customized per player, team, or class and stored in a JSON file for easy readability.

## Requirements
The game requires at minimum the following:
* 2 (minimum) ZeroBot FPV Robots
* 1 Raspberry Pi 2/3/4 for the server

## Setup
### Server
The server setup consists of a web server, to display the leaderboard and acts a front-end for the database, and database server, to record the scores for each team.

For this guide we will be running NodeJS (web server) and Postgresql (database server) on a Raspberry Pi 3 and are assuming you have already installed and connected your Raspberry Pi to your network.

__Web Server__
1. Install NodeJS
   ```
   sudo apt-get install node.js npm
   ```

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
  $ psql
  > create database quizzbot;
  ```

1. Connect to the quizzbot database
  ```
  psql quizzbot
  ```

1. Create the leaderboard table
  ```
  quizzbot=> create table leaderboard (qbid text, teamname text, score integer);
  ```
  
### Client

## Game Play
* RPi boots and automatically downloads qset
 * (qset changes daily or via some preset rate)
* User connects to RPi and starts race
* At preset intervals the user is prompted to answer questions
 * wrong answer results in +5 second __penalty__ or __reask__
 * right answer results in -5 second __reward__
* Team with best __score__ or __first place__ wins

## Setup
**QuizZBot**
https://hackaday.io/project/25092/instructions
https://github.com/alphacharlie/node-ads1x15/issues/4
**Server**
#### Leaderboard
/get shows Leaderboard
/post RPi invididual results

## Refernce links
https://opensource.com/article/17/10/set-postgres-database-your-raspberry-pi
https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/
https://medium.com/@paupavon/handling-form-submissions-in-nodejs-876bc980dc0a
https://www.npmjs.com/package/pug

***NodeJS***
https://flaviocopes.com/express-forms/
https://hub.packtpub.com/using-handlebars-express/
https://stackabuse.com/reading-and-writing-json-files-with-node-js/
https://www.npmjs.com/package/express-handlebars
