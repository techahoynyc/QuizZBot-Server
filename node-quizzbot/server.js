var express = require('express'),
  exphbs = require('express-handlebars'),
  app = express(),
  port = 3000;


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.urlencoded({extended: true}));
app.use(express.json());

var routes = require('./api/routes/questionRoutes.js');
routes(app);


app.listen(port, '0.0.0.0', () => {
  console.log(`App running on port ${port}.`)
});
