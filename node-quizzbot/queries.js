const fs = require('fs');
let rawdata = fs.readFileSync('qset.json');
let questions = JSON.parse(rawdata);

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'pi',
  host: 'localhost',
  database: 'quizzbot',
  password: '$#Cur1tyDB',
  port: 5432,
})

const saveAnswer = (req, res) => {
  const { qbid, q, a, c, ip } = req.body
  const score = 0
  const action = 'slip'
  if(a == c){
    score = 1
    action = 'drive'
  }
  pool.query('INSERT INTO players (qbid, q, score) VALUES ($1, $2, $3)', [qbid, q, score], (error, results) => {
    if (error) {
      throw error
    }
    console.log(`${qbid} scored ${score} point(s)`)
  })
  res.redirect('http://${ip}:3000/?action=${action}')
}

const getQbyQBID = (req, res) => {
  const qbid = parseInt(req.params.qbid)

  pool.query('SELECT max(q) FROM players WHERE qbid = $1', [qbid], (error, results) => {
    if (error) {
      throw error
    }
    currQ = results.rows[0]
    if(questions.length > currQ){
      currQ++
      response.render('home',{question:currQ.q});
    } else {
      response.render('You completed all the questions!');
    }
  })
}

module.exports = {
  saveAnswer,
  getQbyQBID,
}
