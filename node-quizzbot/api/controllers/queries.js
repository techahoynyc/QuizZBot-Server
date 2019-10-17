'use strict';

const fs = require('fs');
let rawdata = fs.readFileSync('qset.json');
let questions = JSON.parse(rawdata);
var totalQs = questions.length - 1

console.log(`There are ${totalQs} question(s)`)
console.log(questions)
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'pi',
  host: 'localhost',
  database: 'quizzbot',
  password: '$#Cur1tyDB',
  port: 5432,
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
    console.log(results.rows[0].ip)
    var ip = results.rows[0].ip
    if (!ip){
      console.log(`--QBID #${qbid} is not found`)
      res.send(`ERROR: QBID #${qbid} is not found<BR>Please speak to your teacher.`)
    } else {
      console.log(`--QBID #${qbid} is ready to play!`)
      pool.query('SELECT max(q) FROM players WHERE qbid = $1', [qbid], (error, results) => {
        if (error) {
          throw error
        }
        var currQ = results.rows[0].max
        if (!currQ)
          currQ = 0
        console.log(`--QBID #${qbid} last answered question #${currQ}`)
        if(totalQs > currQ){
          currQ+=1
          console.log(`--QBID #${qbid} is now on question #${currQ}`)
          res.render('home.handlebars',{question:questions[currQ].question,answer:questions[currQ].answer,id:currQ,qbid:qbid,ip:ip});
        } else {
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
  console.log(`--QBID #${qbid} received ${points} point(s)`)
  console.log(`----Redirecting QBID #${qbid} to ${url}`)
  res.redirect(url)
};
