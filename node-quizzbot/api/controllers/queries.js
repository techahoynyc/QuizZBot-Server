'use strict';

const fs = require('fs');
let rawdata = fs.readFileSync('qset.json');
let questions = JSON.parse(rawdata);
var totalQs = questions.length - 1

const { loggers } = require('winston')
const logger = loggers.get('quizzbot-logger')

logger.debug(`There are ${totalQs} question(s)`)
logger.debug(questions)
const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: 'localhost',
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
})

exports.getHome = function(req, res) {
  res.send('Welcome to QuizZBot!<BR>Please use an authorized QuizZBot to receive your first question.')
};

exports.getHome2 = function(req, res) {
  res.send('Home2')
};

exports.getQbyQBID = function(req, res) {
  const qbid = parseInt(req.params.qbid)
  var ip = 0
  pool.query('SELECT ip from quizzbots WHERE qbid = $1', [qbid], (error, results) => {
    if (error) {
      logger.error(error)
    }
    if (results.rows[0] == undefined) {
      logger.error(`QBID #${qbid} not found - Verify it's registered in the DB!`)
      res.send(`ERROR: QBID #${qbid} is not found<BR>Please speak to your teacher.`)
    } else {
      var ip = results.rows[0].ip
      logger.info(`QBID #${qbid} is ready to play!`)
      pool.query('SELECT max(q) FROM players WHERE qbid = $1', [qbid], (error, results) => {
        if (error) {
          logger.error(error)
        }
        var currQ = results.rows[0].max
        if (!currQ)
          currQ = 0
        logger.debug(`QBID #${qbid} last answered question #${currQ}`)
        if(totalQs > currQ){
          currQ+=1
          logger.info(`QBID #${qbid} is now on question #${currQ}`)
          res.render('home.handlebars',{question:questions[currQ].question,answer:questions[currQ].answer,id:currQ,qbid:qbid,ip:ip});
        } else {
          logger.info(`QBID #${qbid} has answered all the questions!`)
          res.send('You completed all the questions!');
        }
      });
    }
  });
};

exports.saveAnswer = function(req, res) {
  const { qbid, id, answer, correct, ip } = req.body
  var points = 0
  var action = 'slip'
  if(answer == correct){
    points = 1
    action = 'drive'
  }
  var url = 'http://' + ip + ':3000/?action=' + action

  //record player answer
  pool.query('INSERT INTO players (qbid, q, a) VALUES ($1, $2, $3)', [qbid, id, points], (error, results) => {
    if (error) {
      logger.error(error)
    }
    logger.info(`QBID #${qbid} answered question #${id} and received ${points} point(s)!`)
  })

  //update leaderboard
  var score = 0
  pool.query('INSERT INTO leaderboard (qbid, score) VALUES ($1, $2) ON CONFLICT (qbid) DO UPDATE SET score = leaderboard.score + ($2) RETURNING score', [qbid, points], (error, results) => {
    if (error) {
      logger.error(error)
    }
    score = results.rows[0].score
    logger.info(`QBID #${qbid} has a total score of ${score} `)
  })

  logger.debug(`Redirecting QBID #${qbid} to ${url}`)
  res.redirect(url)
};

exports.getLeaderboard = function(req, res){

  pool.query('SELECT * FROM leaderboard ORDER BY score desc', (error, results) => {
    if (error) {
      logger.error(error)
    }
    var data = results.rows;
    console.log(data);
    res.render('leaderboard.handlebars', {standings: data} );
  });

};

exports.resetGame = function(req, res){
  //reset leaderboard
  pool.query('DELETE FROM leaderboard', (error, results) => {
    if (error) {
      logger.error(error)
    }
  });
  //reset player results
  pool.query('DELETE FROM players', (error, results) => {
    if (error) {
      logger.error(error)
    }
  });

  res.send('QuizZBot Game has been reset!')
};
