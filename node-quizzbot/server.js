var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
const db = require('./queries');
const port = 3000;

'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('qset.json');
let questions = JSON.parse(rawdata);
console.log(questions);
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to QuizZBot!  Please use an authorized QuizZBot to receive your first question.');
});

app.get('/q/:qbid', db.getQbyQBID)
app.post('/q/:qbid/:answer', db.saveAnswer)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
});
