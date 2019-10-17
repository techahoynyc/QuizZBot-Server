require('dotenv').config();
const { createLogger, transports ,format} = require('winston');
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.printf(
      info => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
),
  transports: [
    new transports.File({
      filename: './logs/QuizZBot-Server-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info',
     })
  ]
});

var express = require('express'),
  exphbs = require('express-handlebars'),
  app = express(),
  port = process.env.EHBPORT;
logger.error('Starting!')
logger.info('Info block..')

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
