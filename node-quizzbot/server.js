require('dotenv').config();
const { createLogger, transports ,format} = require('winston');
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.json(),
    format.timestamp()
),
  transports: [
    // - Write all logs error (and below) to `somefile.log`.
    new transports.File({ filename: 'QuizZBot-Server.log', level: 'error' })
  ]
});

var express = require('express'),
  exphbs = require('express-handlebars'),
  app = express(),
  port = process.env.EHBPORT;
logger.info('Starting!')

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.urlencoded({extended: true}));
app.use(express.json());

var routes = require('./api/routes/questionRoutes.js');
routes(app);


app.listen(port, '0.0.0.0', () => {
  logger.log('info',`App running on port ${port}.`)
  console.log(`App running on port ${port}.`)
});
