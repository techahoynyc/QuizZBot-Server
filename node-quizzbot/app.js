var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
const db = require('./queries');
const port = 3000;

'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('qset.json');
let questions = JSON.parse(rawdata);
console.log(questions.qset.math);
console.log("there are " + Object.keys(questions).length + " questions");
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('home',{question:questions.qset.math.q1.question,answer:questions.qset.math.q1.answer});
});

app.post('/submit-form', (req,res)=>{
    const answer = req.body.answer;
    const correct = req.body.correct;
    if(answer == correct){
       console.log("CORRECT ANSWER!");
       res.redirect('/');
    } else {
       console.log("WRONG");
       res.redirect('/touch.html?action=slip');
    }
    //res.redirect('/touch.html?action=slip');
});

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
});
