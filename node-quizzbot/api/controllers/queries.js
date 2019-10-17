'use strict';

const fs = require('fs');
let rawdata = fs.readFileSync('qset.json');
let questions = JSON.parse(rawdata);
let totalQs = questions.length - 1;

console.log('There are ' + totalQs + ' question(s)')
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
  res.send('Welcome to QuizZBot!  Please use an authorized QuizZBot to receive your first question.')
};

exports.getQbyQBID = function(req, res) {
  const qbid = parseInt(req.params.qbid)
  const ip = req.ip

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
      res.render('home.handlebars',{question:questions[currQ].question,answer:questions[currQ].answer,id:currQ,ip:ip});
    } else {
      res.send('You completed all the questions!');
    }
  });
};

exports.saveAnswer = function(req, res) {
  const { qbid, id, answer, correct, ip } = req.body
  var points = 0
  var action = 'slip'
  if(answer == correct){
    score = 1
    action = 'drive'
  }
  var url = 'http://' + ip + ':3000/?action=' + action

  pool.query('INSERT INTO players (qbid, q, score) VALUES ($1, $2, $3)', [qbid, q, score], (error, results) => {
    if (error) {
      throw error
    }
  })
  console.log(`--QBID #${qbid} received ${points} point(s)`)
  console.log(`----Redirecting QBID #${qbid} to ${url}`)
  res.redirect(url)
};
