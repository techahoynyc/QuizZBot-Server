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

1. Create quizzbots user
   ```
   sudo adduser quizzbots
   ```

1. Add quizzbots user to sudo group
   ```
   sudo usermod -aG sudo quizzbots
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
   createuser quizzbots -P --interactive
   ```

1. Create the quizzbots database
   ```
   ~ $ psql
   > create database quizzbots;
   > \q
   ```

1. Connect to the quizzbot database
   ```
   su quizzbots
   cd
   psql quizzbots
   ```

1. Create the various tables
   ```
   quizzbot=> create table leaderboard (qbid text, teamname text, score integer);
   quizzbot=> create table players (qbid text, q integer, a integer);
   quizzbot=> create table quizzbots (qbid text, ip text);
   ```

 1. Register the QuizZBots replacing the <place_holders> with their appropriate values, for each QuiZZBot you have.  
    QBID: A unique ID for each QuizZBot  
    IP Address: The QuizZBot's IP address  
    ```
    quizzbot=> insert into quizzbots values('<qbid>','<ip_address>');
    ```

__Web Server__
1. Install NodeJS
   ```
   sudo apt-get install node.js npm
   ```

1. Clone QuizZBot-Server repository
   ```
   git clone https://github.com/techahoynyc/QuizZBot-Server
   ```

1. Download dependencies listed in package.json file
   ```
   ~ $ cd QuizZBot-Server/node-quizzbot
   ~/QuizZBot-Server/node-quizzbot $ npm install
   ```

1. Create .env file for sensitive information
   ```
   ~/QuizZBot-Server/node-quizzbot $ nano .env
   ```

1. Add the following to the new .env file.  
   Replace the <place_holders> with their appropriate value (i.e. <db_port> could become 5432)
   ```
   DATABASE_USER=<db_user>
   DATABASE_PASSWORD=<db_user_password>
   DATABASE_NAME=<db_name>
   DATABASE_PORT=5432
   EHBPORT=3000
   ```

1. Install PM2 to manage and autostart the QuizZBot-Server process
   ```
   ~/QuizZBot-Server/node-quizzbot $ sudo npm i -g pm2
   ```

1. Start QuizZBot-Server and configure to autolaunch at boot
   ```
   ~/QuizZBot-Server/node-quizzbot $ pm2 start quizzbot-server.js
   ~/QuizZBot-Server/node-quizzbot $ pm2 startup
   ~/QuizZBot-Server/node-quizzbot $ pm2 save
   ```



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

__PM2__
https://www.tecmint.com/install-pm2-to-run-nodejs-apps-on-linux-server/
