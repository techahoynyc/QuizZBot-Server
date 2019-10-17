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

exports.getQbyQBID = function(req, res) {
  const qbid = parseInt(req.params.qbid)
  var ip = 0
  pool.query('SELECT ip from quizzbots WHERE qbid = $1', [qbid], (error, results) => {
    if (error) {
      throw error
    }
    if (results.rows[0] == undefined) {
      logger.error(`QBID #${qbid} cannot be found - Verify it's registered in the DB!`)
      res.send(`ERROR: QBID #${qbid} is not found<BR>Please speak to your teacher.`)
    } else {
      var ip = results.rows[0].ip
      logger.info(`QBID #${qbid} is ready to play!`)
      pool.query('SELECT max(q) FROM players WHERE qbid = $1', [qbid], (error, results) => {
        if (error) {
          throw error
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

  pool.query('INSERT INTO players (qbid, q, a) VALUES ($1, $2, $3)', [qbid, id, points], (error, results) => {
    if (error) {
      throw error
    }
  })
  logger.info(`QBID #${qbid} answered question #${id} and received ${points} point(s)!`)
  logger.info(`Redirecting QBID #${qbid} to ${url}`)
  res.redirect(url)
};
